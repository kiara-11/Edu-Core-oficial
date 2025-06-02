import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

// ✅ Obtener datos de perfil + user_name con JOIN
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ message: 'Correo no proporcionado' }, { status: 400 });
    }

    await connectToDb();

    const result = await sql.query`
      SELECT 
        CONCAT(dp.ApePat, ' ', dp.ApeMat, ' ', dp.Nombre) AS nombreCompleto,
        dp.email,
        dp.telefono,
        u.user_name,
        '' AS bio
      FROM Datos_personales dp
      JOIN Usuario u ON dp.id_dp = u.id_dp
      WHERE dp.email = ${email}
    `;

    if (result.recordset.length === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.recordset[0], { status: 200 });
  } catch (error) {
    console.error('❌ Error al obtener usuario:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

// ✅ Actualizar Datos_personales + Usuario
export async function PUT(request) {
  try {
    const data = await request.json();
    const { email, nombreCompleto, telefono, bio, user_name } = data;

    if (!email || !nombreCompleto || !user_name) {
      return NextResponse.json({ message: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const partes = nombreCompleto.trim().split(' ');
    const ApePat = partes[0] || '';
    const ApeMat = partes[1] || '';
    const Nombre = partes.slice(2).join(' ') || '';

    await connectToDb();

    // Obtener id_dp para actualizar también Usuario
    const idResult = await sql.query`
      SELECT id_dp FROM Datos_personales WHERE email = ${email}
    `;

    if (idResult.recordset.length === 0) {
      return NextResponse.json({ message: 'No se encontró el usuario' }, { status: 404 });
    }

    const id_dp = idResult.recordset[0].id_dp;

    // ✅ Actualizar Datos_personales
    await sql.query`
      UPDATE Datos_personales
      SET 
        ApePat = ${ApePat},
        ApeMat = ${ApeMat},
        Nombre = ${Nombre},
        telefono = ${telefono},
        email = ${email}
      WHERE id_dp = ${id_dp}
    `;

    // ✅ Actualizar Usuario (nombre de usuario)
    await sql.query`
      UPDATE Usuario
      SET user_name = ${user_name}
      WHERE id_dp = ${id_dp}
    `;

    return NextResponse.json({ message: 'Usuario actualizado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    return NextResponse.json({ message: 'Error al actualizar los datos' }, { status: 500 });
  }
}