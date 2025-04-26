import React from "react";
import TarjEstadoCurso from "./TarjEstadoCurso";
import "./ContMiscursos.css";

const ContMiscursos = () => {
  return (
    <div className="EstadoCursoEMR">
      <div className="submenuclas">
        <div className="selecoptioncla">
          <p className="txtoptioncla">Mis cursos</p>
        </div>
      </div>

      <div className="detalleclases">
        <p className="txtdetalle">Mis cursos</p>
        <div className="contDetCursos">
          <p className="estadoCurso">Próximos</p>
          <div className="contTarjetasCursoEstado">
            <TarjEstadoCurso />
            <TarjEstadoCurso />
          </div>
          <p className="estadoCurso">Historial de Cursos</p>
          <div className="contTarjetasCursoEstado">
            <TarjEstadoCurso />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContMiscursos;
