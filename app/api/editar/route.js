import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

// Variable global para mantener la conexión persistente
let globalPool = null;

// Función para obtener o crear conexión persistente
async function getOrCreateConnection() {
  if (!globalPool) {
    console.log('Creando nueva conexión global...');
    globalPool = await connectToDb();
    console.log('Conexión global creada');
  } else {
    console.log('Reutilizando conexión global existente');
  }
  return globalPool;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cursoId = searchParams.get('id');

  console.log('GET /api/editar - ID recibido:', cursoId);

  if (!cursoId || isNaN(parseInt(cursoId))) {
    console.log('ID inválido:', cursoId);
    return NextResponse.json({ error: 'ID de curso inválido' }, { status: 400 });
  }

  try {
    console.log('Obteniendo conexión persistente...');
    const pool = await getOrCreateConnection();
    console.log('Conexión obtenida');

    const parsedCursoId = parseInt(cursoId);
    console.log('Buscando curso con ID:', parsedCursoId);

    // Consulta con JOIN para obtener el horario desde la tabla Horario_curso
    const queryWithHorario = `
      SELECT 
        c.*,
        h.dia,
        h.fe_inicio,
        h.fe_fin
      FROM Curso c
      LEFT JOIN Horario_curso h ON c.Id_hor = h.Id_hor
      WHERE c.Id_curso = @cursoId
    `;
    
    const result = await pool.request()
      .input('cursoId', sql.Int, parsedCursoId)
      .query(queryWithHorario);

    console.log('Resultados encontrados:', result.recordset.length);

    if (result.recordset.length === 0) {
      console.log('Curso no encontrado');
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const curso = result.recordset[0];
    console.log('Curso encontrado:', curso.nom_curso);

    // Obtener datos adicionales si es necesario
    let materiaName = '';
    let nivelName = '';
    let modalidadName = '';

    try {
      if (curso.Id_materia) {
        const materiaResult = await pool.request()
          .input('materiaId', sql.Int, curso.Id_materia)
          .query('SELECT desc_mat FROM Materias WHERE Id_materia = @materiaId');
        materiaName = materiaResult.recordset[0]?.desc_mat || '';
      }

      if (curso.Id_nivel) {
        const nivelResult = await pool.request()
          .input('nivelId', sql.Int, curso.Id_nivel)
          .query('SELECT desc_nivel FROM Nivel_curso WHERE Id_nivel = @nivelId');
        nivelName = nivelResult.recordset[0]?.desc_nivel || '';
      }

      if (curso.Id_mod) {
        const modalidadResult = await pool.request()
          .input('modalidadId', sql.Int, curso.Id_mod)
          .query('SELECT descripcion FROM Modalidad WHERE Id_mod = @modalidadId');
        modalidadName = modalidadResult.recordset[0]?.descripcion || '';
      }
    } catch (joinError) {
      console.warn('Error obteniendo datos relacionados:', joinError.message);
    }

    // Construir el string de horario si existen los datos
    let horarioString = '';
    if (curso.dia && curso.fe_inicio && curso.fe_fin) {
      // Extraer solo la hora de los datetime
      const horaInicio = new Date(curso.fe_inicio).toTimeString().substring(0, 5);
      const horaFin = new Date(curso.fe_fin).toTimeString().substring(0, 5);
      horarioString = `${curso.dia}, ${horaInicio} - ${horaFin}`;
    }

    // Construir respuesta
    const response = {
      ...curso,
      nom_materia: materiaName,
      nivel: nivelName,
      modalidad: modalidadName,
      horario: horarioString, // Horario construido desde los datos de Horario_curso
      // Agregar info de debug
      _debug: {
        allKeys: Object.keys(curso),
        horarioData: {
          dia: curso.dia,
          fe_inicio: curso.fe_inicio,
          fe_fin: curso.fe_fin,
          horarioString: horarioString
        }
      }
    };

    console.log('Horario construido:', horarioString);
    console.log('Enviando respuesta - Conexión permanece abierta');
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error en GET /api/editar:', error);
    console.error('Stack trace:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Error del servidor', 
        details: error.message,
        code: error.code || 'UNKNOWN'
      }, 
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const { searchParams } = new URL(request.url);
  const cursoId = searchParams.get('id');

  if (!cursoId || isNaN(cursoId)) {
    return NextResponse.json({ error: 'ID de curso inválido' }, { status: 400 });
  }

  let transaction;
  
  try {
    const body = await request.json();
    const pool = await getOrCreateConnection();
    transaction = new sql.Transaction(pool);
    
    await transaction.begin();

    // Verificar que el curso existe
    const cursoExists = await transaction.request()
      .input('cursoId', sql.Int, parseInt(cursoId))
      .query('SELECT Id_hor FROM Curso WHERE Id_curso = @cursoId');
    
    if (cursoExists.recordset.length === 0) {
      await transaction.rollback();
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
    }

    const cursoData = cursoExists.recordset[0];
    let horarioId = cursoData.Id_hor;

    // Preparar actualización del curso
    const updateFields = [];
    const updateRequest = transaction.request().input('cursoId', sql.Int, parseInt(cursoId));

    // Mapeo de campos del curso
    const fieldMap = {
      nombreCurso: { column: 'nom_curso', type: sql.VarChar(100) },
      descripcion: { column: 'discripcion', type: sql.VarChar(sql.MAX) },
      precio: { column: 'precio', type: sql.Decimal(10, 2) },
      modalidad: { column: 'Id_mod', type: sql.Int },
      nivel: { column: 'Id_nivel', type: sql.Int },
      cantMinEstudiantes: { column: 'cant_est_min', type: sql.Int },
      resumen: { column: 'resumen', type: sql.VarChar(500) },
      queAprendere: { column: 'que_aprendere', type: sql.VarChar(sql.MAX) }
    };

    // Procesar campos básicos del curso
    for (const [key, { column, type }] of Object.entries(fieldMap)) {
      if (body[key] !== undefined && body[key] !== null && body[key] !== '') {
        updateFields.push(`${column} = @${key}`);
        let value = body[key];
        
        if (type === sql.Decimal) value = parseFloat(value);
        else if (type === sql.Int) value = parseInt(value);
        
        updateRequest.input(key, type, value);
      }
    }

    // Manejar materia especialmente
    if (body.materia && body.materia.trim() !== '') {
      const materiaName = body.materia.trim();
      
      // Buscar materia existente
      let materiaResult = await transaction.request()
        .input('materia', sql.VarChar(100), materiaName)
        .query('SELECT Id_materia FROM Materias WHERE desc_mat = @materia');
      
      let materiaId;
      if (materiaResult.recordset.length > 0) {
        materiaId = materiaResult.recordset[0].Id_materia;
      } else {
        // Crear nueva materia
        const newMateria = await transaction.request()
          .input('materia', sql.VarChar(100), materiaName)
          .query('INSERT INTO Materias (desc_mat) OUTPUT INSERTED.Id_materia VALUES (@materia)');
        materiaId = newMateria.recordset[0].Id_materia;
      }
      
      updateFields.push('Id_materia = @materiaId');
      updateRequest.input('materiaId', sql.Int, materiaId);
    }

    // Manejar horario (dia, horaInicio, horaFin)
    if (body.dia && body.horaInicio && body.horaFin) {
      const dia = body.dia;
      const horaInicio = body.horaInicio;
      const horaFin = body.horaFin;
      
      // Crear fechas con las horas especificadas (usar fecha actual como base)
      const fechaBase = new Date();
      const fechaInicio = new Date(fechaBase);
      const fechaFin = new Date(fechaBase);
      
      // Parsear las horas
      const [horaIni, minIni] = horaInicio.split(':');
      const [horaFinH, minFin] = horaFin.split(':');
      
      fechaInicio.setHours(parseInt(horaIni), parseInt(minIni), 0, 0);
      fechaFin.setHours(parseInt(horaFinH), parseInt(minFin), 0, 0);

      if (horarioId) {
        // Actualizar horario existente
        await transaction.request()
          .input('horarioId', sql.Int, horarioId)
          .input('dia', sql.VarChar(20), dia)
          .input('feInicio', sql.DateTime, fechaInicio)
          .input('feFin', sql.DateTime, fechaFin)
          .input('cursoId', sql.Int, parseInt(cursoId))
          .query(`
            UPDATE Horario_curso 
            SET dia = @dia, fe_inicio = @feInicio, fe_fin = @feFin, Id_curso = @cursoId
            WHERE Id_hor = @horarioId
          `);
      } else {
        // Crear nuevo horario
        const newHorario = await transaction.request()
          .input('dia', sql.VarChar(20), dia)
          .input('feInicio', sql.DateTime, fechaInicio)
          .input('feFin', sql.DateTime, fechaFin)
          .input('cursoId', sql.Int, parseInt(cursoId))
          .query(`
            INSERT INTO Horario_curso (dia, fe_inicio, fe_fin, Id_curso) 
            OUTPUT INSERTED.Id_hor
            VALUES (@dia, @feInicio, @feFin, @cursoId)
          `);
        
        horarioId = newHorario.recordset[0].Id_hor;
        updateFields.push('Id_hor = @horarioId');
        updateRequest.input('horarioId', sql.Int, horarioId);
      }
    }

    // Ejecutar actualización del curso
    if (updateFields.length > 0) {
      await updateRequest.query(`
        UPDATE Curso SET ${updateFields.join(', ')} WHERE Id_curso = @cursoId
      `);
    }

    await transaction.commit();
    
    console.log('Curso actualizado - Conexión permanece abierta');
    return NextResponse.json({ 
      success: true,
      message: 'Curso actualizado correctamente'
    });

  } catch (error) {
    console.error('Error en PUT /api/editar:', error);
    if (transaction) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Error en rollback:', rollbackError);
      }
    }
    
  }
}