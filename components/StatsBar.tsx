import React from "react";
import "./StatsBar.css";
import Image from "next/image";
import Link from "next/link";

const StatsBar = () => {
  return (
    <div className="parte5">
      <div className="conttextp5">
        <p className="tgenep5">
          <span className="nonegrip5">EduCore transforma la</span>
          <span className="sinegrip5"> educación personalizada</span>
        </p>
        <p className="txtlargp5">
          Conecta estudiantes y tutores en un entorno digital moderno, donde las reservas, pagos y promociones se gestionan automáticamente. Más visibilidad, menos complicaciones.
        </p>
        <Link href="/segundainterfaz">
          <p className="aboutp5">Sobre Nosotros</p>
        </Link>
      </div>
      <div className="imagenpendejap5"></div>
    </div>
  );
};

export default StatsBar;
