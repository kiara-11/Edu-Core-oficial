import React from "react";
import Image from "next/image";
import "./TarjBusq.css";
import Link from "next/link";





interface TarjBusqProps {
  tutor: {
    Nombre: string;
    ApePat: string;
    ApeMat: string;
    nom_curso: string;
    discripcion: string;
  };
}

const TarjBusq: React.FC<TarjBusqProps> = ({ tutor }) => {
  const nombreTutor = `${tutor.Nombre} ${tutor.ApePat} ${tutor.ApeMat}`;
  const nombreClase = tutor.nom_curso;
  const descripcion = tutor.discripcion;

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
        <p className="NombreTeaTB">{nombreTutor}</p>
        <p className="NomClassTB">{nombreClase}</p>
        <p className="DescTB">{descripcion}</p>
      </div>
      <div className="RatinTeachTB">
        <div className="califTeaTB">
          <div className="stars">
            <Image
              className="Starssss"
              src="/star.png"
              width={500}
              height={500}
              alt={"Logo Hotel Pairumani"}
            />
            <Image
              className="Starssss"
              src="/star.png"
              width={500}
              height={500}
              alt={"Logo Hotel Pairumani"}
            />
            <Image
              className="Starssss"
              src="/star.png"
              width={500}
              height={500}
              alt={"Logo Hotel Pairumani"}
            />
            <Image
              className="Starssss"
              src="/star.png"
              width={500}
              height={500}
              alt={"Logo Hotel Pairumani"}
            />
            <Image
              className="Starssss"
              src="/star.png"
              width={500}
              height={500}
              alt={"Logo Hotel Pairumani"}
            />
          </div>
          <p className="ContStarTB">5/5</p>
          <p className="CantResTB">639</p>
        </div>
        <div className="tiempoTB">
          <div className="imagenTB">
            <Image
              className="RelojTB"
              src="/time-icon-2048x2048-oly5dfp7.png"
              width={500}
              height={500}
              alt={"Logo Hotel Pairumani"}
            />
          </div>
          <p className="tiempoChambTB">5.935 horas enseñando</p>
        </div>
        <div className="ContBotTB">
          <Link href="/ComentariosVal" className="botonTB">
            <p className="txtTB">VER PERFIL</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TarjBusq;
