import React from "react";
import Image from "next/image";
import "./HeaderInicio.css";
const HeaderInicio = () => {
  return (
    <div className="toelheaderpue">
      <div className="header">
        <div className="logo">
          <Image
            className="Buho"
            src="/Captura_de_pantalla_2025-04-06_201213_LE_upscale_balanced_x4-removebg-preview 1.png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
        </div>
        <div className="buttons">
          <p className="selec">Inicio</p>
          <p className="def">Blog</p>
          <p className="def">Acerca de nosotros</p>
          <p className="def">Explorar cursos</p>
          <div className="boton1">
            <p className="but1tex">INICIAR SESION</p>
          </div>
          <div className="boton2">
            <p className="but2tex">REGISTRARSE</p>
          </div>
        </div>
      </div>


      <div className="contHeader">
        <div className="textown">
            <p className="never">Nunca dejes de aprender</p>
            <p className="center">Centralizamos la educación personalizada: encuentra, reserva y aprende con confianza.</p>
            <div className="buttons2">
                <div className="buttonorange">
                    <p className="textbutton">EXPLORAR CURSOS</p>
                </div>
                <div className="buttonorange">
                    <p className="textbutton">PUBLICAR UN CURSO</p>
                </div>
            </div>
        </div>
        <div className="imagenweon">
        <Image
            className="lerdo"
            src="/image-uM5ZOTW7R-transformed 1.png"
            width={500}
            height={500}
            alt={"Logo Hotel Pairumani"}
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderInicio;
