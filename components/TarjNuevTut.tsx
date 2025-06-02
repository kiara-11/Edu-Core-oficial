import React from 'react'
import Image from "next/image";
import Link from "next/link";
import "./TarjTutComt.css";

const TarjNuevTut = () => {
    return (
        <div className="Tarjtutnew">
            <Image
                className="newtutim"
                src="/zrimage.png"
                width={500}
                height={500}
                alt={"Logo Hotel Pairumani"}
            />
            <div className="nwtutinf">
                <p className="nwtutname">Insert Teacher’s name here</p>
                <p className="nwtutarea">Insert area</p>
                <div className='newtutbutcont'>
                    <div className="contButComt">
                        <Link href="/miscursos" className="ButComt">
                            <p className="TxtButComt">VER DETALLES</p>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TarjNuevTut