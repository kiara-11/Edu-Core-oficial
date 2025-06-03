// TarjNuevTut.tsx
import React from 'react';
import Image from 'next/image';
import './TarjTutComt.css';

const TarjNuevTut = ({ curso }: { curso: any }) => {
    return (
        <div className="Tarjtutnew">
            <Image
                className="newtutim"
                src="/zrimage.png"
                width={500}
                height={500}
                alt="Logo Hotel Pairumani"
            />
            <div className="nwtutinf">
                <p className="nwtutname">{curso.nom_curso}</p>
                <p className="nwtutarea">{curso.discripcion}</p>
                <div className='newtutbutcont'>
                </div>
            </div>
        </div>
    );
};

export default TarjNuevTut;
