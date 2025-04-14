import React from "react";
import Image from "next/image";
import "./HeaderInicio.css";
import Link from 'next/link';
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
        <li><Link href={"/inicio"} passHref>
        <span className="">Inicio</span>
        </Link></li>
        <li><Link href={"/blog"} passHref>Blog</Link></li>
        <li><Link href={"/sobren"} passHref>Sobre Nosotros</Link></li>
        <li><Link href={"/cursos"} passHref>Explorar Cursos</Link></li>
      </div>

      <div className="auth">
        <Link href="/login">
          <button className="btn login">INICIAR SESIÓN</button>
        </Link>
        <Link href="/register">
          <button className="btn register">REGISTRARSE</button>
        </Link>
      </div>
      </div>
      <section className="hero">
        <div className="hero-texto">
          <span className="etiqueta">Nunca dejes de aprender</span>
          <h1>
            Centralizamos la educación personalizada: <br />
            <strong>encuentra, reserva y aprende con confianza.</strong>
          </h1>
          <div className="botones">
            <Link href="/cursos">
              <button className="btn naranja">EXPLORAR CURSOS</button>
            </Link>
            <Link href="/publicar">
              <button className="btn naranja">PUBLICAR UN CURSO</button>
            </Link>
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
      </section>
      
    </div>
  );
};

export default HeaderInicio;
