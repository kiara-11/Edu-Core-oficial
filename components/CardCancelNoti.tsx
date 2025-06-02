import React from 'react';
import "./CardNoti.css";
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  titulo: string;
  detalle: string;
  fecha?: string;
  estadoTexto?: string;
  botonTexto?: string;
  botonLink?: string;
}

const CardCancelNoti: React.FC<CardProps> = ({
  titulo,
  detalle,
  fecha,
  estadoTexto,
  botonTexto,
  botonLink
}) => {
  return (
    <div className='cardcontent'>
      <div className='imagecanoti'>
        <Image
          className="imgnotif"
          src="/cancel.png"
          width={46}
          height={46}
          alt={"Cancelado"}
        />
      </div>
      <div className='infocanoti'>
        <p className='titnoti'>{titulo}</p>
        <p className='detanoti'>{detalle}</p>
        <div className='infxtra'>
          {fecha && <p className='datenoti'>{fecha}</p>}
          <div className='contestadnoti'>
            <p className='estnotif'>{estadoTexto || 'Cancelado'}</p>
          </div>
        </div>
      </div>
      {botonTexto && botonLink && (
        <div className='xtracanoti'>
          <Link href={botonLink} className="buttnnoti">
            <p className="txtbtnnoti">{botonTexto}</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CardCancelNoti;
