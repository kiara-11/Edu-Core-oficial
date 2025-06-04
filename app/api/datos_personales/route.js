import { connectToDb } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log("Intentando conectar a la base de datos...");
        const pool = await connectToDb();
        console.log("Conexión establecida, ejecutando query...");
        const result = await pool.request().query('SELECT * FROM Datos_personales');
        console.log("Query ejecutada correctamente.");
        return NextResponse.json(result.recordset);
    } catch (error) {
        console.error('Error al obtener datos:', error.message, error.stack);
        return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
    }
}
