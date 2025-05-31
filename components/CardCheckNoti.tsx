import React from 'react'
import "./CardNoti.css"
import Image from 'next/image'
import Link from "next/link";

const CardCheckNoti = () => {
    return (
        <div className='cardcontent'>
            <div className='imagecanoti'>
                <Image
                    className="imgnotif"
                    src="/check.png"
                    width={500}
                    height={500}
                    alt={"Logo Hotel Pairumani"}
                />
            </div>
            <div className='infocanoti'>
                <p className='titnoti'>Clase confirmada: Física Cuántica</p>
                <p className='detanoti'>Tu clase ha sido confirmada</p>
                <div className='infxtra'>
                    <p className='datenoti'>30 de Mayo, 2025-16:30</p>
                    <div className='contestadnoti'>
                        <p className='estnotif'>Completado</p>
                    </div>
                </div>
            </div>
            <div className='xtracanoti'>
                <Link href="/miscursos" className="buttnnoti">
                    <p className="txtbtnnoti">IR A MIS CURSOS</p>
                </Link>
            </div>
        </div>
    )
}

export default CardCheckNoti