import React from 'react'
import "./CardNoti.css"
import Image from 'next/image'

const CardCancelNoti = () => {
  return (
    <div className='cardcontent'>
      <div className='imagecanoti'>
        <Image
          className="imgnotif"
          src="/cancel.png"
          width={500}
          height={500}
          alt={"Logo Hotel Pairumani"}
        />
      </div>
      <div className='infocanoti'>
        <p className='titnoti'>Clase cancelada: Inglés avanzado</p>
        <p className='detanoti'>La clase ha sido cancelada por el tutor</p>
        <div className='infxtra'>
          <p className='datenoti'>30 de Mayo, 2025-16:30</p>
          <div className='contestadnoti'>
            <p className='estnotif'>Cancelado</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CardCancelNoti