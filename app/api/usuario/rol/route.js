import { connectToDb, sql } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ message: 'Email requerido' }, { status: 400 });
    }

    await connectToDb();

    const result = await sql.query`
      SELECT r.desc_rol
      FROM Usuario u
      JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      JOIN User_roles ur ON u.id_user = ur.id_user
      JOIN Rol r ON ur.id_rol = r.id_rol
      WHERE dp.email = ${email}
    `;

    if (result.recordset.length === 0) {
      return NextResponse.json({ rol: null }, { status: 200 });
    }

    return NextResponse.json({ rol: result.recordset[0].desc_rol }, { status: 200 });
  } catch (error) {
    console.error('❌ Error al obtener el rol del usuario:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}