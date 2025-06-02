import React from "react";
import "./Header.css";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
     <header className="estiloHeapue">
      <div className="header2">
        <div className="logo">
          <Image
            className="Buho"
            src="/Captura_de_pantalla_2025-04-06_201213_LE_upscale_balanced_x4-removebg-preview 1.png"
            width={166}
            height={89}
            alt="Logo EduCore"
          />
        </div>
        <nav className="nav-links">
          <li><Link href="/">Inicio</Link></li>
          <li><Link href="/novedades2">Novedades</Link></li>
          <li><Link href="/sobre-nosotros">Sobre Nosotros</Link></li>
          <li><Link href="/explorar">Explorar Cursos</Link></li>
        </nav>
        <div className="auth">
          <Link href="/login">
            <button className="btn login">INICIAR SESIÓN</button>
          </Link>
          <Link href="/registro">
            <button className="btn register">REGISTRARSE</button>
          </Link>
        </div>
      </div>
    </header>
  );
};


export default Header;
