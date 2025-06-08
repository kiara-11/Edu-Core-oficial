import { connectToDb } from '../../lib/db';
import { NextResponse } from 'next/server';
import sql from 'mssql';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const id_user = searchParams.get('id_user');
    
    let pool;

    try {
        // Crear una nueva conexión para esta request
        pool = await connectToDb();
        
        // Verificar que la conexión esté activa
        if (!pool.connected) {
            console.log('Pool no conectado, intentando reconectar...');
            await pool.connect();
        }

        let query = `
            SELECT
                c.Id_curso,
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

        let result;

        if (id_user) {
            query += ` WHERE c.Id_user = @id_user`;
            
            const request = pool.request();
            request.input("id_user", sql.Int, id_user);
            result = await request.query(query);
        } else {
            // Sin filtro → todos los cursos
            const request = pool.request();
            result = await request.query(query);
        }

        return NextResponse.json(result.recordset);

    } catch (error) {
        console.error("Error al obtener tutores:", error);
        
        // Si es un error de conexión, intentar reconectar
        if (error.code === 'ECONNCLOSED' || error.code === 'ENOTOPEN') {
            try {
                console.log('Intentando reconectar a la base de datos...');
                pool = await connectToDb();
                
                // Reintentar la consulta
                let result;
                if (id_user) {
                    const query = `
                        SELECT
                            c.Id_curso,
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
                    request.input("id_user", sql.Int, id_user);
                    result = await request.query(query);
                } else {
                    const query = `
                        SELECT
                            c.Id_curso,
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
                    
                    const request = pool.request();
                    result = await request.query(query);
                }
                
                return NextResponse.json(result.recordset);
                
            } catch (retryError) {
                console.error("Error en reintento:", retryError);
                return NextResponse.json({ 
                    error: "Error de conexión a la base de datos", 
                    details: retryError.message 
                }, { status: 500 });
            }
        }
        
        return NextResponse.json({ 
            error: "Error al obtener tutores", 
            details: error.message 
        }, { status: 500 });
    }
}