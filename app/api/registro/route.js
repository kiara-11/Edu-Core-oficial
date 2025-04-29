import { connectToDb, sql } from '../../lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validar campos
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Por favor, llena todos los campos.' },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectToDb();

    // Verificar si el email ya está registrado
    const result = await sql.query`SELECT * FROM dbo.Usuarios WHERE email = ${email}`;
    if (result.recordset.length > 0) {
      return NextResponse.json(
        { message: 'Este email ya está registrado.' },
        { status: 400 }
      );
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario y obtener el ID
    const insertResult = await sql.query`
      INSERT INTO dbo.Usuarios (nombre_completo, email, contraseña, rol_id, fecha_registro, estado_id)
      OUTPUT INSERTED.id_usuario  -- Obtener el ID generado automáticamente
      VALUES (${name}, ${email}, ${hashedPassword}, 1, GETDATE(), 1)  -- Establecer rol_id y estado_id
    `;

    // Obtener el ID del nuevo usuario
    const userId = insertResult.recordset[0].id_usuario;

    // Respuesta exitosa
    return NextResponse.json(
      { message: 'Usuario registrado exitosamente', userId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al registrar el usuario', error: error.message },
      { status: 500 }
    );
  }
}
