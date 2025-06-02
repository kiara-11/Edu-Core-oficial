import React from 'react'
import Image from "next/image";
import "./TarjBusq.css";
import Link from "next/link";

const Cursopublicadotut = () => {
    return (
        <div className="ContTarjBus">
            <div className="ImaTarjBusq">
                <Image
                    className="ImaTutTB"
                    src="/zrimage.png"
                    width={500}
                    height={500}
                    alt={"Logo Hotel Pairumani"}
                />
            </div>
            <div className="DataTeachTB">
                <p className="NombreTeaTB">Insert Teacher’s name here</p>
                <p className="NomClassTB">Insert Class name here</p>
                <p className="DescTB">Insert Description here</p>
            </div>

            <div className="detailClassTut">
                <div className='espclatut'>
                    <div className='campodetclatut'>
                        <p className='txtcamp'>Precio:</p>
                        <p className='txtcamp'>Horario:</p>
                        <p className='txtcamp'>Modalidad:</p>
                        <p className='txtcamp'>Nivel:</p>
                        <p className='txtcamp'>Lecciones:</p>
                        <p className='txtcamp'>Días de clase:</p>
                    </div>
                    <div className='cantdetclatut'>
                        <p className='txtcamp'>Bs. 60</p>
                        <p className='txtcamp'>16:00-18:00</p>
                        <p className='txtcamp'>Virtual</p>
                        <p className='txtcamp'>Principiante</p>
                        <p className='txtcamp'>10</p>
                        <p className='txtcamp'>Lunes a Viernes</p>
                    </div>
                </div>

                <div className='contbutediClasTut'>

                    <Link href="/editarcurso" className="buteditut">
                        <p className="txtediclatut">EDITAR</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Cursopublicadotut