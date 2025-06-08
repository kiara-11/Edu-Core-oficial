import { connectToDb, sql } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(request, { params }) {
  let pool;
  
  try {
    // Await params antes de acceder a sus propiedades
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    console.log('Eliminando curso con ID:', id);
    
    // Validar que el ID sea un número válido
    const cursoId = parseInt(id);
    if (isNaN(cursoId)) {
      console.error('ID de curso inválido:', id);
      return NextResponse.json(
        { error: 'ID de curso inválido' },
        { status: 400 }
      );
    }

    // Conectar a la base de datos usando la función de conexión
    pool = await connectToDb();
    console.log('Conexión a base de datos establecida');

    // Verificar si el curso existe antes de eliminarlo
    const verificarCurso = await pool.request()
      .input('Id_curso', sql.Int, cursoId)
      .query('SELECT Id_curso, nom_curso, Id_hor FROM Curso WHERE Id_curso = @Id_curso');

    if (verificarCurso.recordset.length === 0) {
      console.log('Curso no encontrado:', cursoId);
      return NextResponse.json(
        { error: 'El curso no existe' },
        { status: 404 }
      );
    }

    const { nom_curso: nombreCurso, Id_hor: horarioId } = verificarCurso.recordset[0];
    console.log('Curso encontrado:', { nombreCurso, horarioId });

    // Verificar si hay inscripciones activas (esto podría ser crítico)
    const verificarInscripciones = await pool.request()
      .input('Id_curso', sql.Int, cursoId)
      .query(`
        SELECT COUNT(*) as total FROM Solicitud_cursos_tutor 
        WHERE Id_curso = @Id_curso AND Id_estado IN (
          SELECT Id_estado FROM Estados WHERE desc_estado IN ('aprobado', 'pendiente')
        )
      `);

    const inscripcionesActivas = verificarInscripciones.recordset[0].total;
    console.log('Inscripciones activas:', inscripcionesActivas);

    if (inscripcionesActivas > 0) {
      return NextResponse.json(
        { 
          error: `No se puede eliminar el curso "${nombreCurso}" porque tiene ${inscripcionesActivas} estudiante(s) inscrito(s) o solicitudes pendientes. Primero debe gestionar estas inscripciones.`,
          code: 'ACTIVE_ENROLLMENTS'
        },
        { status: 409 }
      );
    }

    // Iniciar transacción para eliminar de manera segura
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    console.log('Transacción iniciada');

    try {
      // Eliminar registros relacionados en el orden correcto
      // Basado en las relaciones de la base de datos
      
      console.log('Eliminando registros relacionados...');
      
      // 1. Eliminar solicitudes de cursos rechazadas o canceladas
      await transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .query(`
          DELETE FROM Solicitud_cursos_tutor 
          WHERE Id_curso = @Id_curso 
          AND Id_estado IN (
            SELECT Id_estado FROM Estados WHERE desc_estado IN ('rechazado', 'cancelado')
          )
        `);

      // 2. Eliminar comentarios del curso
      await transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .query('DELETE FROM Comentarios_curso WHERE Id_curso = @Id_curso');

      // 3. Eliminar valoraciones del curso
      await transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .query('DELETE FROM Valoracion_curso WHERE Id_curso = @Id_curso');

      // 4. Eliminar contactos del curso
      await transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .query('DELETE FROM Contacto WHERE Id_curso = @Id_curso');

      // 5. Eliminar lecciones del curso
      await transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .query('DELETE FROM Lecciones_curso WHERE Id_curso = @Id_curso');

      // 6. Eliminar prerequisitos del curso
      await transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .query('DELETE FROM Prerequisitos_curso WHERE Id_curso = @Id_curso');

      // 7. Eliminar categorías del curso
      await transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .query('DELETE FROM Curso_categorias WHERE Id_curso = @Id_curso');

      // 8. Eliminar promociones del curso
      await transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .query('DELETE FROM Promocion WHERE Id_curso = @Id_curso');

      // 9. Eliminar historial de búsquedas
      await transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .query('DELETE FROM Historial_busqueda WHERE Id_curso = @Id_curso');

      // 10. Eliminar reportes del curso
      await transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .query('DELETE FROM Reporte_curso_est WHERE Id_curso = @Id_curso');

      console.log('Eliminando el curso principal...');
      
      // Finalmente, eliminar el curso principal
      const resultadoCurso = await transaction.request()
        .input('Id_curso', sql.Int, cursoId)
        .query('DELETE FROM Curso WHERE Id_curso = @Id_curso');

      if (resultadoCurso.rowsAffected[0] === 0) {
        console.error('No se pudo eliminar el curso');
        await transaction.rollback();
        return NextResponse.json(
          { error: 'No se pudo eliminar el curso' },
          { status: 500 }
        );
      }

      console.log('Curso eliminado exitosamente');

      // Eliminar horario si existe
      if (horarioId) {
        try {
          console.log('Eliminando horario:', horarioId);
          await transaction.request()
            .input('Id_hor', sql.Int, horarioId)
            .query('DELETE FROM Horario_curso WHERE Id_hor = @Id_hor');
        } catch (horarioError) {
          console.warn('No se pudo eliminar el horario:', horarioError.message);
          // No es crítico, continúa
        }
      }

      // Confirmar la transacción
      await transaction.commit();
      console.log('Transacción confirmada');

      return NextResponse.json({
        success: true,
        message: `Curso "${nombreCurso}" eliminado exitosamente`,
        cursoId: cursoId
      });

    } catch (transactionError) {
      // Revertir la transacción en caso de error
      console.error('Error en transacción:', transactionError);
      await transaction.rollback();
      throw transactionError;
    }

  } catch (error) {
    console.error('Error al eliminar curso:', error);
    
    // Manejar errores específicos de SQL Server
    if (error.number === 547) { // Error de restricción de clave foránea
      return NextResponse.json(
        { 
          error: 'No se puede eliminar el curso porque tiene datos críticos relacionados (pagos completados, historial académico, etc.). Contacte al administrador del sistema.',
          code: 'FOREIGN_KEY_CONSTRAINT'
        },
        { status: 409 }
      );
    }
    
    // Error de conexión
    if (error.code === 'ECONNCLOSED' || error.code === 'ECONNRESET') {
      return NextResponse.json(
        { error: 'Error de conexión a la base de datos. Intente nuevamente.' },
        { status: 503 }
      );
    }
    
    // Error de timeout
    if (error.code === 'ETIMEOUT') {
      return NextResponse.json(
        { error: 'Tiempo de espera agotado. Intente nuevamente.' },
        { status: 408 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor al eliminar el curso' },
      { status: 500 }
    );
  } finally {
    // Cerrar la conexión
    if (pool) {
      try {
        await pool.close();
        console.log('Conexión cerrada');
      } catch (closeError) {
        console.error('Error al cerrar la conexión:', closeError);
      }
    }
  }
}