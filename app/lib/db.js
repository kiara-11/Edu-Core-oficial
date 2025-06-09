import * as sql from 'mssql';

const config = {
  user: 'sa',
  password: '12345678',
  server: '172.24.240.1',
  database: 'educore',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  requestTimeout: 15000 // ⏱️ Aumenta a 15 segundos
};


let pool;

export async function connectToDb() {
  try {
    if (!pool) {
      pool = await sql.connect(config);
      console.log('✅ Conectado a SQL Server');
    }
    return pool;
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos', error);
    throw error;
  }
}

export { sql };
