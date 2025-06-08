import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  let pool;
  
  try {
    // Conectar a la base de datos
    pool = await connectToDb();
    
    // Consulta optimizada para obtener tutores
    // Basada en tu esquema de base de datos
    const result = await pool.request().query(`
      SELECT DISTINCT
        u.Id_user,
        dp.Nombre,
        dp.ApePat,
        dp.ApeMat,
        dp.email,
        dp.telefono,
        r.desc_rol as nombre_rol,
        e.desc_estado as estado_usuario
      FROM Usuario u
      INNER JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      INNER JOIN User_roles ur ON u.Id_user = ur.Id_user
      INNER JOIN Rol r ON ur.Id_rol = r.Id_rol
      LEFT JOIN Estados e ON u.Id_estado = e.Id_estado
      WHERE (
        LOWER(r.desc_rol) LIKE '%tutor%' 
        OR LOWER(r.desc_rol) LIKE '%profesor%'
        OR LOWER(r.desc_rol) LIKE '%instructor%'
      )
      AND dp.Nombre IS NOT NULL 
      AND dp.ApePat IS NOT NULL
      AND dp.email IS NOT NULL
      AND u.Id_estado IS NOT NULL
      ORDER BY dp.ApePat, dp.ApeMat, dp.Nombre
    `);

    console.log(`Se encontraron ${result.recordset.length} tutores`);

    // Si no se encuentran tutores con roles específicos, intentar otra consulta
    if (result.recordset.length === 0) {
      console.log('No se encontraron tutores con roles específicos, intentando consulta alternativa...');
      
      // Consulta alternativa para obtener usuarios que podrían ser tutores
      const alternativeResult = await pool.request().query(`
        SELECT DISTINCT
          u.Id_user,
          dp.Nombre,
          dp.ApePat,
          dp.ApeMat,
          dp.email,
          dp.telefono,
          ISNULL(r.desc_rol, 'Sin rol asignado') as nombre_rol,
          ISNULL(e.desc_estado, 'Estado desconocido') as estado_usuario
        FROM Usuario u
        INNER JOIN Datos_personales dp ON u.id_dp = dp.id_dp
        LEFT JOIN User_roles ur ON u.Id_user = ur.Id_user
        LEFT JOIN Rol r ON ur.Id_rol = r.Id_rol
        LEFT JOIN Estados e ON u.Id_estado = e.Id_estado
        WHERE dp.Nombre IS NOT NULL 
          AND dp.ApePat IS NOT NULL
          AND dp.email IS NOT NULL
          AND LEN(TRIM(dp.Nombre)) > 0
          AND LEN(TRIM(dp.ApePat)) > 0
          AND LEN(TRIM(dp.email)) > 0
        ORDER BY dp.ApePat, dp.ApeMat, dp.Nombre
      `);

      console.log(`Consulta alternativa encontró ${alternativeResult.recordset.length} usuarios`);
      return NextResponse.json(alternativeResult.recordset, { status: 200 });
    }

    return NextResponse.json(result.recordset, { status: 200 });

  } catch (error) {
    console.error('Error detallado al obtener tutores:', {
      message: error.message,
      code: error.code,
      state: error.state,
      severity: error.severity,
      stack: error.stack
    });
    
    // Manejo de errores más específico
    if (error.code) {
      switch (error.code) {
        case 'EREQUEST':
          return NextResponse.json(
            { 
              error: 'Error en la consulta SQL', 
              details: error.message,
              suggestion: 'Verifique que las tablas y columnas existan en la base de datos'
            },
            { status: 400 }
          );
        case 'ECONNRESET':
        case 'ETIMEOUT':
          return NextResponse.json(
            { error: 'Error de conexión a la base de datos' },
            { status: 503 }
          );
        case 'ELOGIN':
          return NextResponse.json(
            { error: 'Error de autenticación en la base de datos' },
            { status: 401 }
          );
        default:
          return NextResponse.json(
            { 
              error: 'Error de base de datos', 
              code: error.code,
              message: error.message 
            },
            { status: 500 }
          );
      }
    }
    
    // Para errores sin código específico
    if (error.message?.includes('Invalid object name')) {
      return NextResponse.json(
        { 
          error: 'Tabla no encontrada en la base de datos',
          suggestion: 'Verifique que las tablas Usuario, Datos_personales, User_roles y Rol existan'
        },
        { status: 500 }
      );
    }
    
  } 
}

// Función auxiliar para debug - puedes llamarla para verificar la estructura
export async function DEBUG_GET_TABLE_INFO() {
  let pool;
  
  try {
    pool = await connectToDb();
    
    // Verificar qué tablas existen
    const tablesResult = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `);
    
    console.log('Tablas disponibles:', tablesResult.recordset.map(t => t.TABLE_NAME));
    
    // Verificar estructura de la tabla Usuario
    const usuarioStructure = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'Usuario'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('Estructura tabla Usuario:', usuarioStructure.recordset);
    
    // Verificar roles disponibles
    const rolesResult = await pool.request().query(`
      SELECT Id_rol, desc_rol FROM Rol ORDER BY desc_rol
    `);
    
    console.log('Roles disponibles:', rolesResult.recordset);
    
    return {
      tables: tablesResult.recordset,
      usuarioStructure: usuarioStructure.recordset,
      roles: rolesResult.recordset
    };
    
  } catch (error) {
    console.error('Error en debug:', error);
    return { error: error.message };
  } 
}