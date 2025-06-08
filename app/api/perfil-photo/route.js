import { connectToDb, sql } from '../../lib/db'; // Adjust this path if 'lib/db.js' is in a different location relative to this route.js
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

// Directory where profile pictures will be stored (relative to project root)
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'profile_pics');

// Ensure the upload directory exists when the server starts
fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);

// Helper function to extract file extension
const getFileExtension = (filename) => {
  return filename.split('.').pop();
};

/**
 * GET: Retrieves the user's profile photo URL based on their email.
 * Requires 'email' as a query parameter.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email'); // Get email from query parameter

  if (!email) {
    return NextResponse.json({ message: 'Email not provided' }, { status: 400 });
  }

  try {
    await connectToDb();

    // Query the ProfilePhotos table directly using the email
    const result = await sql.query`
      SELECT PhotoPath FROM ProfilePhotos WHERE UserEmail = ${email}
    `;

    let photoUrl = null;
    if (result.recordset.length > 0) {
      photoUrl = result.recordset[0].PhotoPath;
    }

    // Return the URL or null if no photo is set for this email
    return NextResponse.json({ photoUrl: photoUrl }, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching profile photo:', error);
    return NextResponse.json({ message: 'Internal server error fetching photo' }, { status: 500 });
  }
}

/**
 * PUT: Uploads and updates the user's profile photo.
 * Expects a FormData object with 'file' and 'email'.
 */
export async function PUT(request) {
  const formData = await request.formData();
  const file = formData.get('file');
  const email = formData.get('email'); // Get email from FormData

  if (!file || !(file instanceof File) || !email) {
    return NextResponse.json({ message: 'File or email not provided, or invalid file type.' }, { status: 400 });
  }

  // Basic file validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ message: 'Invalid file type. Only JPG, PNG, GIF are allowed.' }, { status: 400 });
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ message: 'File size exceeds 5MB limit.' }, { status: 400 });
  }

  try {
    await connectToDb();

    // Generate a unique filename and determine the full path and public URL
    const fileExtension = getFileExtension(file.name);
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, uniqueFileName);
    const publicUrl = `/profile_pics/${uniqueFileName}`; // This is the URL Next.js will serve

    // Convert file to buffer and save to the file system
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    // Check if a photo entry already exists for this email in ProfilePhotos
    const existingPhoto = await sql.query`
      SELECT PhotoPath FROM ProfilePhotos WHERE UserEmail = ${email}
    `;

    if (existingPhoto.recordset.length === 0) {
      // No entry exists, insert a new one
      await sql.query`
        INSERT INTO ProfilePhotos (UserEmail, PhotoPath)
        VALUES (${email}, ${publicUrl})
      `;
    } else {
      // Entry exists, update the PhotoPath
      const oldPhotoPath = existingPhoto.recordset[0].PhotoPath;
      await sql.query`
        UPDATE ProfilePhotos
        SET PhotoPath = ${publicUrl}, UpdatedAt = GETDATE()
        WHERE UserEmail = ${email}
      `;
      // Optional: Delete the old photo file to save space
      if (oldPhotoPath && oldPhotoPath.startsWith('/profile_pics/')) {
        const oldFilePath = path.join(process.cwd(), 'public', oldPhotoPath);
        await fs.unlink(oldFilePath).catch(err => console.error('Error deleting old photo:', err.message));
      }
    }

    return NextResponse.json({ message: 'Profile photo updated successfully', photoUrl: publicUrl }, { status: 200 });

  } catch (error) {
    console.error('❌ Error updating profile photo:', error);
    return NextResponse.json({ message: 'Internal server error updating photo. Check server logs.' }, { status: 500 });
  }
}