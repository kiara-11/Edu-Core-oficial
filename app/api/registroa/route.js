import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const {
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      email,
      password,
      fechaNacimiento,
      telefono,
      genero,
    } = await request.json();

    await connectToDb();

    // Verificar si el correo ya existe
    const existe = await sql.query`SELECT * FROM Datos_personales WHERE email = ${email}`;
    if (existe.recordset.length > 0) {
      return NextResponse.json(
        { message: '⚠️ Ya existe una cuenta registrada con este correo electrónico.' },
        { status: 400 }
      );
    }

    // Insertar en Datos_personales
    const insertDatos = await sql.query(`
      INSERT INTO Datos_personales (Nombre, ApePat, ApeMat, email, FeNac, telefono, id_gen)
      OUTPUT INSERTED.id_dp
      VALUES ('${nombres}', '${apellidoPaterno}', '${apellidoMaterno}', '${email}', CONVERT(date, '${fechaNacimiento}', 23), '${telefono}', ${genero})
    `);

    const id_dp = insertDatos.recordset[0].id_dp;

    const numero = Math.floor(1000 + Math.random() * 9000);
    const user_name = `${nombres.toLowerCase().replace(/\s+/g, '')}${numero}`;

    await sql.query(`
      INSERT INTO Usuario (user_name, psw, id_dp, fe_registro, id_estado)
      VALUES ('${user_name}', '${password}', ${id_dp}, GETDATE(), 1)
    `);

    return NextResponse.json(
      { message: '✅ ¡Registro exitoso! Bienvenido a SIREAP.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return NextResponse.json(
      { message: '❌ Ocurrió un error en el servidor. Intenta más tarde.' },
      { status: 500 }
    );
  }
}