import React from 'react'
import "./Certificacion.css"
import Aprdetail from './Aprdetail'

const AprobCurso = () => {
    return (
        <div className='containercertif'>
            <p className='certtitl'>Aprobación de cursos</p>
            <div className='certifCuad'>
                <div className='certCamp'>
                    <p className='cerest'>Tutor</p>
                    <p className='cercur'>Curso</p>
                    <p className='cerfech'>Área</p>
                    <p className='aprCurAcc'>Acciones</p>
                </div>
                <Aprdetail />
                <Aprdetail />
                <Aprdetail />
            </div>
        </div>
    )
}

export default AprobCurso