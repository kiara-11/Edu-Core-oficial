import React from "react";
import Image from "next/image";
import "./TarjResena.css";

const TarjResena = () => {
  return (
    <div className="ContTarjResena">
      <Image
        className="ImaTutRes"
        src="/zorraRandom.png"
        width={500}
        height={500}
        alt={"Logo Hotel Pairumani"}
      />
      <div className="resena">
        <div className="resenareview">
          <Image
            className="StarzszRes"
            src="/star.png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
          <Image
            className="StarzszRes"
            src="/star.png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
          <Image
            className="StarzszRes"
            src="/star.png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
          <Image
            className="StarzszRes"
            src="/star.png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
          <Image
            className="StarzszRes"
            src="/star.png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
        </div>
        <p className="NomResena">Marycruz Ivonne</p>
        <p className="TxtResena">Muy recomendable!</p>
      </div>
    </div>
  );
};

export default TarjResena;
