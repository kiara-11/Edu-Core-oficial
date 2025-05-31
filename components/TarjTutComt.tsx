import React from "react";
import Image from "next/image";
import "./TarjTutComt.css";
import Link from "next/link";

const TarjTutComt = () => {
  return (
    <div>
      <div className="InfoTutComen">
        <div className="ImgTutComt">
          <Image
            className="ImaTutComt"
            src="/zorraRandom.png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
        </div>
        <div className="TxtTutComt">
          <p className="TxtClasComt">Insert Class name here</p>
          <p className="TxtNomTutComt">Insert Teacher’s name here</p>
        </div>
        <div className="ContRevwComt">
          <div className="ResStarComt">
            <div className="Cantstarz">
              <Image
                className="Starzzzz"
                src="/star.png"
                width={500}
                height={500}
                alt={"Logo Hotel Pairumani"}
              />
              <Image
                className="Starzzzz"
                src="/star.png"
                width={500}
                height={500}
                alt={"Logo Hotel Pairumani"}
              />
              <Image
                className="Starzzzz"
                src="/star.png"
                width={500}
                height={500}
                alt={"Logo Hotel Pairumani"}
              />
              <Image
                className="Starzzzz"
                src="/star.png"
                width={500}
                height={500}
                alt={"Logo Hotel Pairumani"}
              />
              <Image
                className="Starzzzz"
                src="/star.png"
                width={500}
                height={500}
                alt={"Logo Hotel Pairumani"}
              />
            </div>
            <p className="cantStarComt">5/5</p>
            <p className="cantResComt">639</p>
          </div>
          <div className="cantHorComt">
            <div className="imagenComt">
              <Image
                className="RelojComt"
                src="/time-icon-2048x2048-oly5dfp7.png"
                width={500}
                height={500}
                alt={"Logo Hotel Pairumani"}
              />
            </div>
            <p className="horatrabajComt">5.935 horas enseñando</p>
          </div>
          <div className="contButComt">
            <Link href="/miscursos" className="ButComt">
              <p className="TxtButComt">CONTACTAR</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarjTutComt;
