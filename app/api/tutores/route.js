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
        dp.Nombre,
        dp.ApePat,
        dp.ApeMat,
        dp.email,
        c.nom_curso,
        c.discripcion,
        c.cant_est_min,
        c.precio,
        m.descripcion AS modalidad,
        nc.nombre_nivel AS nivel,
        mat.desc_mat AS nom_materia,
        CONCAT(hc.dia, ', ', FORMAT(hc.fe_inicio, 'HH:mm'), ' - ', FORMAT(hc.fe_fin, 'HH:mm')) AS horario
      FROM Curso c
      JOIN Usuario u ON c.Id_user = u.Id_user
      JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      JOIN Materias mat ON c.Id_materia = mat.Id_materia
      JOIN Horario_curso hc ON c.Id_hor = hc.Id_hor
      JOIN Modalidad m ON c.Id_mod = m.Id_mod
      JOIN Nivel_curso nc ON c.Id_nivel = nc.Id_nivel
    `;

        // Solo aplica filtro si hay un id_user
        if (id_user) {
            query += ` WHERE c.Id_user = @id_user`;

            const result = await pool.request()
                .input("id_user", sql.Int, id_user)
                .query(query);

            return NextResponse.json(result.recordset);
        } else {
            // Sin filtro → todos los cursos
            const result = await pool.request().query(query);
            return NextResponse.json(result.recordset);
        }

    } catch (error) {
        console.error("Error al obtener tutores:", error);
        return NextResponse.json({ error: "Error al obtener tutores" }, { status: 500 });
    }
}
