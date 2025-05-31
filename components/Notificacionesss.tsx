import React from 'react'
import CardCheckNoti from './CardCheckNoti'
import CardCancelNoti from './CardCancelNoti'
import CardTimeNoti from './CardTimeNoti'
import CardTrophyNoti from './CardTrophyNoti'
import "./CardNoti.css"

const Notificacionesss = () => {
    return (
        <div className='containernotif'>
            <p className='notititl'>Notificaciones</p>
            <div className='notifcards'>
                <CardCheckNoti />
                <CardCancelNoti />
                <CardTimeNoti />
                <CardTrophyNoti />
            </div>
        </div>
    )
}

export default Notificacionesss