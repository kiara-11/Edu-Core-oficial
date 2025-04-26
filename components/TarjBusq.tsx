import React from "react";
import Image from "next/image";
import "./TarjBusq.css";
import Link from "next/link";

const TarjBusq = () => {
  return (
    <div className="ContTarjBus">
      <div className="ImaTarjBusq">
        <Image
          className="ImaTutTB"
          src="/zorraRandom.png"
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
