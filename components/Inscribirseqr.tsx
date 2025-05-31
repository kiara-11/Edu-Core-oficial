'use client';

import React from 'react';
import './Inscribirseqr.css';

const InscribirseQR = () => {
  return (
    <div className="inscripcion-container">
      <h2>Inscribirse a un Curso</h2>

      <div className="tarjeta-inscripcion">
        <div className="info-curso">
          <img
            src="/cincoestudiantes.png"
            alt="Curso"
            className="dimimgest"
          />
          <div className="datos-curso">
            <h3>Curso De Python Desde Cero</h3>
            <div className="detalle-curso">
              <span>Bs. 60</span>
              <span>● 16:00 - 18:00</span>
              <span>● 25-10-2025</span>
              <span>📡 Virtual</span>
            </div>
          </div>
        </div>

        <div className="qr-section">
          <h4 className='centro'>Pago por Código QR</h4>
          <div className="qr-box">
            <img
              src="/codigoqr.png"
              alt="Código QR"
              className="img-curso"
            />
            <p className="monto">Monto a pagar: <strong>60 Bs</strong></p>
            <p className="instruccion">
              Escanea el código QR con tu app de banca móvil preferida para realizar el pago
            </p>
          </div>
          <div className="botones">
            <button className="cancelar">Cancelar</button>
            <button className="confirmar">He completado el pago</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscribirseQR;
