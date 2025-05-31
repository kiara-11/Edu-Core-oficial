import React from "react";
import "./Header.css";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    
    <div className="header">
        <div className="logo">
          <Image
            className="Buho"
            src="/Captura_de_pantalla_2025-04-06_201213_LE_upscale_balanced_x4-removebg-preview 1.png"
            width={500}
            height={500}
            alt={""}
          />
        </div>
        <div className="nav-links">
          <li>
            <Link href={"/"} passHref>
              <span className="">Inicio</span>
            </Link>
          </li>
          <li>
            <Link href={"/novedades"} passHref>
              Novedades
            </Link>
          </li>
          <li>
            <Link href={"/sobre-nosotros"} passHref>
              Sobre Nosotros
            </Link>
          </li>
          <li>
            <Link href={"/explorar-cursos"} passHref>
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
  );
};

export default Header;
