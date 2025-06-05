import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

// ✅ Actualizar datos específicos del usuario desde admin
export async function PUT(request) {
  try {
    // Validar que el request tenga contenido
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ 
        message: 'Content-Type debe ser application/json' 
      }, { status: 400 });
    }

    let data;
    try {
      data = await request.json();
    } catch (jsonError) {
      console.error('❌ Error al parsear JSON:', jsonError);
      return NextResponse.json({ 
        message: 'Error en el formato JSON de la solicitud' 
      }, { status: 400 });
    }

    const { id, name, phone, email, originalEmail } = data;

    // Validar que al menos se proporcione el ID o email original
    if (!id && !originalEmail) {
      return NextResponse.json({ 
        message: 'ID de usuario o email original no proporcionado' 
      }, { status: 400 });
    }

    // Validar que al menos un campo esté presente para actualizar
    if (!name && !phone && !email) {
      return NextResponse.json({ 
        message: 'Al menos un campo debe ser proporcionado para actualizar' 
      }, { status: 400 });
    }

    await connectToDb();

    // Construir la consulta dinámicamente solo con los campos que se van a actualizar
    let updateFields = [];
    const request_db = new sql.Request();
    
    // Usar email original como identificador principal, ID como secundario
    if (originalEmail) {
      request_db.input('originalEmail', sql.VarChar(100), originalEmail);
    }
    if (id) {
      request_db.input('id_dp', sql.Int, parseInt(id));
    }

    // Procesar el nombre si se proporciona
    if (name && name.trim()) {
      const partes = name.trim().split(/\s+/); // Usar regex para dividir por cualquier espacio
      
      // Reorganizar: últimas dos partes como apellidos, el resto como nombres
      if (partes.length >= 3) {
        const Nombre = partes.slice(0, -2).join(' '); // Todo excepto las últimas 2 partes
        const ApePat = partes[partes.length - 2]; // Penúltima parte
        const ApeMat = partes[partes.length - 1]; // Última parte
        
        updateFields.push('Nombre = @Nombre', 'ApePat = @ApePat', 'ApeMat = @ApeMat');
        request_db.input('Nombre', sql.VarChar(100), Nombre);
        request_db.input('ApePat', sql.VarChar(50), ApePat);
        request_db.input('ApeMat', sql.VarChar(50), ApeMat);
      } else if (partes.length === 2) {
        const ApePat = partes[0];
        const ApeMat = partes[1];
        
        updateFields.push('ApePat = @ApePat', 'ApeMat = @ApeMat');
        request_db.input('ApePat', sql.VarChar(50), ApePat);
        request_db.input('ApeMat', sql.VarChar(50), ApeMat);
      } else if (partes.length === 1) {
        const Nombre = partes[0];
        updateFields.push('Nombre = @Nombre');
        request_db.input('Nombre', sql.VarChar(100), Nombre);
      }
    }

    // Procesar teléfono si se proporciona
    if (phone && phone.trim()) {
      updateFields.push('telefono = @telefono');
      request_db.input('telefono', sql.VarChar(20), phone.trim());
    }

    // Procesar email si se proporciona
    if (email && email.trim()) {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return NextResponse.json({ 
          message: 'El formato del email no es válido' 
        }, { status: 400 });
      }
      
      updateFields.push('email = @email');
      request_db.input('email', sql.VarChar(100), email.trim());
    }

    // Verificar que hay campos para actualizar
    if (updateFields.length === 0) {
      return NextResponse.json({ 
        message: 'No hay campos válidos para actualizar' 
      }, { status: 400 });
    }

    // Crear la consulta SQL - buscar primero por email original, luego por ID
    let whereClause = '';
    if (originalEmail && id) {
      whereClause = '(email = @originalEmail OR id_dp = @id_dp)';
    } else if (originalEmail) {
      whereClause = 'email = @originalEmail';
    } else if (id) {
      whereClause = 'id_dp = @id_dp';
    }

    const updateQuery = `
      UPDATE Datos_personales 
      SET ${updateFields.join(', ')}
      WHERE ${whereClause}
    `;

    console.log('🔄 Ejecutando consulta:', updateQuery);
    console.log('📊 Parámetros:', { id, name, phone, email, originalEmail });

    // Ejecutar la consulta
    const result = await request_db.query(updateQuery);

    // Verificar si se actualizó algún registro
    if (result.rowsAffected[0] === 0) {
      return NextResponse.json({ 
        message: 'No se encontró el usuario con los datos proporcionados' 
      }, { status: 404 });
    }

    console.log('✅ Usuario actualizado correctamente');

    return NextResponse.json({
      message: 'Usuario actualizado correctamente',
      updatedFields: { 
        id: id ? parseInt(id) : null,
        name: name || null, 
        phone: phone || null, 
        email: email || null,
        originalEmail: originalEmail || null
      },
      rowsAffected: result.rowsAffected[0]
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    
    // Proporcionar más detalles del error
    let errorMessage = 'Error interno del servidor';
    if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({
      message: 'Error al actualizar los datos del usuario',
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}