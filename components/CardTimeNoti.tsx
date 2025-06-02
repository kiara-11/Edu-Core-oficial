'use client';

import React from 'react';
import Image from 'next/image';
import './CardNoti.css';

interface CardProps {
  titulo: string;
  detalle: string;
  botonTexto: string;
  onBotonClick?: () => void;
}

const CardTimeNoti: React.FC<CardProps> = ({ titulo, detalle, botonTexto, onBotonClick }) => {
  return (
    <div className='cardcontent'>
      <div className='imagecanoti'>
        <Image
          className="imgnotif"
          src="/time.png"
          width={46}
          height={46}
          alt={"Reloj"}
        />
      </div>
      <div className='infocanoti'>
        <p className='titnoti'>{titulo}</p>
        <p className='detanoti'>{detalle}</p>
        <div className='infxtra'>
          <p className='datenoti'>Por favor espera la confirmación</p>
          <div className='contestadnoti'>
            <p className='estnotif'>Pendiente</p>
          </div>
        </div>
      </div>
      <div className='xtracanoti'>
        <button onClick={onBotonClick} className="buttnnoti">
          {botonTexto}
        </button>
      </div>
    </div>
  );
};

export default CardTimeNoti;
