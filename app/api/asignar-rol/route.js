import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

// ✅ Asignar o actualizar rol de usuario
export async function PUT(request) {
  try {
    const data = await request.json();
    const { email, role } = data;

    if (!email || !role) {
      return NextResponse.json({ message: 'Email y rol son obligatorios' }, { status: 400 });
    }

    // Validar que el rol sea válido
    const rolesValidos = ['Estudiante', 'Tutor'];
    if (!rolesValidos.includes(role)) {
      return NextResponse.json({ message: 'Rol no válido' }, { status: 400 });
    }

    await connectToDb();

    // Obtener id_dp del usuario por email
    const userResult = await sql.query`
      SELECT id_dp FROM Datos_personales WHERE email = ${email}
    `;

    if (userResult.recordset.length === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const id_dp = userResult.recordset[0].id_dp;

    // Obtener id_rol según el rol
    const roleResult = await sql.query`
      SELECT id_rol FROM Rol WHERE nombreRol = ${role}
    `;

    if (roleResult.recordset.length === 0) {
      return NextResponse.json({ message: `Rol '${role}' no encontrado en la base de datos` }, { status: 404 });
    }

    const id_rol = roleResult.recordset[0].id_rol;

    // Verificar si ya existe una asignación de rol para este usuario
    const existingRoleResult = await sql.query`
      SELECT id_ur FROM Usuario_Rol WHERE id_dp = ${id_dp}
    `;

    if (existingRoleResult.recordset.length > 0) {
      // Actualizar rol existente
      await sql.query`
        UPDATE Usuario_Rol 
        SET id_rol = ${id_rol}
        WHERE id_dp = ${id_dp}
      `;
    } else {
      // Crear nueva asignación de rol
      await sql.query`
        INSERT INTO Usuario_Rol (id_dp, id_rol)
        VALUES (${id_dp}, ${id_rol})
      `;
    }

    return NextResponse.json({ 
      message: `Rol '${role}' asignado correctamente al usuario`,
      user_email: email,
      new_role: role
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error al asignar rol:', error);
    return NextResponse.json({ 
      message: 'Error al asignar el rol',
      error: error.message 
    }, { status: 500 });
  }
}