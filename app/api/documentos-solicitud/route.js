import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const universidad = searchParams.get('universidad');
    const email = searchParams.get('email');

    if (!universidad || !email) {
      return NextResponse.json({ 
        message: 'Universidad y email son requeridos.' 
      }, { status: 400 });
    }

    await connectToDb();

    // Obtener el ID del usuario a partir de su email
    const userResult = await sql.query`
      SELECT u.id_user
      FROM Usuario u
      JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      WHERE dp.email = ${email}
    `;

    if (userResult.recordset.length === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const id_user = userResult.recordset[0].id_user;

    // Buscar documentos en Ins_Form vinculados al id_user y la universidad
    const result = await sql.query`
      SELECT 
        i.id_IF,
        i.archivo_certificado,
        i.archivo_docente,
        i.Detalle,
        i.direc_form
      FROM Ins_Form i
      WHERE i.direc_form = ${universidad} AND i.id_user = ${id_user}
    `;

    const documentos = result.recordset
      .map(doc => {
        if (doc.archivo_certificado) {
          return {
            id: doc.id_IF,
            nombre: doc.Detalle,
            tipo: 'certificado',
            base64: doc.archivo_certificado,
            direccion: doc.direc_form
          };
        } else if (doc.archivo_docente) {
          return {
            id: doc.id_IF,
            nombre: doc.Detalle,
            tipo: 'docente',
            base64: doc.archivo_docente,
            direccion: doc.direc_form
          };
        }
        return null;
      })
      .filter(Boolean); // Elimina los null

    return NextResponse.json(documentos, { status: 200 });

  } catch (error) {
    console.error('❌ Error al obtener documentos:', error);
    return NextResponse.json({ 
      message: 'Error interno del servidor.' 
    }, { status: 500 });
  }
}