import { NextResponse } from 'next/server';
import { connectToDb } from '../../lib/db';

export async function POST(req) {
    try {
        const body = await req.json();
        const { Id_user: idEstudiante, Id_curso } = body;

        if (!idEstudiante || !Id_curso) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 });
        }

        const pool = await connectToDb();

        // Obtener el tutor del curso
        const cursoResult = await pool.request()
            .input('Id_curso', Id_curso)
            .query('SELECT Id_user FROM Curso WHERE Id_curso = @Id_curso');

        if (cursoResult.recordset.length === 0) {
            return NextResponse.json({ error: 'Curso no encontrado' }, { status: 404 });
        }

        const idTutor = cursoResult.recordset[0].Id_user;

        // Insertar en Solicitud_cursos_tutor (Id_user = estudiante)
        const solicitudResult = await pool.request()
            .input('Id_user', idEstudiante)
            .input('Id_curso', Id_curso)
            .input('Id_estado', 3) // pendiente
            .query(`
                INSERT INTO Solicitud_cursos_tutor (Id_user, Id_curso, Id_estado)
                OUTPUT INSERTED.Id_solcur
                VALUES (@Id_user, @Id_curso, @Id_estado)
            `);

        const Id_solcur = solicitudResult.recordset[0].Id_solcur;

        // Insertar notificación para el tutor
        await pool.request()
            .input('Id_user', idTutor)
            .input('Id_solcur', Id_solcur)
            .input('mensaje', 'Solicitud pendiente')
            .input('fec_envio', new Date())
            .input('Id_estado', 3) // pendiente también para la notificación
            .query(`
                INSERT INTO Notificaciones (Id_user, Id_solcur, mensaje, fec_envio, Id_estado)
                VALUES (@Id_user, @Id_solcur, @mensaje, @fec_envio, @Id_estado)
            `);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error al procesar solicitud:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
