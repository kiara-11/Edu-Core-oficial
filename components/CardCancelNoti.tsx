'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './CardNoti.css';

// ✅ MODIFICADO: Agregar motivoRechazo a la interface
interface CardProps {
  titulo: string;
  detalle: string;
  fecha?: string;
  estadoTexto?: string;
  botonTexto?: string;
  botonLink?: string;
  motivoRechazo?: string; // ✅ NUEVO: Motivo de rechazo
}

const CardCancelNoti: React.FC<CardProps> = ({
  titulo,
  detalle,
  fecha,
  estadoTexto,
  botonTexto,
  botonLink,
  motivoRechazo // ✅ NUEVO: Recibir motivo de rechazo
}) => {
  return (
    <div className='cardcontent'>
      <div className='imagecanoti'>
        <Image
          className="imgnotif"
          src="/cancel.png"
          width={46}
          height={46}
          alt="Solicitud Cancelada/Rechazada"
        />
      </div>
      <div className='infocanoti'>
        <p className='titnoti'>{titulo}</p>
        <p className='detanoti'>{detalle}</p>
        
        {/* ✅ NUEVO: Mostrar motivo de rechazo si existe */}
        {motivoRechazo && (
          <div className='motivorechazo'>
            <p className='motivotitulo'>Motivo del rechazo:</p>
            <p className='motivodetalle'>{motivoRechazo}</p>
          </div>
        )}
        
        <div className='infxtra'>
          {fecha && <p className='datenoti'>{fecha}</p>}
          <div className='contestadnoti'>
            <p className='estnotif'>{estadoTexto || 'Rechazado'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCancelNoti;