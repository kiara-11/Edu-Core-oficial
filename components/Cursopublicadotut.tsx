import React from 'react';
import Image from 'next/image';
import './TarjBusq.css';
import Link from 'next/link';


interface TarjBusqProps {
    curso: {
        Nombre: string;
        ApePat: string;
        ApeMat: string;
        nom_curso: string;
        discripcion: string;
        precio: string;
        cant_est_min: string;
        horario: string;
        modalidad: string;
        nivel: string;
    };
}

const Cursopublicadotut: React.FC<TarjBusqProps> = ({ curso }) => {
    const nombreTutor = `${curso.Nombre} ${curso.ApePat} ${curso.ApeMat}`;
    const nombreClase = curso.nom_curso;
    const descripcion = curso.discripcion;

    const precio = curso.precio;
    const horario = curso.horario
    const modalidad = curso.modalidad
    const nivelcur = curso.nivel
    const estmin = curso.cant_est_min

    return (
        <div className="ContTarjBus">
            <div className="ImaTarjBusq">
                <Image
                    className="ImaTutTB"
                    src="/zrimage.png"
                    width={500}
                    height={500}
                    alt="Foto del tutor"
                />
            </div>

            <div className="DataTeachTB">
                <p className="NombreTeaTB">{nombreTutor}</p>
                <p className="NomClassTB">{nombreClase}</p>
                <p className="DescTB">{descripcion}</p>
            </div>

            <div className="detailClassTut">
                <div className="espclatut">
                    <div className="campodetclatut">
                        <p className="txtcamp">Precio:</p>
                        <p className="txtcamp">Horario:</p>
                        <p className="txtcamp">Modalidad:</p>
                        <p className="txtcamp">Nivel:</p>
                        <p className="txtcamp">Cupos disponibles:</p>
                    </div>
                    <div className="cantdetclatut">
                        <p className="txtcamp">Bs. {precio}</p>
                        <p className="txtcamp">{horario}</p>
                        <p className="txtcamp">{modalidad}</p>
                        <p className="txtcamp">{nivelcur}</p>
                        <p className="txtcamp">{estmin}</p>
                    </div>
                </div>

                <div className="contbutediClasTut">
                    <Link href="/editarcurso" className="buteditut">
                        <p className="txtediclatut">EDITAR</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Cursopublicadotut;
