// /pages/api/assignRole.js
import { connectToDb, sql } from '../../lib/db'; // Conexión a la base de datos
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { userId, role } = await request.json();

    // Validar que los campos estén presentes
    if (!userId || !role) {
      return NextResponse.json(
        { message: 'Por favor, selecciona un rol' },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectToDb();

    // Actualizar el rol del usuario
    const result = await sql.query`
      UPDATE dbo.Usuarios
      SET rol_id = ${role}
      WHERE id_usuario = ${userId}
    `;

    // Verificar si la actualización fue exitosa
    if (result.rowsAffected[0] === 0) {
      return NextResponse.json(
        { message: 'No se pudo asignar el rol al usuario' },
        { status: 400 }
      );
    }

    // Respuesta exitosa
    return NextResponse.json(
      { message: 'Rol asignado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al asignar el rol', error: error.message },
      { status: 500 }
    );
  }
}
