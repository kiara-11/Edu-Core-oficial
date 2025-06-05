import { connectToDb, sql } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  let connection;
  
  try {
    const resolvedParams = await params;
    const courseId = resolvedParams.id;
    
    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'ID del curso es requerido' },
        { status: 400 }
      );
    }

    if (isNaN(courseId)) {
      return NextResponse.json(
        { success: false, error: 'ID del curso debe ser un número válido' },
        { status: 400 }
      );
    }

    // Obtener conexión fresca
    connection = await connectToDb();

    if (!connection) {
      throw new Error('Failed to establish database connection');
    }

    // Verificar si el curso existe
    const existsQuery = `SELECT Id_curso FROM Curso WHERE Id_curso = @courseId`;
    const existsRequest = connection.request();
    existsRequest.input('courseId', sql.Int, parseInt(courseId));
    const existsResult = await existsRequest.query(existsQuery);
    
    if (!existsResult.recordset || existsResult.recordset.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Curso no encontrado' },
        { status: 404 }
      );
    }

    // Consulta principal del curso - usando una nueva request para evitar conflictos
    const courseQuery = `
      SELECT 
        c.Id_curso,
        c.nom_curso as title,
        c.foto_curso as image,
        c.precio as price,
        c.discripcion as description,
        c.que_aprendere as learningTopics,
        c.resumen,
        c.cant_est_min as minStudents,
        
        CONCAT(LTRIM(RTRIM(ISNULL(dp.Nombre, ''))), 
               CASE WHEN dp.ApePat IS NOT NULL AND dp.ApePat != '' 
                    THEN ' ' + LTRIM(RTRIM(dp.ApePat)) ELSE '' END,
               CASE WHEN dp.ApeMat IS NOT NULL AND dp.ApeMat != '' 
                    THEN ' ' + LTRIM(RTRIM(dp.ApeMat)) ELSE '' END) as tutorName,
        ISNULL(p.foto_per, '/avatar2.png') as tutorImage,
        ISNULL(p.biografia, 'Información del tutor no disponible') as tutorBio,
        dp.email as tutorEmail,
        
        hc.dia as scheduleDays,
        hc.fe_inicio as startTime,
        hc.fe_fin as endTime,
        
        ISNULL(m.descripcion, 'Virtual') as modality,
        ISNULL(nc.nombre_nivel, 'Principiante') as level,
        nc.desc_nivel as levelDescription,
        
        ISNULL(mat.desc_mat, 'Materia no especificada') as subject,
        
        ISNULL(e.desc_estado, 'Activo') as courseStatus
        
      FROM Curso c
      LEFT JOIN Usuario u ON c.Id_user = u.Id_user
      LEFT JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      LEFT JOIN Perfil p ON dp.id_dp = p.id_dp
      LEFT JOIN Horario_curso hc ON c.Id_curso = hc.Id_curso
      LEFT JOIN Modalidad m ON c.Id_mod = m.Id_mod
      LEFT JOIN Nivel_curso nc ON c.Id_nivel = nc.Id_nivel
      LEFT JOIN Materias mat ON c.Id_materia = mat.Id_materia
      LEFT JOIN Estados e ON u.Id_estado = e.Id_estado
      WHERE c.Id_curso = @courseId
    `;

    const courseRequest = connection.request();
    courseRequest.input('courseId', sql.Int, parseInt(courseId));
    const courseResult = await courseRequest.query(courseQuery);

    if (!courseResult.recordset || courseResult.recordset.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No se pudo obtener la información del curso' },
        { status: 404 }
      );
    }

    const courseData = courseResult.recordset[0];

    // Consulta de lecciones - nueva request
    const lessonsQuery = `
      SELECT 
        Id_leccion,
        titulo_leccion,
        descripcion_leccion,
        orden_leccion,
        duracion_minutos
      FROM Lecciones_curso
      WHERE Id_curso = @courseId
      ORDER BY ISNULL(orden_leccion, Id_leccion)
    `;

    const lessonsRequest = connection.request();
    lessonsRequest.input('courseId', sql.Int, parseInt(courseId));
    const lessonsResult = await lessonsRequest.query(lessonsQuery);
    const lessons = lessonsResult.recordset || [];

    // Consulta de reseñas - nueva request
    const reviewsQuery = `
      SELECT 
        vc.Id_val,
        vc.calificacion,
        vc.comentario,
        vc.fec_val,
        CONCAT(LTRIM(RTRIM(ISNULL(dp.Nombre, ''))), 
               CASE WHEN dp.ApePat IS NOT NULL AND dp.ApePat != '' 
                    THEN ' ' + LTRIM(RTRIM(dp.ApePat)) ELSE '' END) as userName,
        ISNULL(p.foto_per, '/avatar.png') as userImage
      FROM Valoracion_curso vc
      LEFT JOIN Usuario u ON vc.Id_user = u.Id_user
      LEFT JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      LEFT JOIN Perfil p ON dp.id_dp = p.id_dp
      WHERE vc.Id_curso = @courseId
        AND vc.calificacion IS NOT NULL
      ORDER BY vc.fec_val DESC
    `;

    const reviewsRequest = connection.request();
    reviewsRequest.input('courseId', sql.Int, parseInt(courseId));
    const reviewsResult = await reviewsRequest.query(reviewsQuery);
    const reviews = reviewsResult.recordset || [];

    // Consulta de rating promedio - nueva request
    const ratingQuery = `
      SELECT 
        AVG(CAST(calificacion as FLOAT)) as avgRating,
        COUNT(*) as reviewCount
      FROM Valoracion_curso
      WHERE Id_curso = @courseId 
        AND calificacion IS NOT NULL 
        AND calificacion BETWEEN 1 AND 5
    `;

    const ratingRequest = connection.request();
    ratingRequest.input('courseId', sql.Int, parseInt(courseId));
    const ratingResult = await ratingRequest.query(ratingQuery);
    const ratingData = ratingResult.recordset[0] || { avgRating: 0, reviewCount: 0 };

    // Consulta de categorías - nueva request
    const categoriesQuery = `
      SELECT 
        cat.nombre_categoria,
        cat.descripcion_categoria
      FROM Curso_categorias cc
      INNER JOIN Categorias_curso cat ON cc.Id_categoria = cat.Id_categoria
      WHERE cc.Id_curso = @courseId
    `;

    const categoriesRequest = connection.request();
    categoriesRequest.input('courseId', sql.Int, parseInt(courseId));
    const categoriesResult = await categoriesRequest.query(categoriesQuery);
    const categories = categoriesResult.recordset || [];

    // Consulta de prerequisitos - nueva request
    const prerequisitesQuery = `
      SELECT 
        descripcion_prerequisito,
        orden_prerequisito
      FROM Prerequisitos_curso
      WHERE Id_curso = @courseId
      ORDER BY ISNULL(orden_prerequisito, Id_prerequisito)
    `;

    const prerequisitesRequest = connection.request();
    prerequisitesRequest.input('courseId', sql.Int, parseInt(courseId));
    const prerequisitesResult = await prerequisitesRequest.query(prerequisitesQuery);
    const prerequisites = prerequisitesResult.recordset || [];

    const formattedCourse = {
      id: courseData.Id_curso?.toString() || courseId,
      title: courseData.title || 'Curso sin título',
      image: courseData.image || '/detalle.png',
      rating: ratingData.avgRating ? parseFloat(Number(ratingData.avgRating).toFixed(1)) : 0,
      reviewCount: parseInt(ratingData.reviewCount) || 0,
      price: parseFloat(courseData.price) || 0,
      schedule: formatSchedule(courseData.startTime, courseData.endTime),
      startDate: formatDate(courseData.startTime),
      lessons: lessons.length || 0,
      modality: courseData.modality || 'Virtual',
      level: courseData.level || 'Principiante',
      duration: courseData.scheduleDays || 'Por definir',
      description: courseData.description || courseData.resumen || 'Descripción no disponible',
      learningTopics: parseLearningTopics(courseData.learningTopics),
      lessonsList: lessons.map((lesson, index) => ({
        id: lesson.orden_leccion || index + 1,
        title: lesson.titulo_leccion || `Lección ${index + 1}`,
        description: lesson.descripcion_leccion || 'Descripción no disponible',
        duration: lesson.duracion_minutos || 0
      })),
      tutor: {
        name: courseData.tutorName?.trim() || 'Tutor no asignado',
        image: courseData.tutorImage || '/avatar2.png',
        description: courseData.tutorBio || 'Información del tutor no disponible',
        email: courseData.tutorEmail || ''
      },
      reviews: reviews.map(review => ({
        id: review.Id_val,
        userName: review.userName?.trim() || 'Usuario Anónimo',
        userImage: review.userImage || '/avatar.png',
        rating: parseInt(review.calificacion) || 0,
        comment: review.comentario || 'Sin comentario',
        date: formatDate(review.fec_val)
      })),
      subject: courseData.subject || 'Materia no especificada',
      levelDescription: courseData.levelDescription || '',
      minStudents: courseData.minStudents || 1,
      categories: categories.map(cat => ({
        name: cat.nombre_categoria,
        description: cat.descripcion_categoria
      })),
      prerequisites: prerequisites.map(prereq => prereq.descripcion_prerequisito),
      status: courseData.courseStatus || 'Activo'
    };

    return NextResponse.json({ 
      success: true,
      course: formattedCourse 
    });

  } catch (error) {
    console.error('Error en API detalle:', error);
    
    let errorMessage = 'Error interno del servidor';
    let statusCode = 500;
    
     
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          code: error.code,
          stack: error.stack
        } : undefined
      },
      { status: statusCode }
    );
  } finally {
    // Cerrar conexión de manera segura
    
  }
}

function formatSchedule(startTime, endTime) {
  if (!startTime || !endTime) return 'Horario por definir';
  
  try {
    if (typeof startTime === 'string' && startTime.includes(':') && startTime.length <= 8) {
      return `${startTime} - ${endTime}`;
    }
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Horario por definir';
    }
    
    const formatTime = (date) => {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    };
    
    return `${formatTime(start)} - ${formatTime(end)}`;
  } catch (error) {
    return 'Horario por definir';
  }
}

function formatDate(date) {
  if (!date) return 'Por definir';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Por definir';
    
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    
    return `${day} de ${month} ${year}`;
  } catch (error) {
    return 'Por definir';
  }
}

function parseLearningTopics(topicsString) {
  if (!topicsString) return [];
  
  try {
    if (topicsString.trim().startsWith('[') || topicsString.trim().startsWith('{')) {
      const parsed = JSON.parse(topicsString);
      return Array.isArray(parsed) ? parsed : [parsed];
    }
    
    const topics = topicsString
      .split(/[.\n,;|]/)
      .map(topic => topic.trim())
      .filter(topic => topic && topic.length > 0)
      .slice(0, 10);
    
    return topics;
  } catch (error) {
    return topicsString
      .split('\n')
      .map(topic => topic.trim())
      .filter(topic => topic && topic.length > 0)
      .slice(0, 10);
  }
}