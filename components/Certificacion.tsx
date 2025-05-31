import React from 'react'
import "./Certificacion.css"
import CertifEst from './CertifEst'

const Certificacion = () => {
    return (
        <div className='containercertif'>
            <p className='certtitl'>Aprobación de certificados</p>
            <div className='certifCuad'>
                <div className='certCamp'>
                    <p className='cerest'>Estudiante</p>
                    <p className='cercur'>Curso</p>
                    <p className='cerfech'>Área</p>
                    <p className='cerestd'>Estado</p>
                    <p className='ceracti'>Acción</p>
                </div>
                <CertifEst />
                <CertifEst />
                <CertifEst />
            </div>
        </div>
    )
}

export default Certificacion