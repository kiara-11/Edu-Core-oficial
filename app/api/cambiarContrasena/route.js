import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, contrasenaActual, contrasenaNueva } = await request.json();

    await connectToDb();

    // Verifica contraseña actual
    const result = await sql.query`
      SELECT psw FROM Usuario u
      JOIN Datos_personales d ON u.id_dp = d.id_dp
      WHERE d.email = ${email}
    `;

    const actual = result.recordset[0]?.psw;
    if (!actual || actual !== contrasenaActual) {
      return NextResponse.json({ message: "❌ Contraseña actual incorrecta." }, { status: 400 });
    }

    // Actualiza
    await sql.query`
      UPDATE u
      SET psw = ${contrasenaNueva}
      FROM Usuario u
      JOIN Datos_personales d ON u.id_dp = d.id_dp
      WHERE d.email = ${email}
    `;

    return NextResponse.json({ message: "✅ Contraseña actualizada con éxito." }, { status: 200 });
  } catch (error) {
    console.error("Error cambiando contraseña:", error);
    return NextResponse.json({ message: "❗ Error al actualizar contraseña." }, { status: 500 });
  }
}