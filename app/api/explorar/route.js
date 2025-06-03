import { connectToDb } from '../../lib/db';
import { NextResponse } from 'next/server';
import sql from 'mssql';

export async function GET() {
  try {
    console.log('Intentando conectar a la base de datos...');
    const pool = await connectToDb();
    console.log('Conexión exitosa');
   
    // Consulta corregida basada en la estructura real de la base de datos
    console.log('Ejecutando consulta...');
    const result = await pool.request().query(`
      SELECT TOP 20
        c.Id_curso as id,
        c.nom_curso as titulo,
        c.discripcion as descripcion,
        c.precio,
        m.desc_mat as categoria,
        n.desc_nivel as nivel,
        mo.descripcion as modalidad,
        dp.Nombre as instructor_nombre,
        dp.ApePat as instructor_apellido,
        dp.ApeMat as instructor_apellido_materno,
        p.foto_per as instructor_foto
      FROM Curso c
      LEFT JOIN Materias m ON c.Id_materia = m.Id_materia
      LEFT JOIN Nivel_curso n ON c.Id_nivel = n.Id_nivel
      LEFT JOIN Modalidad mo ON c.Id_mod = mo.Id_mod
      LEFT JOIN Usuario u ON c.Id_user = u.Id_user
      LEFT JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      LEFT JOIN Perfil p ON dp.id_dp = p.id_dp
      ORDER BY c.Id_curso DESC
    `);
   
    console.log('Cursos obtenidos:', result.recordset);
   
    const cursosFormateados = result.recordset.map(curso => {
      // Generar rating aleatorio entre 3.5 y 5.0
      const rating = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
      const reviewCount = Math.floor(Math.random() * 50) + 5;
      const totalInscritos = Math.floor(Math.random() * 200) + 10;
      
      // Imágenes aleatorias para cursos por categoría
      const imagenesAleatorias = {
        'Ciencias Exactas': [
          'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=300&fit=crop'
        ],
        'Humanidades': [
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop'
        ],
        'Idiomas': [
          'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
        ],
        'Artes': [
          'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
        ],
        'Tecnología': [
          'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop'
        ],
        'Negocios': [
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1553028826-f4804151e596?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'
        ]
      };
      
      // Seleccionar imagen aleatoria basada en la categoría
      const categoria = curso.categoria || 'General';
      const imagenesCategoria = imagenesAleatorias[categoria] || [
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'
      ];
      const imagenAleatoria = imagenesCategoria[Math.floor(Math.random() * imagenesCategoria.length)];
      
      // Imágenes aleatorias para instructores
      const fotosInstructores = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face'
      ];
      const fotoInstructorAleatoria = fotosInstructores[Math.floor(Math.random() * fotosInstructores.length)];
      
      return {
        id: curso.id,
        titulo: curso.titulo || 'Sin título',
        instructor: curso.instructor_nombre && curso.instructor_apellido
          ? `${curso.instructor_nombre} ${curso.instructor_apellido}${curso.instructor_apellido_materno ? ' ' + curso.instructor_apellido_materno : ''}`
          : 'Instructor no especificado',
        descripcion: curso.descripcion || 'Sin descripción',
        categoria: curso.categoria || 'General',
        nivel: curso.nivel || 'Básico',
        modalidad: curso.modalidad || 'Virtual',
        precio: parseFloat(curso.precio) || 0,
        duracion: 'No especificado', // No hay campo de duración en la BD actual
        imagen: imagenAleatoria, // Imagen aleatoria del curso
        instructorFoto: curso.instructor_foto || fotoInstructorAleatoria,
        rating: rating,
        reviewCount: reviewCount,
        totalInscritos: totalInscritos
      };
    });
    
    console.log('Cursos formateados:', cursosFormateados);
    return NextResponse.json({ cursos: cursosFormateados });
   
  } catch (error) {
    console.error('Error completo:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      {
        error: 'Error al obtener los cursos',
        details: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}