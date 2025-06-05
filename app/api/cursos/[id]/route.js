import { connectToDb, sql } from '../../../lib/db';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para subir imagen a Cloudinary
async function uploadImageToCloudinary(file) {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'cursos',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) {
            console.error('Error subiendo a Cloudinary:', error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    console.error('Error procesando imagen:', error);
    throw new Error('Error procesando la imagen');
  }
}

// PUT - Actualizar un curso existente
export async function PUT(request, { params }) {
  try {
    const cursoId = parseInt(params.id);
    
    if (isNaN(cursoId)) {
      return NextResponse.json(
        { error: 'ID de curso inválido' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obtener FormData
    const formData = await request.formData();
    
    // Extraer datos básicos
    const nombreCompleto = formData.get('nombreCompleto');
    const email = formData.get('email');
    const nombreCurso = formData.get('nombreCurso');
    const nivel = formData.get('nivel');
    const descripcion = formData.get('descripcion');
    const precio = formData.get('precio');
    const duracion = formData.get('duracion');
    const modalidad = formData.get('modalidad');
    const materia = formData.get('materia');
    const cantMinEstudiantes = formData.get('cantMinEstudiantes');
    
    // Extraer arrays
    const horarios = JSON.parse(formData.get('horarios') || '[]');
    
    // Validar datos requeridos
    if (!nombreCompleto || !email || !nombreCurso || !nivel || !descripcion || 
        !precio || !modalidad || !materia || !horarios || horarios.length === 0) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben ser completados' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validar precio
    if (isNaN(parseFloat(precio))) {
      return NextResponse.json(
        { error: 'El precio debe ser un número válido' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let pool;
    try {
      pool = await connectToDb();
    } catch (dbError) {
      console.error('Error conectando a la base de datos:', dbError);
      return NextResponse.json(
        { error: 'Error de conexión a la base de datos' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Verificar que el curso existe
    const cursoExiste = await pool.request()
      .input('cursoId', sql.Int, cursoId)
      .query('SELECT Id_curso FROM Curso WHERE Id_curso = @cursoId');

    if (cursoExiste.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Curso no encontrado' },
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Procesar foto del curso con Cloudinary si se proporciona
    let urlFotoCurso = null;
    const fotoCurso = formData.get('fotoCurso');
    if (fotoCurso && fotoCurso.size > 0) {
      try {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(fotoCurso.type)) {
          return NextResponse.json(
            { error: 'Tipo de archivo no válido. Solo se permiten: JPG, JPEG, PNG, WEBP' },
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        if (fotoCurso.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'La imagen es demasiado grande. Máximo 5MB' },
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        urlFotoCurso = await uploadImageToCloudinary(fotoCurso);
      } catch (imageError) {
        console.error('Error al procesar la foto:', imageError);
        return NextResponse.json(
          { error: 'Error al subir la imagen del curso' },
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Iniciar transacción
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();

      // 1. Manejo de materia
      const materiaExistente = await transaction.request()
        .input('desc_mat', sql.VarChar(20), materia.substring(0, 20))
        .query('SELECT Id_materia FROM Materias WHERE desc_mat = @desc_mat');

      let materiaId;
      if (materiaExistente.recordset.length === 0) {
        const maxMateriaIdResult = await transaction.request()
          .query('SELECT ISNULL(MAX(Id_materia), 0) + 1 as nuevo_id FROM Materias');
        
        materiaId = maxMateriaIdResult.recordset[0].nuevo_id;
        
        await transaction.request()
          .input('Id_materia', sql.Int, materiaId)
          .input('desc_mat', sql.VarChar(20), materia.substring(0, 20))
          .query('INSERT INTO Materias (Id_materia, desc_mat) VALUES (@Id_materia, @desc_mat)');
      } else {
        materiaId = materiaExistente.recordset[0].Id_materia;
      }

      // 2. Actualizar el curso
      const updateQuery = `
        UPDATE Curso 
        SET nom_curso = @nom_curso, 
            discripcion = @discripcion, 
            precio = @precio, 
            Id_materia = @Id_materia, 
            Id_nivel = @Id_nivel, 
            Id_mod = @Id_mod
            ${urlFotoCurso ? ', foto_curso = @foto_curso' : ''}
            ${cantMinEstudiantes ? ', cant_est_min = @cant_est_min' : ''}
        WHERE Id_curso = @Id_curso
      `;

      const updateRequest = transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .input('nom_curso', sql.VarChar(20), nombreCurso.substring(0, 20))
        .input('discripcion', sql.VarChar(20), descripcion.substring(0, 20))
        .input('precio', sql.Int, precio)
        .input('Id_materia', sql.Int, materiaId)
        .input('Id_nivel', sql.Int, nivel)
        .input('Id_mod', sql.Int, modalidad);

      if (urlFotoCurso) {
        updateRequest.input('foto_curso', sql.VarChar(500), urlFotoCurso);
      }

      if (cantMinEstudiantes) {
        updateRequest.input('cant_est_min', sql.Int, cantMinEstudiantes);
      }

      await updateRequest.query(updateQuery);

      // 3. Actualizar horarios (eliminar existentes y crear nuevos)
      await transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .query('DELETE FROM Horario_curso WHERE Id_curso = @Id_curso');

      for (const horario of horarios) {
        if (horario.dia && horario.inicio && horario.fin) {
          const fechaBase = new Date();
          const [horaInicio, minutoInicio] = horario.inicio.split(':');
          const [horaFin, minutoFin] = horario.fin.split(':');
          
          const fechaInicio = new Date(fechaBase);
          fechaInicio.setHours(parseInt(horaInicio), parseInt(minutoInicio), 0, 0);
          
          const fechaFin = new Date(fechaBase);
          fechaFin.setHours(parseInt(horaFin), parseInt(minutoFin), 0, 0);

          await transaction.request()
            .input('dia', sql.VarChar(20), horario.dia)
            .input('fe_inicio', sql.DateTime, fechaInicio)
            .input('fe_fin', sql.DateTime, fechaFin)
            .input('Id_curso', sql.Int, cursoId)
            .query(`
              INSERT INTO Horario_curso (dia, fe_inicio, fe_fin, Id_curso) 
              VALUES (@dia, @fe_inicio, @fe_fin, @Id_curso)
            `);
        }
      }

      // Confirmar transacción
      await transaction.commit();

      return NextResponse.json({ 
        success: true, 
        message: 'Curso actualizado exitosamente',
        cursoId: cursoId
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Error al actualizar curso:', error);
      return NextResponse.json(
        { error: error.message || 'Error al procesar la solicitud' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error general:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// DELETE - Eliminar un curso
export async function DELETE(request, { params }) {
  try {
    const cursoId = parseInt(params.id);
    
    if (isNaN(cursoId)) {
      return NextResponse.json(
        { error: 'ID de curso inválido' },
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let pool;
    try {
      pool = await connectToDb();
    } catch (dbError) {
      console.error('Error conectando a la base de datos:', dbError);
      return NextResponse.json(
        { error: 'Error de conexión a la base de datos' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Iniciar transacción
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();

      // 1. Eliminar horarios del curso
      await transaction.request()
        .input('cursoId', sql.Int, cursoId)
        .query('DELETE FROM Horario_curso WHERE Id_curso = @cursoId');

      // 2. Eliminar el curso
      await transaction.request()
        .input('cursoId', sql.Int, cursoId)
        .query('DELETE FROM Curso WHERE Id_curso = @cursoId');

      // Confirmar transacción
      await transaction.commit();

      return NextResponse.json({ 
        success: true, 
        message: 'Curso eliminado exitosamente'
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

    } catch (error) {
      await transaction.rollback();
      console.error('Error al eliminar curso:', error);
      return NextResponse.json(
        { error: error.message || 'Error al eliminar el curso' },
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error general:', error);
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}