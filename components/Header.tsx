import React from "react";
import "./HeaderInicio.css";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <div className="estiloHeapue">
      <div className="header2">
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
            <Link href={"/cursos"} passHref>
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
    </div>
  );
};

export default Header;
