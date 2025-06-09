import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 });
    }

    await connectToDb();

    // Primero obtenemos el Id_user basado en el email
    // Hacemos JOIN entre Usuario y Datos_personales ya que el email está en Datos_personales
    const userQuery = `
      SELECT u.Id_user 
      FROM Usuario u
      INNER JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      WHERE dp.email = @email 
    `;

    const userRequest = new sql.Request();
    userRequest.input('email', sql.VarChar, email);
    
    const userResult = await userRequest.query(userQuery);

    if (userResult.recordset.length === 0) {
      return NextResponse.json({ 
        error: 'Usuario no encontrado' 
      }, { status: 404 });
    }

    const userId = userResult.recordset[0].Id_user;

    // Ahora buscamos la solicitud de tutor aprobada
    const tutorQuery = `
      SELECT TOP 1 
        universidad, 
        profesion, 
        certificacion, 
        entidad, 
        anio, 
        fe_in_prof, 
        fe_fin_prof, 
        fe_tit, 
        modalidad, 
        horarios, 
        frecuencia, 
        materias, 
        estado 
      FROM Solicitud_tutor1 
      WHERE id_user = @userId 
        AND estado = 'Aprobado' 
      ORDER BY id_solicitud DESC
    `;

    const tutorRequest = new sql.Request();
    tutorRequest.input('userId', sql.Int, userId);
    
    const tutorResult = await tutorRequest.query(tutorQuery);

    if (tutorResult.recordset.length === 0) {
      return NextResponse.json({ 
        esTutor: false, 
        message: 'No se encontró solicitud de tutor aprobada' 
      }, { status: 200 });
    }

    const tutorData = tutorResult.recordset[0];

    // Formatear las fechas si existen
    const formatearFecha = (fecha) => {
      if (!fecha) return '';
      try {
        return new Date(fecha).toLocaleDateString('es-ES');
      } catch (error) {
        console.error('Error al formatear fecha:', error);
        return '';
      }
    };

    return NextResponse.json({
      esTutor: true,
      datosAcademicos: {
        universidad: tutorData.universidad || '',
        profesion: tutorData.profesion || '',
        certificacion: tutorData.certificacion || '',
        entidad: tutorData.entidad || '',
        anio: tutorData.anio || '',
        fechaInicioProfesion: formatearFecha(tutorData.fe_in_prof),
        fechaFinProfesion: formatearFecha(tutorData.fe_fin_prof),
        fechaTitulacion: formatearFecha(tutorData.fe_tit),
        modalidad: tutorData.modalidad || '',
        horarios: tutorData.horarios || '',
        frecuencia: tutorData.frecuencia || '',
        materias: tutorData.materias || '',
        estado: tutorData.estado
      }
    });

  } catch (error) {
    console.error('Error al obtener datos académicos del tutor:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor', 
      details: error.message 
    }, { status: 500 });
  }
}