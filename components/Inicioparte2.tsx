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

      <div className="conttextp2">
        <p className="benefp2">Capacitación</p>
        <p className="titp2">Capacitación y herramientas para tutores </p>
        <div className="contima">
          <Image
            className="imag"
            src="/Group 237641 (1).png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
          <p className="desc">
            Publica tus cursos fácilmente y gana visibilidad
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
          <p className="desc">Gestión de pagos automática y segura</p>
        </div>
        <div className="contima">
          <Image
            className="imag"
            src="/Group 237642.png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
          <p className="desc">Soporte y guía para mejorar tus clases</p>
        </div>
      </div>
    </div>
  );
};

export default Inicioparte2;
