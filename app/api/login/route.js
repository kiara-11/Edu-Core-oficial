import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email y contraseña son requeridos.' }, { status: 400 });
    }

    await connectToDb();

    // Verificar credenciales
    const result = await sql.query`
      SELECT u.psw, u.user_name, dp.email, CONCAT(dp.ApePat, ' ', dp.ApeMat, ' ', dp.Nombre) AS nombreCompleto
      FROM Usuario u
      JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      WHERE dp.email = ${email}
    `;

    if (result.recordset.length === 0) {
      return NextResponse.json({ message: 'Correo no registrado.' }, { status: 404 });
    }

    const user = result.recordset[0];

    if (user.psw !== password) {
      return NextResponse.json({ message: 'Contraseña incorrecta.' }, { status: 401 });
    }

    // Guardar en localStorage desde frontend
    return NextResponse.json({
      token: 'ok', // solo indicativo, no es JWT
      email: user.email,
      nombreCompleto: user.nombreCompleto,
      user_name: user.user_name
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error al iniciar sesión:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}