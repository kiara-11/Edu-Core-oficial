import { connectToDb, sql } from '../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, context) {
    const { id } = await context.params;


    try {
        const pool = await connectToDb();

        const result = await pool.request()
            .input('id', id)
            .query(`
        SELECT 
  c.nom_curso,
  c.precio,
  CONCAT(FORMAT(h.fe_inicio, 'HH:mm'), ' a ', FORMAT(h.fe_fin, 'HH:mm')) AS horario,
  mod.descripcion AS modalidad,
  n.nombre_nivel AS nivel,
  c.foto_curso
FROM Curso c
JOIN Horario_curso h ON c.Id_hor = h.Id_hor
JOIN Modalidad mod ON c.Id_mod = mod.Id_mod
JOIN Nivel_curso n ON c.Id_nivel = n.Id_nivel
WHERE c.Id_curso = @id

      `);

        if (result.recordset.length === 0) {
            return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
        }

        return NextResponse.json(result.recordset[0]);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
    }
}
