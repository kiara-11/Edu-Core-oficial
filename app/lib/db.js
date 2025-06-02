import * as sql from 'mssql';

const config = {
  user: 'sa',
  password: 'Kiara1108*',
  server: '172.174.1.39',
  database: 'educore',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
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
