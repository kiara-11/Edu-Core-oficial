import React from "react";
import Image from "next/image";
import "./HeaderInicio.css";
import Link from "next/link";
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
        <div className="nav-links">
          <li>
            <Link href={"/"} passHref>
              <span className="">Inicio</span>
            </Link>
          </li>
          <li>
            <Link href={"/blog"} passHref>
              Novedades
            </Link>
          </li>
          <li>
            <Link href={"/sobren"} passHref>
              Sobre Nosotros
            </Link>
          </li>
          <li>
            <Link href={"/explorar"} passHref>
              Explorar Cursos
            </Link>
          </li>
        </div>

        <div className="auth">
          <Link href="/login">
            <button className="btn login">INICIAR SESIÓN</button>
          </Link>
          <Link href="/registro">
            <button className="btn register">REGISTRARSE</button>
          </Link>
        </div>
      </div>

      <section className="hero">
        <div className="txinfoini">
          <div className="mensajeb1">
            <p className="txmensajeb1">Nunca dejes de aprender</p>
          </div>
          <p className="txtgeneral">
            <span className="titulo-naranja">Encuentra el curso ideal.</span>
            <br />
            <span className="titulo-verde">
              Reserva fácil, segura y sin complicaciones.
            </span>
          </p>
          <div className="mensajeb2">
            <p className="txmensajeb2">Cursos en diversas áreas y niveles</p>
          </div>
        </div>
        <div className="imagenpendeja"></div>
      </section>
    </div>
  );
};

export default HeaderInicio;
