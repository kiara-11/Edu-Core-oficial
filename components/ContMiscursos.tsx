import React from "react";
import TarjEstadoCurso from "./TarjEstadoCurso";
import "./Novedades.css";
import "./ContMiscursos.css";

const ContMiscursos = () => {
  return (
    <div className="EstadoCursoEMR">
      <p className="titnovd">Mis cursos</p>
      <p className="subtitnovd">En proceso</p>
      <div className="contTarjetasCursoEstado">
        <TarjEstadoCurso />
        <TarjEstadoCurso />
        <TarjEstadoCurso />
        <TarjEstadoCurso />
        <TarjEstadoCurso />
        <TarjEstadoCurso />
      </div>
      <p className="subtitnovd">Finalizados</p>
      <div className="contTarjetasCursoEstado">
        <TarjEstadoCurso />
      </div>
    </div>
  );
};

export default ContMiscursos;
