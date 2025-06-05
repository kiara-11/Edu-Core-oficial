import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const {
      email,
      departamento,
      ciudad,
      celular,
      universidad,
      titulo,
      certificacion,
      entidad,
      año,
      fe_in_prof,
      fe_fin_prof,
      fe_tit,
      materias,
      modalidad,
      horarios,
      frecuencia,
      documentos,
      certificaciones
    } = await request.json();

    if (!email || !universidad || !titulo) {
      return NextResponse.json({ 
        message: 'Email, universidad y título son requeridos.' 
      }, { status: 400 });
    }

    await connectToDb();

    // Obtener ID del usuario y de datos personales
    const userResult = await sql.query`
      SELECT u.id_user, dp.id_dp
      FROM Usuario u
      JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      WHERE dp.email = ${email}
    `;

    if (userResult.recordset.length === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    const { id_user, id_dp } = userResult.recordset[0];

    // Actualizar número de celular
    await sql.query`
      UPDATE Datos_personales 
      SET telefono = ${celular}
      WHERE id_dp = ${id_dp}
    `;

    const parseDate = (fecha) => {
      if (!fecha) return null;
      try {
        return new Date(fecha);
      } catch {
        return null;
      }
    };

    // Insertar solicitud del tutor
    const solicitudResult = await sql.query`
      INSERT INTO Solicitud_tutor1 (
        id_user, universidad, profesion, certificacion, entidad,
        anio, fe_in_prof, fe_fin_prof, fe_tit,
        modalidad, horarios, frecuencia, materias, estado
      )
      OUTPUT INSERTED.id_solicitud
      VALUES (
        ${id_user}, ${universidad}, ${titulo}, ${certificacion || null}, ${entidad || null},
        ${año ? parseInt(año) : null}, ${parseDate(fe_in_prof)}, ${parseDate(fe_fin_prof)}, ${parseDate(fe_tit)},
        ${modalidad}, ${horarios}, ${frecuencia}, ${materias}, 'Pendiente'
      )
    `;

    const id_solicitud = solicitudResult.recordset[0].id_solicitud;

    // Insertar DOCUMENTOS (como certificado)
    if (documentos && documentos.length > 0) {
      for (const doc of documentos) {
        if (!doc.base64 || !doc.nombre) {
          console.warn('⚠️ Documento inválido:', doc);
          continue;
        }
        await sql.query`
          INSERT INTO Ins_Form (
            archivo_certificado,
            Detalle,
            direc_form,
            id_user
          )
          VALUES (
            ${doc.base64},
            ${doc.nombre},
            ${universidad},
            ${id_user}
          )
        `;
      }
    }

    // Insertar CERTIFICACIONES (como docente)
    if (certificaciones && certificaciones.length > 0) {
      for (const cert of certificaciones) {
        if (!cert.base64 || !cert.nombre) {
          console.warn('⚠️ Certificación inválida:', cert);
          continue;
        }
        await sql.query`
          INSERT INTO Ins_Form (
            archivo_docente,
            Detalle,
            direc_form,
            id_user
          )
          VALUES (
            ${cert.base64},
            ${cert.nombre},
            ${universidad},
            ${id_user}
          )
        `;
      }
    }

    return NextResponse.json({
      message: 'Solicitud creada exitosamente',
      id_solicitud
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error al crear solicitud:', error);
    return NextResponse.json({
      message: 'Error interno del servidor.'
    }, { status: 500 });
  }
}