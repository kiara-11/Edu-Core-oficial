import Image from "next/image";
import React from "react";
import "./Contlogin.css";
import Link from "next/link";

const Contregistro = () => {
  return (
    <div className="contenedorloginreg">
      <p className="titinisesreg">Crear una cuenta</p>

      <div className="campollenado">
        <p className="txtcampllen">Nombre completo</p>
        <input type="text" className="txtbox" placeholder="Nombre completo" />
      </div>
      <div className="campollenado">
        <p className="txtcampllen">Email</p>
        <input type="text" className="txtbox" placeholder="Email" />
      </div>
      <div className="campollenado">
        <p className="txtcampllen">Contraseña</p>
        <input type="password" className="txtbox" placeholder="Contraseña" />
      </div>
      <div className="campollenado">
        <p className="txtcampllen">Confirmar contraseña</p>
        <input type="password" className="txtbox" placeholder="Confirmar contraseña" />
      </div>

      <p className="txtterminos">
        Al crear o utilizar una cuenta, usted acepta nuestros Términos de
        servicio y Política de privacidad.
      </p>
      <Link href={"/registro2"} passHref>
        <div className="botncontinu">
          <p className="txtbutncont">Continuar</p>
        </div>
      </Link>
    </div>
  );
};

export default Contregistro;
