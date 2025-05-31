import React from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import './Rfinal.css';

const Page = () => {
  return (
    <div className="registro-completado-container">
      <div className="background-logo">
        <img src="/logoBackground.png" alt="Logo de fondo" className="logo-image" />
      </div>

      <Header />

      <div className="registro-completado-content">
        <div className="icon-container">
          <Image src="/party.png" alt="Celebración" width={90} height={90} />
        </div>
        <h1 className="registro-completado-title">¡Registro completado!</h1>
        <p className="registro-completado-text">
          Gracias por unirte a nuestra comunidad. En EduCore conectamos estudiantes apasionados con tutores expertos para crear
          experiencias de aprendizaje personalizadas y efectivas.
        </p>

        <a href="/" className="registro-completado-button">
          Ir a la página de inicio
        </a>
      </div>
    </div>
  );
};

export default Page;
