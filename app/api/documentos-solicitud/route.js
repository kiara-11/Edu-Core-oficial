import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id_solicitud = searchParams.get('id'); // Usaremos el ID de la solicitud

    if (!id_solicitud) {
      return NextResponse.json({ message: 'El ID de la solicitud es requerido.' }, { status: 400 });
    }

    await connectToDb();

    const result = await sql.query`
      SELECT documento, doccertificacion 
      FROM Solicitud_tutor1 
      WHERE id_solicitud = ${id_solicitud}
    `;

    if (result.recordset.length === 0) {
      return NextResponse.json({ message: 'Solicitud no encontrada.' }, { status: 404 });
    }

    const solicitud = result.recordset[0];
    const documentosParaEnviar = [];

    // Comprobar y añadir el primer documento si existe
    if (solicitud.documento) {
      documentosParaEnviar.push({
        nombre: 'Documento_Certificados.pdf',
        base64: solicitud.documento, // La cadena Base64 ya está en el formato correcto
        tipo: 'certificado'
      });
    }

    // Comprobar y añadir el segundo documento si existe
    if (solicitud.doccertificacion) {
      documentosParaEnviar.push({
        nombre: 'Certificaciones_Adicionales.pdf',
        base64: solicitud.doccertificacion,
        tipo: 'certificado'
      });
    }

    return NextResponse.json(documentosParaEnviar, { status: 200 });

  } catch (error) {
    console.error('❌ Error al obtener documentos:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}