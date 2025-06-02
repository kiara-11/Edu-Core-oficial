import { connectToDb, sql } from '../../lib/db';
import { NextResponse } from 'next/server';
export async function GET() {
  try {
    await connectToDb();

    // Consulta para traer usuarios con datos personales y email
    // Puedes hacer JOIN si quieres más datos
    const result = await sql.query(`
      SELECT dp.ApePat, dp.ApeMat, dp.Nombre, dp.FeNac, dp.email, dp.telefono, dp.id_dp,
             u.user_name, u.id_estado, u.Id_user
      FROM Datos_personales dp
      INNER JOIN Usuario u ON dp.id_dp = u.id_dp
    `);

    const usuarios = result.recordset.map(u => ({
      id: u.Id_user,
      name: `${u.Nombre} ${u.ApePat} ${u.ApeMat}`,
      email: u.email,
      phone: u.telefono,
      registrationDate: u.FeNac ? new Date(u.FeNac).toLocaleDateString() : '',
      status: u.id_estado === 1 ? 'Activo' : 'Inactivo',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(u.Nombre)}`,
      // role no lo traemos, manejarás localmente
    }));

    return NextResponse.json(usuarios, { status: 200 });

  } catch (error) {
    console.error('Error fetching usuarios:', error);
    return NextResponse.json({ message: 'Error al obtener usuarios' }, { status: 500 });
  }
}