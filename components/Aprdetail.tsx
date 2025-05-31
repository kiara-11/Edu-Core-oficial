import React from 'react'
import "./Certificacion.css"
import Link from 'next/link'
const Aprdetail = () => {
    return (
        <div className='cerestdetail'>
            <p className='cerest'>Carlos Llanos</p>
            <p className='cercur'>Matemáticas Básicas</p>
            <p className='cerfech'>Matemática</p>
            <div className='optaprtut'>
                <Link href="/miscursos" className="aprcurtut">
                    <p className='aprtuttxt'>Permitir</p>
                </Link>
                <Link href="/miscursos" className="otroptut">
                    <p className='otoptuttx'>Rechazar</p>
                </Link>
                <Link href="/miscursos" className="otroptut">
                    <p className='otoptuttx'>Detalles</p>
                </Link>
            </div>
        </div>
    )
}

export default Aprdetail