import Image from "next/image";
import React from "react";
import "./Contlogin.css";

const Contregistro2 = () => {
  return (
    <div className="contenedorloginreg">
      <p className="titinisesreg">Crear una cuenta</p>

      <div className="campollenado">
        <p className="txtcampllen">Departamento</p>
        <select className="txtbox">
          <option value="">Seleccionar Departamento</option>
          <option value="la_paz">La Paz</option>
          <option value="santa_cruz">Santa Cruz</option>
          <option value="cochabamba">Cochabamba</option>
        </select>
      </div>

      <div className="campollenado">
        <p className="txtcampllen">Ciudad</p>
        <select className="txtbox">
          <option value="">Seleccionar Ciudad</option>
          <option value="la_paz">La Paz</option>
          <option value="santa_cruz">Santa Cruz</option>
          <option value="cochabamba">Cochabamba</option>
        </select>
      </div>

      <div className="campollenado">
        <p className="txtcampllen">Número de celular</p>
        <input type="text" className="txtbox" placeholder="Número de celular" />
      </div>

      <div className="botncontinu">
        <p className="txtbutncont">Continuar</p>
      </div>
    </div>
  );
};

export default Contregistro2;
