import React from "react";
import Image from "next/image";
import "./Filtros.css";

const Filtros = () => {
  return (
    <div>
      <p className="tituloFIL">Filtros</p>
      <p className="SubtituloFIL">Modalidad</p>
      <div className="checksini">
        <Image
          className="check"
          src="/1287087.png"
          width={500}
          height={500}
          alt={"Logo Hotel Pairumani"}
        />
        <p className="categoriaFIL">En línea</p>
      </div>
      <div className="checksini">
        <Image
          className="Nocheck"
          src="/25235.png"
          width={500}
          height={500}
          alt={"Logo Hotel Pairumani"}
        />
        <p className="categoriaFIL">Presencial</p>
      </div>
      <p className="SubtituloFIL">Nivel</p>
      <div className="checksini">
        <Image
          className="check"
          src="/1287087.png"
          width={500}
          height={500}
          alt={"Logo Hotel Pairumani"}
        />
        <p className="categoriaFIL">Básico</p>
      </div>
      <div className="checksini">
        <Image
          className="Nocheck"
          src="/25235.png"
          width={500}
          height={500}
          alt={"Logo Hotel Pairumani"}
        />
        <p className="categoriaFIL">Intermedio</p>
      </div>
      <div className="checksini">
        <Image
          className="Nocheck"
          src="/25235.png"
          width={500}
          height={500}
          alt={"Logo Hotel Pairumani"}
        />
        <p className="categoriaFIL">Avanzado</p>
      </div>
      <p className="SubtituloFIL">Disponibilidad</p>
      <div className="checksini">
        <Image
          className="check"
          src="/1287087.png"
          width={500}
          height={500}
          alt={"Logo Hotel Pairumani"}
        />
        <p className="categoriaFIL">Mañana</p>
      </div>
      <div className="checksini">
        <Image
          className="Nocheck"
          src="/25235.png"
          width={500}
          height={500}
          alt={"Logo Hotel Pairumani"}
        />
        <p className="categoriaFIL">Tarde</p>
      </div>
      <div className="checksini">
        <Image
          className="Nocheck"
          src="/25235.png"
          width={500}
          height={500}
          alt={"Logo Hotel Pairumani"}
        />
        <p className="categoriaFIL">Noche</p>
      </div>
    </div>
  );
};

export default Filtros;
