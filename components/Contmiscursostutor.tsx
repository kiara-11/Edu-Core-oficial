import React from 'react'
import "./Novedades.css";
import Cursopublicadotut from './Cursopublicadotut';

const Contmiscursostutor = () => {
    return (
        <div className='novdads'>
            <p className='titnovd'>Mis cursos</p>
            <p className='subtitnovd'>Cursos publicados</p>
            <div className='CurNuev'>
                <Cursopublicadotut />
            </div>
        </div>
    )
}

export default Contmiscursostutor