'use client';

import React from "react";
import "./InscribirseCurso.css";

const InscribirseCurso = () => {
  return (
    <div className="inscripcion-container">
      <h1>Datos de la Inscripción</h1>
      <div className="inscripcion-content">

        {/* Tarjeta de Curso */}
        <div className="curso-info">
          <img
            src="/cincoestudiantes.png"
            alt="Curso"
            className="curso-img"
          />
          <div className="curso-detalle">
            <h3 className="titulocurso">Curso De Python Desde Cero</h3>
            <p><strong>Precio Del Curso:</strong> Bs. 60</p>
            <p><strong>Horario:</strong> De 16:00 A 18:00</p>
            <p><strong>Fecha De Inicio:</strong> 25 de Octubre</p>
            <p><strong>Lecciones:</strong> 10</p>
            <p><strong>Modalidad:</strong> Virtual</p>
            <p><strong>Nivel:</strong> Principiante</p>
            <p><strong>Días De Clase:</strong> Lunes A Viernes</p>
          </div>
        </div>

        {/* Formulario de Inscripcion */}
        <div className="formulario-inscripcion">
          <h3 className="titulo-inscripcion">
          <img src="/avatarlapiz.png" alt="icono persona y lápiz" className="icono-titulo" />
          Completa tu Inscripción
          </h3>
          <label>Observaciones (Opcional)</label>
          <input type="text" placeholder="Escribe aquí tus necesidades, horarios preferidos, etc." />


          <label>Código Promocional</label>
          <div className="codigo-promocional">
          <input type="text" placeholder="Ingresa tu código" />
          <button className="btn-inscripcion">Aplicar</button>
        </div>

          <div className="resumen-costos">
            <h3 className="titulo-inscripcion"> 
              Resumen de Costos </h3>
            <p><strong>Precio Regular:</strong> 60 Bs</p>
            <p><strong>Total a pagar:</strong> 60 Bs</p>
          </div>

          <div className="aceptar-condiciones">
            <input type="checkbox" id="terminos" />
            <label htmlFor="terminos">
              He leído y acepto los términos y condiciones del curso.
            </label>
          </div>   

          <button className="btn-inscripcion">Confirmar Inscripción</button>

        </div>
      </div>

      <a href="#" className="volver">&larr; Volver Atrás</a>
    </div>
  );
};

export default InscribirseCurso;
