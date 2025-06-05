import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

// ✅ Eliminar usuario completo (datos personales + usuario + roles) - CORREGIDO con búsqueda por email
export async function DELETE(request) {
  let pool;
  
  try {
    // ✅ Validar que el request tenga contenido
    if (!request.body) {
      return NextResponse.json({ 
        message: 'No se enviaron datos para procesar' 
      }, { status: 400 });
    }

    const data = await request.json();
    const { email } = data; // ✅ CAMBIO: Ahora usamos email en lugar de id

    // ✅ Validar email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ 
        message: 'Email no válido o no proporcionado' 
      }, { status: 400 });
    }

    console.log('🗑️ Eliminando usuario con email:', email);

    // ✅ Conectar a la base de datos
    pool = await connectToDb();

    // ✅ Verificar que el usuario existe antes de eliminar - BUSCAR POR EMAIL
    const checkUser = await pool.request()
      .input('email', sql.VarChar, email)
      .query(`
        SELECT 
          dp.id_dp, 
          dp.ApePat, 
          dp.ApeMat, 
          dp.Nombre,
          dp.email
        FROM Datos_personales dp
        WHERE dp.email = @email
      `);

    if (checkUser.recordset.length === 0) {
      return NextResponse.json({ 
        message: 'Usuario no encontrado en el sistema' 
      }, { status: 404 });
    }

    const usuario = checkUser.recordset[0];
    const userId = usuario.id_dp; // ✅ Obtenemos el ID después de encontrar por email
    
    console.log('👤 Usuario encontrado:', {
      id: usuario.id_dp,
      nombre: `${usuario.Nombre} ${usuario.ApePat} ${usuario.ApeMat}`,
      email: usuario.email
    });

    // ✅ Iniciar transacción para eliminar en el orden correcto
    const transaction = new sql.Transaction(pool);
    
    try {
      await transaction.begin();
      console.log('🔄 Iniciando transacción de eliminación...');

      // 1️⃣ Eliminar roles del usuario (si existen)
      const deleteRoles = await transaction.request()
        .input('id_dp', sql.Int, userId)
        .query(`DELETE FROM User_roles WHERE id_dp = @id_dp`);
      
      console.log('✅ Roles eliminados:', deleteRoles.rowsAffected[0]);

      // 2️⃣ Eliminar registro de Usuario (si existe)
      const deleteUsuario = await transaction.request()
        .input('id_dp', sql.Int, userId)
        .query(`DELETE FROM Usuario WHERE id_dp = @id_dp`);
      
      console.log('✅ Usuario eliminado:', deleteUsuario.rowsAffected[0]);

      // 3️⃣ Eliminar datos personales (tabla principal)
      const deleteDatosPersonales = await transaction.request()
        .input('id_dp', sql.Int, userId)
        .query(`DELETE FROM Datos_personales WHERE id_dp = @id_dp`);

      console.log('✅ Datos personales eliminados:', deleteDatosPersonales.rowsAffected[0]);

      // ✅ Verificar que se eliminó el registro principal
      if (deleteDatosPersonales.rowsAffected[0] === 0) {
        await transaction.rollback();
        return NextResponse.json({ 
          message: 'Error: No se pudo eliminar el usuario' 
        }, { status: 500 });
      }

      // ✅ Confirmar la transacción
      await transaction.commit();
      console.log('✅ Transacción completada exitosamente');

      return NextResponse.json({ 
        message: `Usuario ${usuario.Nombre} ${usuario.ApePat} eliminado correctamente`,
        deletedEmail: email,
        deletedUser: {
          name: `${usuario.Nombre} ${usuario.ApePat} ${usuario.ApeMat || ''}`.trim(),
          email: usuario.email
        }
      }, { status: 200 });

    } catch (transactionError) {
      // ✅ Revertir cambios si hay error en la transacción
      console.error('❌ Error en transacción:', transactionError);
      await transaction.rollback();
      throw transactionError;
    }

  } catch (error) {
    console.error('❌ Error completo al eliminar usuario:', error);
    
    // ✅ Devolver error más específico
    let errorMessage = 'Error interno del servidor al eliminar usuario';
    
    if (error.message && error.message.includes('Invalid column name')) {
      errorMessage = 'Error de esquema de base de datos. Verifica la estructura de las tablas.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    if (error.code) {
      errorMessage += ` (Código: ${error.code})`;
    }

    return NextResponse.json({ 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.stack : 'Error interno'
    }, { status: 500 });
    
  } finally {
    // ✅ Cerrar conexión si existe
    if (pool) {
      try {
        await pool.close();
        console.log('🔌 Conexión cerrada correctamente');
      } catch (closeError) {
        console.error('❌ Error al cerrar conexión:', closeError);
      }
    }
  }
}

// ✅ Manejar otros métodos HTTP
export async function GET() {
  return NextResponse.json({ 
    message: 'Este endpoint solo acepta peticiones DELETE' 
  }, { status: 405 });
}

export async function POST() {
  return NextResponse.json({ 
    message: 'Este endpoint solo acepta peticiones DELETE' 
  }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ 
    message: 'Este endpoint solo acepta peticiones DELETE' 
  }, { status: 405 });
}