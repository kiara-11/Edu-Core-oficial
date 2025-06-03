import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      nombreCompleto,
      email,
      nombreCurso, 
      nivel, 
      descripcion, 
      precio, 
      duracion, 
      modalidad, 
      materia, 
      cantMinEstudiantes,
      horarios 
    } = body;

    // Validar datos requeridos
    if (!nombreCompleto || !email || !nombreCurso || !nivel || !descripcion || !precio || !duracion || !modalidad || !materia || !horarios || horarios.length === 0) {
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
      await transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .input('nom_curso', sql.VarChar(20), nombreCurso.substring(0, 20))
        .input('discripcion', sql.VarChar(20), descripcion.substring(0, 20))
        .input('precio', sql.Int, precioNumerico)
        .input('cant_est_min', sql.Int, cantMinEstudiantes ? parseInt(cantMinEstudiantes) : null)
        .input('Id_user', sql.Int, userId)
        .input('desc_mat', sql.VarChar(20), materia.substring(0, 20))
        .input('nombre_nivel', sql.VarChar(20), nivel.substring(0, 20))
        .input('modalidad_desc', sql.VarChar(20), modalidad.substring(0, 20))
        .query(`
          INSERT INTO Curso (Id_curso, nom_curso, discripcion, precio, cant_est_min, Id_user, Id_materia, Id_nivel, Id_mod) 
          SELECT @Id_curso, @nom_curso, @discripcion, @precio, @cant_est_min, @Id_user, 
                 m.Id_materia, n.Id_nivel, mod.Id_mod
          FROM Materias m, Nivel_curso n, Modalidad mod
          WHERE m.desc_mat = @desc_mat 
            AND n.nombre_nivel = @nombre_nivel 
            AND mod.descripcion = @modalidad_desc
        `);

      // 7. Generar IDs únicos para todos los horarios e insertarlos
      const horariosCreados = [];
      let primerHorarioId = null;
      
      for (let i = 0; i < horarios.length; i++) {
        const horario = horarios[i];
        
        // Generar ID único para el horario
        const maxHorIdResult = await transaction.request()
          .query('SELECT ISNULL(MAX(Id_hor), 0) + 1 as nuevo_id FROM Horario_curso');
        
        const horarioId = maxHorIdResult.recordset[0].nuevo_id;
        
        // Guardar el primer horario para la referencia en Curso
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

      // Confirmar transacción
      await transaction.commit();

      return NextResponse.json({ 
        success: true, 
        message: 'Curso publicado exitosamente',
        cursoId: cursoId,
        horariosCreados: horariosCreados.length
      }, { status: 200 });

    } catch (transactionError) {
      console.error('Error en la transacción:', transactionError);
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Error en rollback:', rollbackError);
      }
      
      // Proporcionar mensaje de error más específico
      let errorMessage = 'Error al procesar la solicitud. Inténtelo nuevamente.';
      if (transactionError.message) {
        if (transactionError.message.includes('Cannot insert the value NULL')) {
          errorMessage = 'Error: Faltan datos requeridos para crear el curso.';
        } else if (transactionError.message.includes('String or binary data would be truncated')) {
          errorMessage = 'Error: Algunos campos contienen demasiados caracteres.';
        } else if (transactionError.message.includes('duplicate key')) {
          errorMessage = 'Error: Ya existe un curso con estos datos.';
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