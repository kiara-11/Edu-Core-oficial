import React from "react";
import Image from "next/image";
import "./Inicioparte1.css";

const Inicioparte1 = () => {
  return (
    <div className="cont1">
      <div className="conttext">
        <p className="txtgenini">
          <span className="titverdecini">
            Accede con tu cuenta y aprovecha todos los beneficios como
          </span>
          <span className="titnarncini"> Estudiante</span>
        </p>
        <div className="contima">
          <Image
            className="imag"
            src="/Group 237640.png"
            width={500}
            height={500}
            alt={""}
          />
          <p className="desc">
            Acceso centralizado a todos tus cursos y tutorías
          </p>
        </div>
        <div className="contima">
          <Image
            className="imag"
            src="/Group 237641.png"
            width={500}
            height={500}
            alt={""}
          />
          <p className="desc">
            Habla directamente con los instructores antes y después de reservar.
          </p>
        </div>
        <div className="contima">
          <Image
            className="imag"
            src="/Group 237642.png"
            width={500}
            height={500}
            alt={""}
          />
          <p className="desc">
            Notificaciones de clases programadas y recordatorios
          </p>
        </div>
      </div>

      <div className="contimagen">
        <div className="contimag2">
          <Image
            className="imag1"
            src="/Group (1).png"
            width={500}
            height={500}
            alt={""}
          />
          <Image
            className="imag1"
            src="/Group.png"
            width={500}
            height={500}
            alt={""}
          />
        </div>
      </div>
    </div>
  );
};

export default Inicioparte1;
