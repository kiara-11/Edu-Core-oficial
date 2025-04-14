import React from "react";
import Image from "next/image";
import "./Inicioparte1.css";

const Inicioparte1 = () => {
  return (
    <div className="cont1">
      <div className="conttext">
        <p className="benef">Beneficios</p>
        <p className="tit1">
          Accede con tu cuenta y descubre las ventajas de EduCore
        </p>
        <div className="contima">
          <Image
            className="imag"
            src="/Group 237640.png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
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
            alt={"Logo Hotel Pairumani"}
          />
          <p className="desc">Comunicación directa con tutores</p>
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
            alt={"Logo Hotel Pairumani"}
          />
          <Image
            className="imag1"
            src="/Group.png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
        </div>
      </div>
    </div>
  );
};

export default Inicioparte1;
