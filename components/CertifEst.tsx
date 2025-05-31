import React from 'react'
import "./Certificacion.css"
import Link from 'next/link'
const CertifEst = () => {
    return (
        <div className='cerestdetail'>
            <p className='cerest'>Alejandra Lopezd</p>
            <p className='cercur'>Matemáticas Básicas</p>
            <p className='cerfech'>Matemática</p>
            <p className='cerestd'>Completado</p>
            <div className='contBotCer'>
                <Link href="/miscursos" className="botCertf">
                    <p className='certificar'>Certificar</p>
                </Link>
            </div>
        </div>
    )
}

export default CertifEst