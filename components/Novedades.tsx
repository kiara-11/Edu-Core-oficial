import React from 'react'
import "./Novedades.css";
import TarjBusq from './TarjBusq';
import TarjNuevTut from './TarjNuevTut';
import Link from "next/link";

const Novedades = () => {
    return (
        <div className='novdads'>
            <p className='titnovd'>Novedades</p>
            <p className='subtitnovd'>Nuevos cursos</p>
            <div className='CurNuev'>
                <TarjBusq />
                <TarjBusq />
                <TarjBusq />
                <a
                    href="/explorar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="VMasNuCu"
                >
                    VER MÁS
                </a>
            </div>
            <p className='subtitnovd'>Nuevos Tutores</p>
            <div className='TutNuev'>
                <TarjNuevTut />
                <TarjNuevTut />
                <TarjNuevTut />
                <TarjNuevTut />
                <TarjNuevTut />
            </div>
        </div>
    )
}

export default Novedades