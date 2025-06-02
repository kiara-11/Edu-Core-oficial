import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './CardNoti.css';

interface CardProps {
  titulo: string;
  detalle: string;
  botonTexto: string;
  botonLink: string;
}

const CardCheckNoti: React.FC<CardProps> = ({ titulo, detalle, botonTexto, botonLink }) => {
  return (
    <div className='cardcontent'>
      <div className='imagecanoti'>
        <Image
          className="imgnotif"
          src="/check.png"
          width={46}
          height={46}
          alt={"Aprobado"}
        />
      </div>
      <div className='infocanoti'>
        <p className='titnoti'>{titulo}</p>
        <p className='detanoti'>{detalle}</p>
      </div>
      <div className='xtracanoti'>
        <Link href={botonLink} className="buttnnoti">
          <p className="txtbtnnoti">{botonTexto}</p>
        </Link>
      </div>
    </div>
  );
};

export default CardCheckNoti;
