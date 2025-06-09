import { NextResponse } from 'next/server';
import { connectToDb } from '../../lib/db';
import sql from 'mssql';

export async function POST(req) {
    try {
        const { Id_solcur, decision } = await req.json();

        console.log('Recibido en gestionar-solicitud:', { Id_solcur, decision });

        if (!Id_solcur || !decision) {
            return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
        }

        const pool = await connectToDb();

        if (decision === 'aceptar') {
            console.log(`Insertando en Cursos_programados con Id_solcur=${Id_solcur}`);
            await pool.request()
                .input('Id_solcur', sql.Int, parseInt(Id_solcur, 10))
                .input('Id_estado', sql.Int, 6)
                .query(`
                    INSERT INTO Cursos_programados (Id_solcur, Id_estado)
                    VALUES (@Id_solcur, @Id_estado)
                `);

            console.log(`Actualizando Solicitud_cursos_tutor a aprobado para Id_solcur=${Id_solcur}`);
            await pool.request()
                .input('Id_solcur', sql.Int, parseInt(Id_solcur, 10))
                .input('Id_estado', sql.Int, 5)
                .query(`
                    UPDATE Solicitud_cursos_tutor
                    SET Id_estado = @Id_estado
                    WHERE Id_solcur = @Id_solcur
                `);
        } else if (decision === 'rechazar') {
            console.log(`Actualizando Solicitud_cursos_tutor a rechazado para Id_solcur=${Id_solcur}`);
            await pool.request()
                .input('Id_solcur', sql.Int, parseInt(Id_solcur, 10))
                .input('Id_estado', sql.Int, 4)
                .query(`
                    UPDATE Solicitud_cursos_tutor
                    SET Id_estado = @Id_estado
                    WHERE Id_solcur = @Id_solcur
                `);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error al gestionar solicitud:', error.message, error.stack);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
