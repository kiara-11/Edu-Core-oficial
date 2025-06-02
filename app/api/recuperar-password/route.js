import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';
export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: '❗ Ingresa un correo válido.' }, { status: 400 });
    }

    await connectToDb();

    // Verificar si el correo existe
    const datos = await sql.query`
      SELECT id_dp FROM Datos_personales WHERE email = ${email}
    `;

    if (datos.recordset.length === 0) {
      return NextResponse.json({ message: '❌ No se encontró una cuenta con ese correo.' }, { status: 404 });
    }

    const id_dp = datos.recordset[0].id_dp;

    // Generar una nueva contraseña temporal (puedes usar una más segura si gustas)
    const nuevaPass = 'temporal123';

    // Actualizar contraseña en la tabla Usuario
    await sql.query`
      UPDATE Usuario SET psw = ${nuevaPass} WHERE id_dp = ${id_dp}
    `;

    return NextResponse.json({ message: `✅ Se generó una nueva contraseña temporal: ${nuevaPass}` }, { status: 200 });

  } catch (error) {
    console.error('Error en recuperación de contraseña:', error);
    return NextResponse.json({ message: 'Error del servidor. Intenta nuevamente.' }, { status: 500 });
  }
}