import { connectToDb, sql } from '../../lib/db'; // Import `connectToDb` and the `sql` object
import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Validate that userId is provided
    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        // IMPORTANT SECURITY NOTE:
        // In a real application, 'userId' MUST come from an authenticated session
        // (e.g., using NextAuth.js on the server-side).
        // DO NOT trust 'userId' directly from client-side query parameters in production.
        // For this example, we are using it directly as per your request,
        // but it's a security vulnerability without server-side authentication validation.

        await connectToDb(); // Ensure database connection pool is ready

        // Use sql.query as a tagged template literal, consistent with your working example
        // ✅ MODIFICADO: Incluir motivo_rechazo en la consulta
        const result = await sql.query`
            SELECT 
                estado,
                motivo_rechazo
            FROM educore.dbo.Solicitud_tutor1
            WHERE id_user = ${userId}
            ORDER BY id_solicitud DESC
            OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY; -- Standard SQL Server syntax for LIMIT 1
        `;

        // mssql returns results in 'recordset' (an array of rows)
        if (result.recordset && result.recordset.length > 0) {
            const solicitud = result.recordset[0];
            // ✅ MODIFICADO: Retornar tanto el status como el motivo de rechazo
            return NextResponse.json({ 
                status: solicitud.estado,
                motivo_rechazo: solicitud.motivo_rechazo || null
            }, { status: 200 });
        } else {
            // No application found for the given user
            return NextResponse.json({ 
                status: null, 
                motivo_rechazo: null,
                message: 'No tutor application found for this user.' 
            }, { status: 200 });
        }

    } catch (error) {
        console.error('Error fetching user application status:', error);
        // Return a 500 Internal Server Error response if something goes wrong
        return NextResponse.json({ 
            message: 'Internal server error fetching application status.',
            status: null,
            motivo_rechazo: null
        }, { status: 500 });
    }
}