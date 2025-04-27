import React from "react";
import Image from "next/image";
import "./Inicioparte4.css";
import Link from "next/link";
const Inicioparte4 = () => {
  return (
    <div className="cont4">
      <div className="txtcont4">
        <p className="txtgeneralcont4">
          <span className="titverdec4">¿Cómo deseas usar</span>
          <span className="titnarnc4"> EduCore</span>
          <span className="titverdec4">?</span>
        </p>
        <p className="txgenec4v2">
          <span className="txnormc4">
            EduCore conecta a estudiantes y tutores en un solo lugar.
          </span>
          <span className="txnegri4"> Reserva</span>
          <span className="txnormc4"> cursos o</span>
          <span className="txnegri4"> publica</span>
          <span className="txnormc4">
            {" "}
            los tuyos fácilmente, sin complicaciones.
          </span>
        </p>
      </div>

      <div className="opcionescont4">
        <div className="tarjtutc4">
          <p className="parac4">PARA TUTORES</p>
          <p className="desctarc4">
            Publica tus cursos y hazlos visibles al instante. Cobra de forma
            segura y gestiona tus clases fácilmente.
          </p>
          <Link href="/login" className="buttonc4">
            <p className="txbutnc4">Ingresar como Tutor</p>
          </Link>
        </div>

        <div className="tarjestc4">
          <p className="parac4">PARA ESTUDIANTES</p>
          <p className="desctarc4">
            Explora y reserva cursos personalizados. Aprende a tu ritmo, con
            total seguridad.
          </p>
          <Link href="/login" className="buttonc4">
            <p className="txbutnc4">Ingresar como Estudiante</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Inicioparte4;
