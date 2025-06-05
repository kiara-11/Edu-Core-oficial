import { NextResponse } from 'next/server';

export async function GET() {
  const pagos = [
    {
      id: 1,
      name: 'Carlos Pérez',
      email: 'carlos@example.com',
      amount: '$150',
      date: '2025-06-01',
      method: 'Transferencia',
      status: 'Pendiente',
      transactions: ['Transacción #1', 'Transacción #2'],
      avatar: 'https://i.pravatar.cc/100?img=1',
    },
    {
      id: 2,
      name: 'María Gómez',
      email: 'maria@example.com',
      amount: '$200',
      date: '2025-06-03',
      method: 'PayPal',
      status: 'Confirmado',
      transactions: ['Pago completo recibido'],
      avatar: 'https://i.pravatar.cc/100?img=2',
    },
    {
      id: 3,
      name: 'Juan Ruiz',
      email: 'juan@example.com',
      amount: '$100',
      date: '2025-06-02',
      method: 'Depósito',
      status: 'En Revisión',
      transactions: ['Depósito pendiente de verificación'],
      avatar: 'https://i.pravatar.cc/100?img=3',
    },
  ];

  return NextResponse.json(pagos);
}
