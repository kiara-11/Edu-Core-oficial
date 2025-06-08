import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // MODIFICACIÓN: Se ajusta la desestructuración para recibir los nuevos campos de PDF en Base64.
    const {
      email,
      departamento, // Este dato no se usa en el backend, pero lo recibimos.
      ciudad,       // Este dato no se usa en el backend, pero lo recibimos.
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
      documento_pdf,       // Nuevo campo para el primer archivo PDF
      certificacion_pdf    // Nuevo campo para el segundo archivo PDF
    } = await request.json();

    if (!email || !universidad || !titulo) {
      return NextResponse.json({ 
        message: 'Email, universidad y título son requeridos.' 
      }, { status: 400 });
    }

    await connectToDb();

    // Obtener ID del usuario y de datos personales (sin cambios)
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

    // Actualizar número de celular (sin cambios)
    if (celular) {
        await sql.query`
          UPDATE Datos_personales 
          SET telefono = ${celular}
          WHERE id_dp = ${id_dp}
        `;
    }

    // Función para parsear fechas (sin cambios)
    const parseDate = (fecha) => {
      if (!fecha) return null;
      try {
        return new Date(fecha);
      } catch {
        return null;
      }
    };

    // MODIFICACIÓN: Se actualiza la consulta INSERT para incluir las columnas 'documento' y 'doccertificacion'.
    await sql.query`
      INSERT INTO Solicitud_tutor1 (
        id_user, universidad, profesion, certificacion, entidad,
        anio, fe_in_prof, fe_fin_prof, fe_tit,
        modalidad, horarios, frecuencia, materias, estado,
        documento, doccertificacion 
      )
      VALUES (
        ${id_user}, ${universidad}, ${titulo}, ${certificacion || null}, ${entidad || null},
        ${año ? parseInt(año) : null}, ${parseDate(fe_in_prof)}, ${parseDate(fe_fin_prof)}, ${parseDate(fe_tit)},
        ${modalidad}, ${horarios}, ${frecuencia}, ${materias}, 'Pendiente',
        ${documento_pdf || null}, ${certificacion_pdf || null}
      )
    `;

    // MODIFICACIÓN: Se elimina toda la lógica anterior que insertaba en la tabla 'Ins_Form'.
    // El código que estaba aquí ha sido borrado porque los archivos ya se guardan en la consulta principal.

    return NextResponse.json({
      message: 'Solicitud creada exitosamente'
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error al crear solicitud:', error);
    return NextResponse.json({
      message: 'Error interno del servidor.'
    }, { status: 500 });
  }
}