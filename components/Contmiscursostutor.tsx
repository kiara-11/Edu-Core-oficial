'use client';
import React, { useEffect, useState } from 'react';
import './Novedades.css';
import Cursopublicadotut from './Cursopublicadotut';

const Contmiscursostutor = () => {
    const [cursos, setCursos] = useState([]);

    useEffect(() => {
        const fetchCursos = async () => {
            const id_user = localStorage.getItem('id_user');

            if (!id_user) {
                console.error("No se encontró id_user");
                return;
            }

            const res = await fetch(`/api/tutores?id_user=${id_user}`);
            const data = await res.json();
            setCursos(data);
        };

        fetchCursos();
    }, []);


    return (
        <div className='novdads'>
            <p className='titnovd'>Mis cursos</p>
            <p className='subtitnovd'>Cursos publicados</p>
            <div className='CurNuev'>
                {cursos.map((curso, index) => (
                    <Cursopublicadotut key={index} curso={curso} />
                ))}
            </div>
        </div>
    );
};

export default Contmiscursostutor;
