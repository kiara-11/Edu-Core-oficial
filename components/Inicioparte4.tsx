import React from "react";
import "./Inicioparte4.css";
import Link from "next/link";
const Inicioparte4 = () => {
  return (
    <div className="contenedor-principal">
      <div className="fondo-oscuro">
        <div className="texto-eduCore">
          <h2>EduCore</h2>
          <p>Simplifica tu educación</p>
        </div>

        <div className="contenido-info">
          <div className="info-item">
            <div className="icono lupa" />
            <div className="texto-item">
              <p>Encuentra los cursos que necesitas o enseña lo que dominas.</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icono agenda" />
            <div className="texto-item">
              <p>Agenda las clases de acuerdo a tu tiempo disponible.</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icono cerebro" />
            <div className="texto-item">
              <p>Aprende o imparte clases de manera personalizada.</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icono contacto" />
            <div className="texto-item">
              <p>Contacto directo estudiante tutor</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icono pagos" />
            <div className="texto-item">
              <p>Pagos seguros</p>
            </div>
          </div>

          <div className="info-item">
            <div className="icono explora" />
            <div className="texto-item">
              <p>
                Explora los cursos que tenemos para ofrecerte, registrate y se parte de nuestra comunidad.
              </p>
            </div>
          </div>
        </div>
        <Link href="/registro">
          <button className="btn-registrarme">¡Quiero Registrarme!</button>
        </Link>
      </div>
    </div>
  );
};

export default Inicioparte4;
