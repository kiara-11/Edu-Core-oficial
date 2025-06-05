import { connectToDb } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url); // <--- esto es necesario
    const id_user = searchParams.get('id_user');

    try {
        const pool = await connectToDb();

        const query = `
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
WHERE c.Id_user = @id_user

`;

        const request = pool.request();
        if (id_user) {
            request.input('id_user', id_user);
        }

        const result = await request.query(query);
        return NextResponse.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener tutores:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
