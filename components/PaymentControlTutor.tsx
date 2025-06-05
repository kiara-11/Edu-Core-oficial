'use client';

import React, { useState, useEffect } from 'react';
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

const PaymentControl: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selected, setSelected] = useState<Payment | null>(null);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch('/api/pagos');
        if (!res.ok) throw new Error('Error al obtener los pagos');
        const data: Payment[] = await res.json();
        setPayments(data);
      } catch (error) {
        console.error('Error al cargar los pagos:', error);
      }
    }

    fetchPayments();
  }, []);

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
              <tr key={p.id}>
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
