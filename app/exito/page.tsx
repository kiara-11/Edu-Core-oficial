'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import './Rfinal.css';

const Page = () => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correo, setCorreo] = useState('');

  useEffect(() => {
    const nombre = localStorage.getItem('nombreCompleto');
    const email = localStorage.getItem('correo');
    if (nombre) setNombreCompleto(nombre);
    if (email) setCorreo(email);
  }, []);

  return (
    <div className="registro-completado-container">
      <div className="background-logo">
        <img src="/logoBackground.png" alt="Logo de fondo" className="logo-image" />
      </div>

      <div className="registro-completado-content">
        <div className="icon-container">
          <Image src="/party.png" alt="Celebración" width={90} height={90} />
        </div>
        <h1 className="registro-completado-title">¡Registro completado!
        </h1>
        <p className="registro-completado-text">
          {nombreCompleto && `Bienvenid@, ${nombreCompleto}.`} Gracias por unirte a nuestra comunidad.<br />
          {correo && <><strong>Tu correo:</strong> {correo}</>}<br />
          En EduCore conectamos estudiantes apasionados con tutores expertos para crear experiencias de aprendizaje personalizadas y efectivas.
        </p>

        <a href="/Inicio" className="registro-completado-button">
          Ir a la página de inicio
        </a>
      </div>
    </div>
  );
};

export default Page;