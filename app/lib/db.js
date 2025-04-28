import sql from 'mssql';

// Configuración de conexión a SQL Server
const config = {
  user: 'sa',                        // Usuario de SQL Server
  password: 'apazaeric1',          // Contraseña del usuario `sa`
  server: 'localhost',                // Nombre del servidor, usa `localhost` o `127.0.0.1`
  database: 'educore',                // Nombre de la base de datos
  options: {
    encrypt: true,                    // Usar cifrado si es necesario
    trustServerCertificate: true,     // Solo para desarrollo local
  },
};

export async function connectToDb() {
  try {
    // Establece la conexión con SQL Server
    await sql.connect(config);
    console.log('Conectado a SQL Server');
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
    throw error;
  }
}

// Exporta el objeto sql para usarlo en consultas
export { sql };
