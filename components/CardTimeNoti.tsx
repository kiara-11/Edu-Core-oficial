'use client'; // This is a client component

import React from 'react';
import Image from 'next/image';
import './CardNoti.css'; // Import your shared CSS file

// Define the props interface
interface CardProps {
  titulo: string;
  detalle: string;
  botonTexto: string;
  onBotonClick?: () => void; // Optional function to call when the button is clicked
}

const CardTimeNoti: React.FC<CardProps> = ({ titulo, detalle, botonTexto, onBotonClick }) => {
  return (
    <div className='cardcontent'>
      <div className='imagecanoti'>
        {/*
          Make sure your 'time.png' image is in the 'public' directory.
          Example: public/time.png
        */}
        <Image
          className="imgnotif"
          src="/time.png" // Path to your time/pending icon
          width={46}
          height={46}
          alt="Solicitud Pendiente"
        />
      </div>
      <div className='infocanoti'>
        <p className='titnoti'>{titulo}</p>
        <p className='detanoti'>{detalle}</p>
        <div className='infxtra'>
          {/* Static text indicating pending status */}
          <p className='datenoti'>Por favor espera la confirmación</p>
          <div className='contestadnoti'>
            <p className='estnotif'>Pendiente</p>
          </div>
        </div>
      </div>
      <div className='xtracanoti'>
        {/* Button that triggers the optional onBotonClick handler */}
        <button onClick={onBotonClick} className="buttnnoti">
          {botonTexto}
        </button>
      </div>
    </div>
  );
};

export default CardTimeNoti;