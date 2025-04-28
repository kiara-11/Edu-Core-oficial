import { connectToDb, sql } from '../../lib/db'; // Usar la ruta relativa
import { NextResponse } from 'next/server';

// Manejador de la solicitud POST para el inicio de sesión
export async function POST(request) {
  try {
    // Parsear el cuerpo de la solicitud como JSON
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
    const result = await sql.query`SELECT * FROM Usuarios WHERE email = ${email}`;

    if (result.recordset.length > 0) {
      const user = result.recordset[0];

      // Compara las contraseñas (sin cifrado por ahora)
      if (password === user.contraseña) {
        // Generar un token simple (en un entorno real, usa JWT)
        const token = `${email}-${Date.now()}`;
        
        return NextResponse.json({
          message: 'Inicio de sesión exitoso',
          token, // En un entorno real, este debería ser un JWT
          user: { id_usuario: user.id_usuario, email: user.email },
        }, { status: 200 });
      } else {
        return NextResponse.json(
          { message: 'Credenciales incorrectas' },
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
