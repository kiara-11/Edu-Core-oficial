import { connectToDb, sql } from '../../lib/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await connectToDb();

    // Realizar consulta para buscar al usuario con el email proporcionado
    const result = await sql.query`SELECT * FROM dbo.Usuarios WHERE email = ${email}`;

    if (result.recordset.length > 0) {
      const user = result.recordset[0];

      // Verificar la contraseña utilizando bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.contraseña);

      if (isPasswordValid) {
        const token = `${email}-${Date.now()}`;
        
        return NextResponse.json({
          message: 'Inicio de sesión exitoso',
          token,
          user: { id_usuario: user.id_usuario, email: user.email },
        }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: 'Contraseña incorrecta' },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al procesar la solicitud', error: error.message },
      { status: 500 }
    );
  }
}
