"use client";

import React, { useEffect, useState } from 'react';
import './Novedades.css';
import TarjBusq from './TarjBusq';
import TarjNuevTut from './TarjNuevTut';
import Link from 'next/link';

const Novedades = () => {
    const [tutores, setTutores] = useState<any[]>([]); // aseguramos que sea un array

    useEffect(() => {
        const fetchTutores = async () => {
            try {
                const res = await fetch('/api/tutores');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();
                console.log("Cursos recibidos:", data);

                if (Array.isArray(data)) {
                    setTutores(data);
                } else {
                    console.warn("La respuesta no es un arreglo:", data);
                    setTutores([]);
                }
            } catch (error) {
                console.error('Error al obtener cursos:', error);
                setTutores([]);
            }
        };

        fetchTutores();
    }, []);

    return (
        <div className='novdads'>
            <p className='titnovd'>Novedades</p>

            <p className='subtitnovd'>Nuevos cursos</p>
            <div className='CurNuev'>
                {tutores.slice(0, 3).map((tutor, index) => (
                    <TarjBusq key={index} tutor={tutor} />
                ))}
                <a
                    href="/explorarcurso"
                    className="VMasNuCu"
                >
                    VER MÁS
                </a>

            </div>

            <p className='subtitnovd'>Nuevos Tutores</p>
            <div className='TutNuev'>
                {tutores.slice(0, 4).map((tutor, index) => (
                    <TarjNuevTut key={index} tutor={tutor} />
                ))}
            </div>
        </div>
    );
};

export default Novedades;
