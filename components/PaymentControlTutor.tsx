'use client';


import React, { useState } from 'react';
import './PaymentControl.css';

interface Payment {
  id: number;
  name: string;
  email: string;
  amount: string;
  date: string;
  method: string;
  status: 'Pendiente' | 'Confirmado' | 'En Revisión';
  transactions: string[];
  avatar: string;
}

const payments: Payment[] = [
  {
    id: 1,
    name: 'Alejandra Lopez',
    email: 'alejandralopez@gmail.com',
    amount: '100 Bs',
    date: '2025-05-26',
    method: 'QR',
    status: 'Pendiente',
    transactions: [
      '2025-05-26 - Pago confirmado correctamente',
      '2025-05-26 - Pago en Revisión',
    ],
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
  {
    id: 2,
    name: 'Alejandra Lopez',
    email: 'alejandralopez@gmail.com',
    amount: '100 Bs',
    date: '2025-05-26',
    method: 'QR',
    status: 'Pendiente',
    transactions: [],
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
  {
    id: 3,
    name: 'Alejandra Lopez',
    email: 'alejandralopez@gmail.com',
    amount: '100 Bs',
    date: '2025-05-26',
    method: 'QR',
    status: 'Pendiente',
    transactions: [],
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
];

const PaymentControl: React.FC = () => {
  const [selected, setSelected] = useState<Payment | null>(null);

  return (
    <div className="container">
      <div className="table-section">
        <h2>Control de Pagos Tutor</h2>

        <div className="filters">
        <div className="filter-group">
            <label>Estado de Pago</label>
            <input placeholder="Todo" />
        </div>
        <div className="filter-group">
            <label>Método de Pago</label>
            <input placeholder="Todo" />
        </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Estudiante</th>
              <th>Monto</th>
              <th>Fecha de Pago</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Acción</th>
            </tr>
          </thead>
            <tbody>
            {payments.map((p) => (
                <tr
                key={p.id}
                className={p.id === 2 ? 'highlight-row' : ''}
                >
                <td>
                  <img src={p.avatar} alt="avatar" className="avatar" />
                  {p.name}
                </td>
                <td>{p.amount}</td>
                <td>{p.date}</td>
                <td>{p.method}</td>
                <td className="status">{p.status}</td>
                <td>
                  <button className="detail-btn" onClick={() => setSelected(p)}>
                    Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="detail-section">
          <img src={selected.avatar} alt="avatar" className="large-avatar" />
          <h3>{selected.name}</h3>
          <p>{selected.email}</p>
          <div className="info">
            <p><strong>Monto de pago:</strong> {selected.amount}</p>
            <p><strong>Fecha de pago:</strong> {selected.date}</p>
            <p><strong>Método:</strong> {selected.method}</p>
            <p><strong>Estado:</strong> {selected.status}</p>
            <p><strong>Historial de Transacciones:</strong></p>
            <ul>
              {selected.transactions.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="actions">
            <button className="confirm">CONFIRMAR</button>
            <button className="cancel" onClick={() => setSelected(null)}>CANCELAR</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentControl;
