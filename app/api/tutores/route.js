import { connectToDb } from '../../lib/db'; // ajusta si tu ruta cambia
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const pool = await connectToDb();

        const query = `
SELECT 
  dp.Nombre, dp.ApePat, dp.ApeMat, dp.email,
  c.nom_curso,
  c.discripcion,
  m.desc_mat AS nom_materia
FROM Curso c
JOIN Usuario u ON c.Id_user = u.Id_user
JOIN Datos_personales dp ON u.id_dp = dp.id_dp
JOIN Materias m ON c.Id_materia = m.Id_materia


    `;


        const result = await pool.request().query(query);
        return NextResponse.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener tutores:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}
