import { connectToDb, sql } from '../../lib/db';
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
          folder: 'cursos', // Carpeta en Cloudinary
          transformation: [
            { width: 800, height: 600, crop: 'limit' }, // Redimensionar
            { quality: 'auto' } // Optimizar calidad
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

export async function POST(request) {
  try {
    // Obtener FormData en lugar de JSON
    const formData = await request.formData();
    
    // Extraer datos básicos
    const nombreCompleto = formData.get('nombreCompleto');
    const email = formData.get('email');
    const nombreCurso = formData.get('nombreCurso');
    const nivel = formData.get('nivel');
    const descripcion = formData.get('descripcion');
    const resumen = formData.get('resumen');
    const queAprendere = formData.get('queAprendere');
    const precio = formData.get('precio');
    const duracion = formData.get('duracion');
    const modalidad = formData.get('modalidad');
    const materia = formData.get('materia');
    const cantMinEstudiantes = formData.get('cantMinEstudiantes');
    
    // Extraer arrays
    const horarios = JSON.parse(formData.get('horarios') || '[]');
    const lecciones = JSON.parse(formData.get('lecciones') || '[]');
    const prerequisitos = JSON.parse(formData.get('prerequisitos') || '[]');
    
    // Extraer archivo de foto
    const fotoCurso = formData.get('fotoCurso');

    // Validar datos requeridos
    if (!nombreCompleto || !email || !nombreCurso || !nivel || !descripcion || 
        !precio || !duracion || !modalidad || !materia || 
        !horarios || horarios.length === 0) {
      return NextResponse.json(
        { error: 'Todos los campos requeridos deben ser completados' },
        { status: 400 }
      );
    }

    // Validar que el precio sea un número válido
    const precioNumerico = parseInt(precio);
    if (isNaN(precioNumerico) || precioNumerico <= 0) {
      return NextResponse.json(
        { error: 'El precio debe ser un número válido mayor a 0' },
        { status: 400 }
      );
    }

    // Validar que la duración sea un número válido
    const duracionNumerica = parseInt(duracion);
    if (isNaN(duracionNumerica) || duracionNumerica <= 0) {
      return NextResponse.json(
        { error: 'La duración debe ser un número válido mayor a 0' },
        { status: 400 }
      );
    }

    // Validar cantMinEstudiantes si se proporciona
    let cantMinEstudiantesNum = null;
    if (cantMinEstudiantes && cantMinEstudiantes.trim() !== '') {
      cantMinEstudiantesNum = parseInt(cantMinEstudiantes);
      if (isNaN(cantMinEstudiantesNum) || cantMinEstudiantesNum <= 0) {
        return NextResponse.json(
          { error: 'La cantidad mínima de estudiantes debe ser un número válido mayor a 0' },
          { status: 400 }
        );
      }
    }

    // Procesar foto del curso con Cloudinary
    let urlFotoCurso = null;
    if (fotoCurso && fotoCurso.size > 0) {
      try {
        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(fotoCurso.type)) {
          return NextResponse.json(
            { error: 'Tipo de archivo no válido. Solo se permiten: JPG, JPEG, PNG, WEBP' },
            { status: 400 }
          );
        }

        // Validar tamaño (máximo 5MB)
        if (fotoCurso.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'La imagen es demasiado grande. Máximo 5MB' },
            { status: 400 }
          );
        }

        // Subir imagen a Cloudinary
        urlFotoCurso = await uploadImageToCloudinary(fotoCurso);
        console.log('Imagen subida exitosamente a:', urlFotoCurso);
        
      } catch (imageError) {
        console.error('Error al procesar la foto:', imageError);
        return NextResponse.json(
          { error: 'Error al subir la imagen del curso' },
          { status: 500 }
        );
      }
    }

    let pool;
    try {
      pool = await connectToDb();
    } catch (dbError) {
      console.error('Error conectando a la base de datos:', dbError);
      return NextResponse.json(
        { error: 'Error de conexión a la base de datos' },
        { status: 500 }
      );
    }

    // Iniciar transacción
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();

      // 1. Buscar el usuario por email
      let userId = null;
      const usuarioPorEmail = await transaction.request()
        .input('email', sql.VarChar(100), email)
        .query(`
          SELECT u.Id_user 
          FROM Usuario u
          INNER JOIN Datos_personales dp ON u.id_dp = dp.id_dp
          WHERE dp.email = @email
        `);

      if (usuarioPorEmail.recordset.length > 0) {
        userId = usuarioPorEmail.recordset[0].Id_user;
      } else {
        // Buscar por nombre completo como alternativa
        const nombrePartes = nombreCompleto.trim().split(' ');
        if (nombrePartes.length >= 2) {
          const apellidoPaterno = nombrePartes[0];
          const resto = nombrePartes.slice(1);
          
          let apellidoMaterno = '';
          let nombres = '';
          
          if (resto.length >= 2) {
            apellidoMaterno = resto[0];
            nombres = resto.slice(1).join(' ');
          } else {
            nombres = resto.join(' ');
          }

          const consultaNombre = apellidoMaterno ? 
            `SELECT u.Id_user 
             FROM Usuario u
             INNER JOIN Datos_personales dp ON u.id_dp = dp.id_dp
             WHERE dp.ApePat = @apellidoPaterno 
               AND dp.ApeMat = @apellidoMaterno 
               AND dp.Nombre = @nombres` :
            `SELECT u.Id_user 
             FROM Usuario u
             INNER JOIN Datos_personales dp ON u.id_dp = dp.id_dp
             WHERE dp.ApePat = @apellidoPaterno 
               AND dp.Nombre = @nombres`;

          const request = transaction.request()
            .input('apellidoPaterno', sql.VarChar(20), apellidoPaterno)
            .input('nombres', sql.VarChar(20), nombres);
          
          if (apellidoMaterno) {
            request.input('apellidoMaterno', sql.VarChar(20), apellidoMaterno);
          }

          const usuarioPorNombre = await request.query(consultaNombre);

          if (usuarioPorNombre.recordset.length > 0) {
            userId = usuarioPorNombre.recordset[0].Id_user;
          }
        }
      }

      if (!userId) {
        await transaction.rollback();
        return NextResponse.json(
          { error: 'No se encontró un usuario registrado con estos datos. Verifique su información.' },
          { status: 400 }
        );
      }

      // 2. Insertar/obtener materia - Generar ID manualmente si no existe
      const materiaExistente = await transaction.request()
        .input('desc_mat', sql.VarChar(20), materia.substring(0, 20))
        .query('SELECT desc_mat FROM Materias WHERE desc_mat = @desc_mat');

      if (materiaExistente.recordset.length === 0) {
        const maxMateriaIdResult = await transaction.request()
          .query('SELECT ISNULL(MAX(Id_materia), 0) + 1 as nuevo_id FROM Materias');
        
        const materiaId = maxMateriaIdResult.recordset[0].nuevo_id;
        
        await transaction.request()
          .input('Id_materia', sql.Int, materiaId)
          .input('desc_mat', sql.VarChar(20), materia.substring(0, 20))
          .query('INSERT INTO Materias (Id_materia, desc_mat) VALUES (@Id_materia, @desc_mat)');
      }

      // 3. Insertar/obtener nivel - Generar ID manualmente si no existe
      const nivelExistente = await transaction.request()
        .input('nombre_nivel', sql.VarChar(20), nivel.substring(0, 20))
        .query('SELECT nombre_nivel FROM Nivel_curso WHERE nombre_nivel = @nombre_nivel');

      if (nivelExistente.recordset.length === 0) {
        const maxNivelIdResult = await transaction.request()
          .query('SELECT ISNULL(MAX(Id_nivel), 0) + 1 as nuevo_id FROM Nivel_curso');
        
        const nivelId = maxNivelIdResult.recordset[0].nuevo_id;
        
        await transaction.request()
          .input('Id_nivel', sql.Int, nivelId)
          .input('nombre_nivel', sql.VarChar(20), nivel.substring(0, 20))
          .input('desc_nivel', sql.VarChar(20), nivel.substring(0, 20))
          .query('INSERT INTO Nivel_curso (Id_nivel, nombre_nivel, desc_nivel) VALUES (@Id_nivel, @nombre_nivel, @desc_nivel)');
      }

      // 4. Insertar/obtener modalidad - Generar ID manualmente si no existe
      const modalidadExistente = await transaction.request()
        .input('descripcion', sql.VarChar(20), modalidad.substring(0, 20))
        .query('SELECT descripcion FROM Modalidad WHERE descripcion = @descripcion');

      if (modalidadExistente.recordset.length === 0) {
        const maxModalidadIdResult = await transaction.request()
          .query('SELECT ISNULL(MAX(Id_mod), 0) + 1 as nuevo_id FROM Modalidad');
        
        const modalidadId = maxModalidadIdResult.recordset[0].nuevo_id;
        
        await transaction.request()
          .input('Id_mod', sql.Int, modalidadId)
          .input('descripcion', sql.VarChar(20), modalidad.substring(0, 20))
          .query('INSERT INTO Modalidad (Id_mod, descripcion) VALUES (@Id_mod, @descripcion)');
      }

      // 5. Generar un ID único para el curso
      const maxIdResult = await transaction.request()
        .query('SELECT ISNULL(MAX(Id_curso), 0) + 1 as nuevo_id FROM Curso');
      
      const cursoId = maxIdResult.recordset[0].nuevo_id;

      // 6. Insertar el curso con ID generado manualmente
      const insertCursoRequest = transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .input('nom_curso', sql.VarChar(20), nombreCurso.substring(0, 20))
        .input('discripcion', sql.VarChar(20), descripcion.substring(0, 20))
        .input('precio', sql.Int, precioNumerico)
        .input('Id_user', sql.Int, userId)
        .input('desc_mat', sql.VarChar(20), materia.substring(0, 20))
        .input('nombre_nivel', sql.VarChar(20), nivel.substring(0, 20))
        .input('modalidad_desc', sql.VarChar(20), modalidad.substring(0, 20));

      // Agregar campo opcional si tiene valor
      if (cantMinEstudiantesNum !== null && cantMinEstudiantesNum > 0) {
        insertCursoRequest.input('cant_est_min', sql.Int, cantMinEstudiantesNum);
      }

      const cursoQuery = cantMinEstudiantesNum ? 
        `INSERT INTO Curso (Id_curso, nom_curso, discripcion, precio, cant_est_min, Id_user, Id_materia, Id_nivel, Id_mod) 
         SELECT @Id_curso, @nom_curso, @discripcion, @precio, @cant_est_min, @Id_user, 
                m.Id_materia, n.Id_nivel, mod.Id_mod
         FROM Materias m, Nivel_curso n, Modalidad mod
         WHERE m.desc_mat = @desc_mat 
           AND n.nombre_nivel = @nombre_nivel 
           AND mod.descripcion = @modalidad_desc` :
        `INSERT INTO Curso (Id_curso, nom_curso, discripcion, precio, Id_user, Id_materia, Id_nivel, Id_mod) 
         SELECT @Id_curso, @nom_curso, @discripcion, @precio, @Id_user, 
                m.Id_materia, n.Id_nivel, mod.Id_mod
         FROM Materias m, Nivel_curso n, Modalidad mod
         WHERE m.desc_mat = @desc_mat 
           AND n.nombre_nivel = @nombre_nivel 
           AND mod.descripcion = @modalidad_desc`;

      await insertCursoRequest.query(cursoQuery);

      // Actualizar campos opcionales después de la inserción inicial
      if (resumen && resumen.trim() !== '') {
        await transaction.request()
          .input('Id_curso', sql.Int, cursoId)
          .input('resumen', sql.VarChar(500), resumen.substring(0, 500))
          .query('UPDATE Curso SET resumen = @resumen WHERE Id_curso = @Id_curso');
      }

      if (queAprendere && queAprendere.trim() !== '') {
        await transaction.request()
          .input('Id_curso', sql.Int, cursoId)
          .input('que_aprendere', sql.Text, queAprendere)
          .query('UPDATE Curso SET que_aprendere = @que_aprendere WHERE Id_curso = @Id_curso');
      }

      // Guardar URL de Cloudinary en lugar de ruta local
      if (urlFotoCurso && urlFotoCurso.trim() !== '') {
        await transaction.request()
          .input('Id_curso', sql.Int, cursoId)
          .input('foto_curso', sql.VarChar(500), urlFotoCurso) // URL más larga que ruta local
          .query('UPDATE Curso SET foto_curso = @foto_curso WHERE Id_curso = @Id_curso');
      }

      console.log('Curso creado con ID:', cursoId);

      // 7. Generar IDs únicos para todos los horarios e insertarlos
      const horariosCreados = [];
      let primerHorarioId = null;
      
      for (let i = 0; i < horarios.length; i++) {
        const horario = horarios[i];
        
        if (!horario.dia || !horario.inicio || !horario.fin) {
          continue;
        }
        
        const maxHorIdResult = await transaction.request()
          .query('SELECT ISNULL(MAX(Id_hor), 0) + 1 as nuevo_id FROM Horario_curso');
        
        const horarioId = maxHorIdResult.recordset[0].nuevo_id;
        
        if (i === 0) {
          primerHorarioId = horarioId;
        }

        const fechaBase = new Date();
        
        const fechaInicio = new Date(fechaBase);
        const [horaInicio, minutoInicio] = horario.inicio.split(':');
        fechaInicio.setHours(parseInt(horaInicio), parseInt(minutoInicio), 0, 0);
        
        const fechaFin = new Date(fechaBase);
        const [horaFin, minutoFin] = horario.fin.split(':');
        fechaFin.setHours(parseInt(horaFin), parseInt(minutoFin), 0, 0);

        await transaction.request()
          .input('Id_hor', sql.Int, horarioId)
          .input('dia', sql.VarChar(20), horario.dia)
          .input('fe_inicio', sql.DateTime, fechaInicio)
          .input('fe_fin', sql.DateTime, fechaFin)
          .input('Id_curso', sql.Int, cursoId)
          .query('INSERT INTO Horario_curso (Id_hor, dia, fe_inicio, fe_fin, Id_curso) VALUES (@Id_hor, @dia, @fe_inicio, @fe_fin, @Id_curso)');
        
        horariosCreados.push(horario);
      }

      // 8. Actualizar el curso con el primer horario como referencia
      if (primerHorarioId) {
        await transaction.request()
          .input('Id_hor', sql.Int, primerHorarioId)
          .input('Id_curso', sql.Int, cursoId)
          .query('UPDATE Curso SET Id_hor = @Id_hor WHERE Id_curso = @Id_curso');
      }

      // 9. Insertar lecciones
      let leccionesCreadas = 0;
      if (lecciones && lecciones.length > 0) {
        for (let i = 0; i < lecciones.length; i++) {
          const leccion = lecciones[i];

          if (!leccion.titulo || !leccion.descripcion || !leccion.duracion) {
            continue;
          }

          await transaction.request()
            .input('Id_curso', sql.Int, cursoId)
            .input('titulo_leccion', sql.VarChar(100), leccion.titulo.substring(0, 100))
            .input('descripcion_leccion', sql.VarChar(300), leccion.descripcion.substring(0, 300))
            .input('duracion_minutos', sql.Int, parseInt(leccion.duracion))
            .input('orden_leccion', sql.Int, i + 1)
            .query(`
              INSERT INTO Lecciones_curso (Id_curso, titulo_leccion, descripcion_leccion, duracion_minutos, orden_leccion) 
              VALUES (@Id_curso, @titulo_leccion, @descripcion_leccion, @duracion_minutos, @orden_leccion)
            `);
          
          leccionesCreadas++;
        }
      }

      // 10. Insertar prerequisitos
      let prerequisitosCreados = 0;
      if (prerequisitos && prerequisitos.length > 0) {
        for (let i = 0; i < prerequisitos.length; i++) {
          const prerequisito = prerequisitos[i];

          if (!prerequisito || prerequisito.trim() === '') {
            continue;
          }

          try {
            await transaction.request()
              .input('Id_curso', sql.Int, cursoId)
              .input('descripcion_prerequisito', sql.VarChar(200), prerequisito.substring(0, 200))
              .input('orden_prerequisito', sql.Int, i + 1)
              .query(`
                INSERT INTO Prerequisitos_curso (Id_curso, descripcion_prerequisito, orden_prerequisito) 
                VALUES (@Id_curso, @descripcion_prerequisito, @orden_prerequisito)
              `);
            
            prerequisitosCreados++;
          } catch (prereqError) {
            if (prereqError.message && prereqError.message.includes('Cannot insert the value NULL')) {
              const maxPrereqIdResult = await transaction.request()
                .query('SELECT ISNULL(MAX(Id_prerequisito), 0) + 1 as nuevo_id FROM Prerequisitos_curso');
              
              const prerequisitoId = maxPrereqIdResult.recordset[0].nuevo_id;

              await transaction.request()
                .input('Id_prerequisito', sql.Int, prerequisitoId)
                .input('Id_curso', sql.Int, cursoId)
                .input('descripcion_prerequisito', sql.VarChar(200), prerequisito.substring(0, 200))
                .input('orden_prerequisito', sql.Int, i + 1)
                .query(`
                  INSERT INTO Prerequisitos_curso (Id_prerequisito, Id_curso, descripcion_prerequisito, orden_prerequisito) 
                  VALUES (@Id_prerequisito, @Id_curso, @descripcion_prerequisito, @orden_prerequisito)
                `);
              
              prerequisitosCreados++;
            } else {
              console.error('Error insertando prerequisito:', prereqError);
            }
          }
        }
      }

      // Confirmar transacción
      await transaction.commit();

      return NextResponse.json({ 
        success: true, 
        message: 'Curso publicado exitosamente',
        cursoId: cursoId,
        nombreCurso: nombreCurso,
        horariosCreados: horariosCreados.length,
        leccionesCreadas: leccionesCreadas,
        prerequisitosCreados: prerequisitosCreados,
        fotoUrl: urlFotoCurso,
        fotoGuardada: urlFotoCurso ? true : false
      }, { status: 200 });

    } 
    catch (transactionError) {
      console.error('Error en la transacción:', transactionError);
      try {
        await transaction.rollback();
      } 
      catch (rollbackError) {
        console.error('Error en rollback:', rollbackError);
      }
      
      let errorMessage = 'Error al procesar la solicitud. Inténtelo nuevamente.';
      if (transactionError.message) {
        if (transactionError.message.includes('Cannot insert the value NULL')) {
          errorMessage = 'Error: Faltan datos requeridos para crear el curso.';
        } else if (transactionError.message.includes('String or binary data would be truncated')) {
          errorMessage = 'Error: Algunos campos contienen demasiados caracteres.';
        } else if (transactionError.message.includes('duplicate key')) {
          errorMessage = 'Error: Ya existe un curso con estos datos.';
        } else if (transactionError.message.includes('Foreign key')) {
          errorMessage = 'Error: Problema con las referencias de datos.';
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error general al publicar curso:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}