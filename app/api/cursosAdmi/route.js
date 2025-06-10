import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  let pool;
  
  try {
    pool = await connectToDb();
    
    const result = await pool.request().query(`
      SELECT 
        c.Id_curso,
        c.nom_curso,
        c.discripcion,
        c.precio,
        c.cant_est_min,
        c.resumen,
        c.que_aprendere,
        m.descripcion as modalidad,
        n.desc_nivel as nivel,
        mat.desc_mat as nom_materia,
        h.dia + ', ' + CONVERT(VARCHAR(5), h.fe_inicio, 108) + ' - ' + 
          CONVERT(VARCHAR(5), h.fe_fin, 108) as horario,
        dp.Nombre,
        dp.ApePat,
        dp.ApeMat,
        dp.email,
        c.Id_user as Id_tutor
      FROM Curso c
      LEFT JOIN Modalidad m ON c.Id_mod = m.Id_mod
      LEFT JOIN Nivel_curso n ON c.Id_nivel = n.Id_nivel
      LEFT JOIN Materias mat ON c.Id_materia = mat.Id_materia
      LEFT JOIN Horario_curso h ON c.Id_hor = h.Id_hor
      LEFT JOIN Usuario u ON c.Id_user = u.Id_user
      LEFT JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      ORDER BY c.nom_curso
    `);

    return NextResponse.json(result.recordset, { status: 200 });

  } catch (error) {
    console.error('Error al obtener cursos:', error);
    return NextResponse.json(
      { error: 'Error al obtener cursos', details: error.message },
      { status: 500 }
    );
  }
}