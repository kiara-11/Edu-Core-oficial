// archivo: app/api/user-solicitud-status/route.ts

import { NextResponse } from 'next/server';
import { connectToDb } from '../../lib/db';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Falta userId' }, { status: 400 });
        }

        const pool = await connectToDb();

        // 🔹 1. Consulta el estado de la solicitud del usuario actual
        const solicitudRes = await pool.request()
            .input('Id_user', userId)
            .query(`
                SELECT TOP 1 
                    s.Id_estado,
                    e.desc_estado,
                    n.mensaje,
                    n.fec_envio
                FROM Solicitud_cursos_tutor s
                LEFT JOIN Estados e ON s.Id_estado = e.Id_estado
                LEFT JOIN Notificaciones n ON n.Id_solcur = s.Id_solcur AND n.Id_user = @Id_user
                WHERE s.Id_user = @Id_user
                ORDER BY n.fec_envio DESC
            `);

        let estadoSolicitud = null;
        if (solicitudRes.recordset.length > 0) {
            const row = solicitudRes.recordset[0];
            estadoSolicitud = {
                status: row.desc_estado,
                mensaje: row.mensaje,
                fecha: row.fec_envio
            };
        }

        // 🔹 2. Obtener solicitudes que estudiantes enviaron a cursos del usuario actual (si es tutor)
        const notificacionesEstudiantesRes = await pool.request()
            .input('Id_user', userId)
            .query(`
        SELECT 
            sct.Id_solcur, -- <--- importante
            u.user_name AS nombre_estudiante,
            c.nom_curso,
            n.mensaje,
            n.fec_envio,
            e.desc_estado
        FROM Curso c
        INNER JOIN Solicitud_cursos_tutor sct ON c.Id_curso = sct.Id_curso
        INNER JOIN Usuario u ON sct.Id_user = u.Id_user
        INNER JOIN Notificaciones n ON sct.Id_solcur = n.Id_solcur
        INNER JOIN Estados e ON sct.Id_estado = e.Id_estado
        WHERE c.Id_user = @Id_user
        ORDER BY n.fec_envio DESC
    `);


        const notificacionesEstudiantes = notificacionesEstudiantesRes.recordset.map(row => ({
            idSolcur: row.Id_solcur,
            estudiante: row.nombre_estudiante,
            curso: row.nom_curso,
            mensaje: row.mensaje,
            fecha: row.fec_envio,
            estado: row.desc_estado
        }));

        return NextResponse.json({
            estadoSolicitud,
            notificacionesEstudiantes
        });

    } catch (error) {
        console.error('Error al obtener estado de solicitud o notificaciones:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
