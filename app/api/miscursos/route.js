import { connectToDb } from '../../lib/db';
import { NextResponse } from 'next/server';
import sql from 'mssql';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id_user = searchParams.get('id_user');

    try {
        const pool = await connectToDb();

        let query = `
      SELECT
        cp.Id_progcur,
        cp.Id_estado,
        dp.Nombre,
        dp.ApePat,
        dp.ApeMat,
        dp.email,
        c.nom_curso AS NombreCurso,
        c.discripcion,
        c.cant_est_min,
        c.precio,
        m.descripcion AS Modalidad,
        nc.nombre_nivel AS nivel,
        mat.desc_mat AS nom_materia,
        CONCAT(hc.dia, ', ', FORMAT(hc.fe_inicio, 'HH:mm'), ' - ', FORMAT(hc.fe_fin, 'HH:mm')) AS Horario
      FROM Cursos_programados cp
      JOIN Solicitud_cursos_tutor sct ON cp.Id_solcur = sct.Id_solcur
      JOIN Curso c ON sct.Id_curso = c.Id_curso
      JOIN Usuario u ON c.Id_user = u.Id_user
      JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      JOIN Materias mat ON c.Id_materia = mat.Id_materia
      JOIN Horario_curso hc ON c.Id_hor = hc.Id_hor
      JOIN Modalidad m ON c.Id_mod = m.Id_mod
      JOIN Nivel_curso nc ON c.Id_nivel = nc.Id_nivel
      WHERE sct.Id_user = @id_user
    `;

        const result = await pool
            .request()
            .input('id_user', sql.Int, id_user)
            .query(query);

        return NextResponse.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener cursos:', error);
        return NextResponse.json({ error: 'Error al obtener cursos' }, { status: 500 });
    }
}
