import React from "react";
import "./EncabInLog.css";
import Image from 'next/image'

const EncabInLog = () => {
    return (
        <div className='inlog1'>
            <div className="inlog2">
                <div className="inlog3">
                    <p className="inlog4">Nunca dejes de aprender</p>
                </div>
                <p className="inlog5">
                    <span className="inlog6">Encuentra el curso ideal.</span>
                    <br />
                    <span className="inlog7">
                        Reserva fácil, segura y sin complicaciones.
                    </span>
                </p>
                <div className="inlog8">
                    <p className="inlog9">Cursos en diversas áreas y niveles</p>
                </div>
            </div>
            <div className="inlog10">
                <Image
                    className="zorra"
                    src="/NIÑA PENDEJA.png"
                    width={500}
                    height={500}
                    alt={"Logo Hotel Pairumani"}
                />
            </div>
        </div>
    )
}

export default EncabInLog