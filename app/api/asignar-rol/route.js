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

    const rolesValidos = ['Estudiante', 'Tutor'];
    if (!rolesValidos.includes(role)) {
      return NextResponse.json({ message: 'Rol no válido' }, { status: 400 });
    }

    await connectToDb();

    // ✅ Obtener Id_user desde Usuario JOIN Datos_personales
    const userResult = await sql.query`
      SELECT u.Id_user
      FROM Usuario u
      JOIN Datos_personales dp ON u.Id_dp = dp.Id_dp
      WHERE dp.email = ${email}
    `;

    if (userResult.recordset.length === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const id_user = userResult.recordset[0].Id_user;

    // ✅ Obtener Id_rol desde Rol
    const roleResult = await sql.query`
      SELECT id_rol FROM Rol WHERE desc_rol = ${role}
    `;

    if (roleResult.recordset.length === 0) {
      return NextResponse.json({ message: `Rol '${role}' no encontrado en la base de datos` }, { status: 404 });
    }


    const id_rol = roleResult.recordset[0].id_rol;

    // ✅ Verificar si ya existe una asignación en User_roles
    const existingRoleResult = await sql.query`
      SELECT * FROM User_roles WHERE Id_user = ${id_user}
    `;

    if (existingRoleResult.recordset.length > 0) {
      // Actualizar rol existente
      await sql.query`
        UPDATE User_roles 
        SET Id_rol = ${id_rol}
        WHERE Id_user = ${id_user}
      `;
    } else {
      // Insertar nueva asignación
      await sql.query`
        INSERT INTO User_roles (Id_user, Id_rol)
        VALUES (${id_user}, ${id_rol})
      `;
    }

    return NextResponse.json({
      message: `Rol '${role}' asignado correctamente al usuario.`,
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
