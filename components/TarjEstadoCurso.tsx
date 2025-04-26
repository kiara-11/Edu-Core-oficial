import React from "react";
import Image from "next/image";
import "./TarjEstadoCurso.css";

const TarjEstadoCurso = () => {
  return (
    <div className="contenidotarjetaestado">
      <Image
        className="ImaTutEstado"
        src="/zorraRandom.png"
        width={500}
        height={500}
        alt={"Logo Hotel Pairumani"}
      />
      <div className="DetalleClase">
        <p className="NomTutEstado">Insert Teacher’s name here</p>
        <p className="ClasTutEstado">Insert Class name here</p>
        <div className="contenedorbotonestado">
            <div className="botonestado">
                <p className="txtestado">Ver detalles</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TarjEstadoCurso;
