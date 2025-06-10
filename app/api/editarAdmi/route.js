import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

let globalPool = null;

async function getOrCreateConnection() {
  if (!globalPool) {
    globalPool = await connectToDb();
  }
  return globalPool;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cursoId = searchParams.get('id');

  if (!cursoId || isNaN(parseInt(cursoId))) {
    return NextResponse.json({ error: 'ID de curso inválido' }, { status: 400 });
  }

  try {
    const pool = await getOrCreateConnection();
    const parsedCursoId = parseInt(cursoId);

    const query = `
      SELECT 
        c.*,
        h.dia,
        h.fe_inicio,
        h.fe_fin,
        m.desc_mat,
        dp.Nombre as tutor_nombre,
        dp.ApePat + ' ' + dp.ApeMat as tutor_apellidos,
        dp.email as tutor_email,
        c.Id_user as Id_tutor
      FROM Curso c
      LEFT JOIN Horario_curso h ON c.Id_hor = h.Id_hor
      LEFT JOIN Materias m ON c.Id_materia = m.Id_materia
      LEFT JOIN Usuario u ON c.Id_user = u.Id_user
      LEFT JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      WHERE c.Id_curso = @cursoId
    `;
    
    const result = await pool.request()
      .input('cursoId', sql.Int, parsedCursoId)
      .query(query);

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const curso = result.recordset[0];
    
    let horarioString = '';
    if (curso.dia && curso.fe_inicio && curso.fe_fin) {
      // Función para formatear horas - usa toLocaleTimeString para evitar problemas de zona horaria
      const formatTime = (timeValue) => {
        if (!timeValue) return '';
        
        // Si es string, devolverlo tal como está
        if (typeof timeValue === 'string') {
          return timeValue.substring(0, 5);
        }
        
        // Si es Date, usar toLocaleTimeString con opciones específicas
        if (timeValue instanceof Date) {
          return timeValue.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
          });
        }
        
        return '';
      };
      
      const horaInicio = formatTime(curso.fe_inicio);
      const horaFin = formatTime(curso.fe_fin);
      
      if (horaInicio && horaFin) {
        horarioString = `${curso.dia}, ${horaInicio} - ${horaFin}`;
      }
    }

    const response = {
      ...curso,
      horario: horarioString,
      nom_materia: curso.desc_mat || null
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error en GET /api/editarAdmi:', {
      message: error.message,
      stack: error.stack,
      details: error
    });
    return NextResponse.json(
      { 
        error: 'Error del servidor', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const cursoId = searchParams.get('id');

  if (!cursoId || isNaN(parseInt(cursoId))) {
    return NextResponse.json({ error: 'ID de curso inválido' }, { status: 400 });
  }

  let transaction;
  
  try {
    const body = await request.json();
    console.log('Datos recibidos para actualización:', body);
    
    const pool = await getOrCreateConnection();
    transaction = new sql.Transaction(pool);
    
    await transaction.begin();

    // Verificar si el curso existe
    const cursoExists = await transaction.request()
      .input('cursoId', sql.Int, parseInt(cursoId))
      .query('SELECT Id_hor, Id_user, Id_materia FROM Curso WHERE Id_curso = @cursoId');
    
    if (cursoExists.recordset.length === 0) {
      await transaction.rollback();
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const cursoData = cursoExists.recordset[0];
    let horarioId = cursoData.Id_hor;

    // Preparar campos para actualización
    const updateFields = [];
    const updateRequest = transaction.request().input('cursoId', sql.Int, parseInt(cursoId));

    // Mapeo de campos con sus tipos SQL
    const fieldMap = {
      nombreCurso: { column: 'nom_curso', type: sql.VarChar(100) },
      descripcion: { column: 'discripcion', type: sql.VarChar(sql.MAX) },
      precio: { column: 'precio', type: sql.Decimal(10, 2) },
      modalidad: { column: 'Id_mod', type: sql.Int },
      nivel: { column: 'Id_nivel', type: sql.Int },
      cantMinEstudiantes: { column: 'cant_est_min', type: sql.Int },
      resumen: { column: 'resumen', type: sql.VarChar(500) },
      queAprendere: { column: 'que_aprendere', type: sql.VarChar(sql.MAX) },
      tutorId: { column: 'Id_user', type: sql.Int }
    };

    // Procesar cada campo
    for (const [key, { column, type }] of Object.entries(fieldMap)) {
      if (body[key] !== undefined && body[key] !== null && body[key] !== '') {
        updateFields.push(`${column} = @${key}`);
        let value = body[key];
        
        // Conversión de tipos
        if (type === sql.Decimal) {
          value = parseFloat(value);
          if (isNaN(value)) {
            throw new Error(`Valor inválido para ${key}: ${body[key]}`);
          }
        } else if (type === sql.Int) {
          value = parseInt(value);
          if (isNaN(value)) {
            throw new Error(`Valor inválido para ${key}: ${body[key]}`);
          }
        }
        
        updateRequest.input(key, type, value);
      }
    }

    // Manejo de materia
    if (body.materiaNombre && body.materiaNombre.trim() !== '') {
      const materiaNombre = body.materiaNombre.trim();
      
      // Buscar si la materia ya existe
      const materiaResult = await transaction.request()
        .input('materiaNombre', sql.VarChar(100), materiaNombre)
        .query('SELECT Id_materia FROM Materias WHERE desc_mat = @materiaNombre');
      
      let materiaId;
      
      if (materiaResult.recordset.length === 0) {
        // Crear nueva materia si no existe
        const newMateria = await transaction.request()
          .input('materiaNombre', sql.VarChar(100), materiaNombre)
          .query(`
            INSERT INTO Materias (desc_mat) 
            OUTPUT INSERTED.Id_materia 
            VALUES (@materiaNombre)
          `);
        materiaId = newMateria.recordset[0].Id_materia;
      } else {
        materiaId = materiaResult.recordset[0].Id_materia;
      }
      
      updateFields.push('Id_materia = @materiaId');
      updateRequest.input('materiaId', sql.Int, materiaId);
    }

    // Manejo de horario - VERSIÓN MEJORADA
    if (body.dia && body.horaInicio && body.horaFin) {
      try {
        console.log('Procesando horario:', { dia: body.dia, horaInicio: body.horaInicio, horaFin: body.horaFin });
        
        // Función simple para convertir tiempo - sin conversiones complicadas
        const validateAndConvertTime = (timeStr) => {
          const cleanTime = timeStr.trim();
          
          // Validar formato HH:MM
          const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
          if (!timeRegex.test(cleanTime)) {
            throw new Error(`Formato de hora inválido: ${timeStr}. Use HH:MM`);
          }
          
          // Simplemente enviar como string - SQL Server lo convertirá automáticamente
          return cleanTime;
        };

        const horaInicioString = validateAndConvertTime(body.horaInicio);
        const horaFinString = validateAndConvertTime(body.horaFin);

        console.log('Horas para guardar:', { 
          inicio: horaInicioString, 
          fin: horaFinString 
        });

        // Si ya existe un horario, actualizarlo en lugar de crear uno nuevo
        if (horarioId) {
          await transaction.request()
            .input('horarioId', sql.Int, horarioId)
            .input('dia', sql.VarChar(10), body.dia)
            .input('horaInicio', sql.VarChar(8), horaInicioString)
            .input('horaFin', sql.VarChar(8), horaFinString)
            .query(`
              UPDATE Horario_curso 
              SET dia = @dia, fe_inicio = @horaInicio, fe_fin = @horaFin
              WHERE Id_hor = @horarioId
            `);
          
          console.log('Horario actualizado con ID:', horarioId);
        } else {
          // Crear nuevo horario si no existe
          const maxIdResult = await transaction.request()
            .query('SELECT ISNULL(MAX(Id_hor), 0) + 1 as nextId FROM Horario_curso');
          
          const nextHorarioId = maxIdResult.recordset[0].nextId;
          
          await transaction.request()
            .input('horarioId', sql.Int, nextHorarioId)
            .input('dia', sql.VarChar(10), body.dia)
            .input('horaInicio', sql.VarChar(8), horaInicioString)
            .input('horaFin', sql.VarChar(8), horaFinString)
            .query(`
              INSERT INTO Horario_curso (Id_hor, dia, fe_inicio, fe_fin) 
              VALUES (@horarioId, @dia, @horaInicio, @horaFin)
            `);
          
          horarioId = nextHorarioId;
          console.log('Nuevo horario creado con ID:', horarioId);
          
          updateFields.push('Id_hor = @horarioId');
          updateRequest.input('horarioId', sql.Int, horarioId);
        }
        
      } catch (timeError) {
        console.error('Error específico en horario:', timeError);
        await transaction.rollback();
        return NextResponse.json(
          { 
            error: 'Error en el formato del horario',
            details: timeError.message,
            suggestion: 'Use formato HH:MM (24 horas) para las horas. Ejemplo: 15:30'
          },
          { status: 400 }
        );
      }
    }

    // Ejecutar actualización si hay campos para actualizar
    if (updateFields.length > 0) {
      const updateQuery = `
        UPDATE Curso 
        SET ${updateFields.join(', ')}
        WHERE Id_curso = @cursoId
      `;
      
      console.log('Query de actualización:', updateQuery);
      console.log('Campos actualizados:', updateFields);
      
      await updateRequest.query(updateQuery);
    }

    await transaction.commit();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Curso actualizado correctamente',
      updatedFields: updateFields
    });

  } catch (error) {
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Error en rollback:', rollbackError);
      }
    }
    
    console.error('Error detallado en PUT /api/editarAdmi:', {
      message: error.message,
      stack: error.stack,
      details: error
    });
    
    return NextResponse.json(
      { 
        error: 'Error al actualizar el curso', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}