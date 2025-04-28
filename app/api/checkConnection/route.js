// /app/api/checkConnection/route.js
import { connectToDb, sql } from '../../lib/db';


export async function GET(req) {
  try {
    await connectToDb();
    const result = await sql.query`SELECT 1 AS test`;
    console.log('Conexión exitosa', result);
    return new Response(JSON.stringify({ message: 'Conexión exitosa a la base de datos' }), { status: 200 });
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
    return new Response(JSON.stringify({ message: 'Error al conectar a la base de datos', error: error.message }), { status: 500 });
  }
}
