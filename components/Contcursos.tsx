import React from "react";
import Image from "next/image";
import Filtros from "./Filtros";
import TarjBusq from "./TarjBusq";
import "./Contcursos.css";

const Contcursos = () => {
  return (
    <div className="contenido">
      <div className="filtros">
        <Filtros />
      </div>
      <div className="busqueda">
        <div className="barraDebusqueda">
          <div className="contenedor">
            <p className="textobarra">Busca cursos como “Programación”</p>
            <div className="botonbusca">
              <Image
                className="LupaTB"
                src="/14562.png"
                width={500}
                height={500}
                alt={"Logo Hotel Pairumani"}
              />
            </div>
          </div>
        </div>
        <div className="tarjetas">
          <TarjBusq />
          <TarjBusq />
          <TarjBusq />
          <TarjBusq />
        </div>
      </div>
    </div>
  );
};

export default Contcursos;
