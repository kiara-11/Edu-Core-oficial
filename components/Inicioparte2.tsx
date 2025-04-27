import React from "react";
import Image from "next/image";
import "./Inicioparte2.css";
const Inicioparte2 = () => {
  return (
    <div className="cont2">
      <div className="contimap2">
        <Image
          className="imagp2"
          src="/pana 1.png"
          width={500}
          height={500}
          alt={"Logo Hotel Pairumani"}
        />
      </div>

      <div className="conttext">
        <p className="titp2">
          <span className="titnarncini">Súmate como</span>
          <span className="titverdecini"> Tutor </span>
          <span className="titnarncini">y haz crecer tu impacto educativo</span>
        </p>
        <div className="contima">
          <Image
            className="imag"
            src="/Group 237641 (1).png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
          <p className="desc">
            Muestra tu perfil y tus clases a cientos de estudiantes interesados.
          </p>
        </div>
        <div className="contima">
          <Image
            className="imag"
            src="/Group 237641.png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
          <p className="desc">Tú decides cuándo y cómo dar tus clases.</p>
        </div>
        <div className="contima">
          <Image
            className="imag"
            src="/Group 237642.png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
          <p className="desc">
            Olvídate de Facebook y panfletos, tus cursos se promocionan solos.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Inicioparte2;
