import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get('estado');
    const busqueda = searchParams.get('busqueda');

    await connectToDb();

    let query = `
      SELECT 
        s.id_solicitud,
        s.universidad,
        s.profesion,
        s.certificacion,
        s.entidad,
        s.anio,
        s.modalidad,
        s.horarios,
        s.frecuencia,
        s.materias,
        s.estado,
        u.user_name,
        CONCAT(dp.ApePat, ' ', dp.ApeMat, ' ', dp.Nombre) AS nombreCompleto,
        dp.email,
        dp.telefono
      FROM Solicitud_tutor1 s
      JOIN Usuario u ON s.id_user = u.id_user
      JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      WHERE 1=1
    `;

    const params = [];
    
    if (estado && estado !== 'Todo') {
      query += ` AND s.estado = @estado`;
      params.push({ name: 'estado', value: estado });
    }

    if (busqueda) {
      query += ` AND (
        CONCAT(dp.ApePat, ' ', dp.ApeMat, ' ', dp.Nombre) LIKE @busqueda 
        OR s.materias LIKE @busqueda
      )`;
      params.push({ name: 'busqueda', value: `%${busqueda}%` });
    }

    query += ` ORDER BY s.id_solicitud DESC`;

    const request_db = sql.query(query);
    params.forEach(param => request_db.input(param.name, param.value));
    const result = await request_db;

    return NextResponse.json(result.recordset, { status: 200 });

  } catch (error) {
    console.error('❌ Error al obtener solicitudes:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id_solicitud, accion, email } = await request.json();

    if (!id_solicitud || !accion || !email) {
      return NextResponse.json({ message: 'ID de solicitud, acción y email son requeridos.' }, { status: 400 });
    }

    if (!['aprobar', 'rechazar'].includes(accion)) {
      return NextResponse.json({ message: 'Acción no válida.' }, { status: 400 });
    }

    await connectToDb();
    const nuevoEstado = accion === 'aprobar' ? 'Aprobado' : 'Rechazado';

    await sql.query`
      UPDATE Solicitud_tutor1 
      SET estado = ${nuevoEstado}
      WHERE id_solicitud = ${id_solicitud}
    `;

    const userResult = await sql.query`
      SELECT u.id_user
      FROM Usuario u
      JOIN Datos_personales dp ON u.id_dp = dp.id_dp
      WHERE dp.email = ${email}
    `;

    if (userResult.recordset.length === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    const id_user = userResult.recordset[0].id_user;

    const roleResult = await sql.query`
      SELECT id_Asig FROM User_roles WHERE id_user = ${id_user}
    `;

    if (accion === 'aprobar') {
      if (roleResult.recordset.length > 0) {
        await sql.query`
          UPDATE User_roles SET id_rol = 2 WHERE id_user = ${id_user}
        `;
      } else {
        await sql.query`
          INSERT INTO User_roles (id_user, id_rol) VALUES (${id_user}, 2)
        `;
      }

      const solicitudData = await sql.query`
        SELECT universidad, profesion, certificacion, entidad, anio
        FROM Solicitud_tutor1 WHERE id_solicitud = ${id_solicitud}
      `;

      if (solicitudData.recordset.length > 0) {
        const { profesion, anio } = solicitudData.recordset[0];

        await sql.query`
          INSERT INTO Datos_Academicos (
            Profesion,
            FeInProf,
            FeFinProf,
            FeTit,
            id_grad,
            id_IF
          )
          VALUES (
            ${profesion},
            ${anio ? new Date(anio, 0, 1) : null},
            ${anio ? new Date(anio, 11, 31) : null},
            ${anio ? new Date(anio, 6, 1) : null},
            1,
            3
          )
        `;
      }

    } else {
      // Rechazar: rol estudiante
      if (roleResult.recordset.length > 0) {
        await sql.query`
          UPDATE User_roles SET id_rol = 1 WHERE id_user = ${id_user}
        `;
      } else {
        await sql.query`
          INSERT INTO User_roles (id_user, id_rol) VALUES (${id_user}, 1)
        `;
      }
    }

    return NextResponse.json({
      message: `Solicitud ${nuevoEstado.toLowerCase()} exitosamente`
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Error al actualizar solicitud:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
