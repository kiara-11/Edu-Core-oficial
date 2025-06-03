"use client";

import React, { useEffect, useState } from 'react';
import './Novedades.css';
import TarjBusq from './TarjBusq';
import TarjNuevTut from './TarjNuevTut';
import Link from 'next/link';

const Novedades = () => {
    const [cursos, setCursos] = useState<any[]>([]); // aseguramos que sea un array

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const res = await fetch('/api/curso');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json(); // data ya es un array
                console.log("Cursos recibidos:", data);

                if (Array.isArray(data)) {
                    setCursos(data);
                } else {
                    console.warn("La respuesta no es un arreglo:", data);
                    setCursos([]);
                }
            } catch (error) {
                console.error('Error al obtener cursos:', error);
                setCursos([]);
            }
        };

        fetchCursos();
    }, []);


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
                {cursos.slice(0, 4).map((curso, index) => (
                    <TarjNuevTut key={index} curso={curso} />
                ))}
            </div>

        </div>
    );
};

export default Novedades;
