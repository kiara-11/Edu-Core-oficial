import React from 'react';
import Image from 'next/image';
import './TarjTutComt.css';

const TarjNuevTut = ({ tutor }: { tutor: any }) => {
    const nombreCompleto = `${tutor.Nombre} ${tutor.ApePat} `;
    return (
        <div className="Tarjtutnew">
            <Image
                className="newtutim"
                src="/zrimage.png"
                width={500}
                height={500}
                alt="Foto del tutor"
            />
            <div className="nwtutinf">
                <p className="nwtutname">{nombreCompleto}</p>
                <p className="nwtutarea">{tutor.nom_materia}</p>
            </div>
        </div>
    );
};
export default TarjNuevTut;
