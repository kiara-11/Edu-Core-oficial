'use client'; // This is a client component

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Used for client-side navigation
import './CardNoti.css'; // Import your shared CSS file

// Define the props interface for clarity and type-checking
interface CardProps {
  titulo: string;
  detalle: string;
  botonTexto: string;
  botonLink: string; // URL for the button
}

const CardCheckNoti: React.FC<CardProps> = ({ titulo, detalle, botonTexto, botonLink }) => {
  return (
    <div className='cardcontent'>
      <div className='imagecanoti'>
        {/*
          Make sure your 'check.png' image is in the 'public' directory of your Next.js project.
          Example: public/check.png
        */}
        <Image
          className="imgnotif"
          src="/check.png" // Path to your check icon
          width={46} // Specify width for optimization
          height={46} // Specify height for optimization
          alt="Solicitud Aprobada" // Alt text for accessibility
        />
      </div>
      <div className='infocanoti'>
        <p className='titnoti'>{titulo}</p>
        <p className='detanoti'>{detalle}</p>
      </div>
      <div className='xtracanoti'>
        {/* Next.js Link component for smooth client-side routing */}
        <Link href={botonLink} className="buttnnoti">
          <p className="txtbtnnoti">{botonTexto}</p>
        </Link>
      </div>
    </div>
  );
};

export default CardCheckNoti;