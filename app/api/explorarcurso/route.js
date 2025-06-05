import { connectToDb } from '../../lib/db';
import { NextResponse } from 'next/server';

// Array de imágenes por defecto (solo se usarán si el curso no tiene foto_curso)
const defaultCourseImages = [
  'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop'
];

// Función para obtener imagen por defecto aleatoria
function getRandomDefaultImage() {
  return defaultCourseImages[Math.floor(Math.random() * defaultCourseImages.length)];
}

// Función para calcular calificación promedio
function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.calificacion, 0);
  return Math.round(sum / reviews.length);
}

export async function GET() {
  try {
    const pool = await connectToDb();
    
    const query = `
      SELECT 
        c.Id_curso,
        c.nom_curso,
        c.discripcion,
        c.precio,
        c.cant_est_min,
        c.foto_curso,
        
        -- Datos del instructor (tutor)
        dp.Nombre + ' ' + ISNULL(dp.ApePat, '') + ' ' + ISNULL(dp.ApeMat, '') as instructor_name,
        
        -- Materia
        m.desc_mat as categoria,
        
        -- Nivel
        n.desc_nivel as nivel,
        
        -- Modalidad
        mod.descripcion as modalidad,
        
        -- Horario
        h.fe_inicio,
        h.fe_fin,
        h.dia,
        
        -- Estado del curso
        e.desc_estado as estado_curso
        
      FROM Curso c
      LEFT JOIN Usuario u ON c.Id_user = u.Id_user
      LEFT JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      LEFT JOIN Materias m ON c.Id_materia = m.Id_materia
      LEFT JOIN Nivel_curso n ON c.Id_nivel = n.Id_nivel
      LEFT JOIN Modalidad mod ON c.Id_mod = mod.Id_mod
      LEFT JOIN Horario_curso h ON c.Id_hor = h.Id_hor
      LEFT JOIN Estados e ON c.Id_user = e.Id_estado
      WHERE c.nom_curso IS NOT NULL
      ORDER BY c.Id_curso DESC
    `;
    
    const result = await pool.request().query(query);
    
    // Obtener valoraciones para cada curso
    const coursesWithReviews = await Promise.all(
      result.recordset.map(async (course) => {
        const reviewQuery = `
          SELECT calificacion, comentario 
          FROM Valoracion_curso 
          WHERE Id_curso = @courseId
        `;
        
        const reviewResult = await pool.request()
          .input('courseId', course.Id_curso)
          .query(reviewQuery);
        
        const reviews = reviewResult.recordset;
        const averageRating = calculateAverageRating(reviews);
        
        // Calcular duración basada en fecha inicio y fin
        let duration = "2 semanas"; // valor por defecto
        if (course.fe_inicio && course.fe_fin) {
          const startDate = new Date(course.fe_inicio);
          const endDate = new Date(course.fe_fin);
          const diffTime = Math.abs(endDate - startDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 7) {
            duration = `${diffDays} días`;
          } else if (diffDays <= 30) {
            const weeks = Math.ceil(diffDays / 7);
            duration = `${weeks} semana${weeks > 1 ? 's' : ''}`;
          } else {
            const months = Math.ceil(diffDays / 30);
            duration = `${months} mes${months > 1 ? 'es' : ''}`;
          }
        }
        
        // Determinar qué imagen usar
        let imageUrl;
        
        // Debug: mostrar el valor de foto_curso en la consola
        console.log(`Curso ID ${course.Id_curso}: foto_curso = "${course.foto_curso}"`);
        
        if (course.foto_curso && course.foto_curso.trim() !== '') {
          // Si el curso tiene foto_curso, usarla
          imageUrl = course.foto_curso;
          console.log(`Usando imagen de BD: ${imageUrl}`);
        } else {
          // Si no tiene foto_curso, usar imagen por defecto aleatoria
          imageUrl = getRandomDefaultImage();
          console.log(`Usando imagen por defecto: ${imageUrl}`);
        }
        
        return {
          id: course.Id_curso,
          title: course.nom_curso || "Curso sin título",
          instructor: course.instructor_name || "Instructor no disponible",
          description: course.discripcion || "Descripción no disponible",
          duration: duration,
          rating: averageRating,
          reviews: reviews.length,
          price: course.precio || 0,
          imageUrl: imageUrl,
          category: course.categoria || "General",
          level: course.nivel || "Principiante",
          modality: course.modalidad || "Virtual"
        };
      })
    );
    
    return NextResponse.json({
      success: true,
      courses: coursesWithReviews
    });
    
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener los cursos',
        details: error.message
      },
      { status: 500 }
    );
  }
}