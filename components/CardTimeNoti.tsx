import React from 'react'
import "./CardNoti.css"
import Image from 'next/image'

const CardTimeNoti = () => {
  return (
    <div className='cardcontent'>
      <div className='imagecanoti'>
        <Image
          className="imgnotif"
          src="/time.png"
          width={500}
          height={500}
          alt={"Logo Hotel Pairumani"}
        />
      </div>
      <div className='infocanoti'>
        <p className='titnoti'>Reserva pendiente: Matemáticas avanzadas</p>
        <p className='detanoti'>Tu solicitud esta pendiente</p>
        <div className='infxtra'>
          <p className='datenoti'>30 de Mayo, 2025-16:30</p>
          <div className='contestadnoti'>
            <p className='estnotif'>Pendiente</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CardTimeNoti