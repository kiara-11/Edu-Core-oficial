import React from "react";
import Image from "next/image";
import "./TarjEstadoCurso.css";
import "./CardNoti.css"
import Link from "next/link";


const TarjEstadoCurso = () => {
  return (
    <div >
      <Link href="/ComentariosVal" className="contenidotarjetaestado">
        <Image
          className="ImaTutEstado"
          src="/zrimage.png"
          width={500}
          height={500}
          alt={"Logo Hotel Pairumani"}
        />
        <div className="DetalleClase">
          <p className="NomTutEstado">Insert Teacher’s name here</p>
          <p className="ClasTutEstado">Insert Class name here</p>
          <p className='datenoti'>20:00-22:00</p>
          <p className='datenoti'>Virtual</p>
        </div>
      </Link>
    </div>
  );
};

export default TarjEstadoCurso;
