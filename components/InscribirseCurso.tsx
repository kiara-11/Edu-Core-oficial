'use client';

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation'; // <--- usaRouter aquí
import "./InscribirseCurso.css";
import Link from 'next/link';

type Curso = {
  nom_curso: string;
  precio: number;
  horario: string;
  modalidad: string;
  nivel: string;
  foto_curso?: string;
};

const InscribirseCurso = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  const router = useRouter(); // <--- inicializa router

  const [curso, setCurso] = useState<Curso | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aceptaTerminos, setAceptaTerminos] = useState(false); // opcional
  const [mostrarError, setMostrarError] = useState(false);


  useEffect(() => {
    if (courseId) {
      fetch(`/api/cursoincrip/${courseId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error);
            return;
          }
          setCurso(data);
        })
        .catch(err => {
          console.error(err);
          setError("Error al cargar el curso");
        });
    }
  }, [courseId]);

  const handleContinuarPago = () => {
    if (courseId) {
      router.push(`/Inscribirseqr?id=${courseId}`);
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!curso) return <p>Cargando curso...</p>;

  return (
    <div className="inscripcion-container">
      <h1>Inscribirse a un Curso</h1>
      <div className="inscripcion-content">

        <div className="curso-info">
          <img
            src={curso.foto_curso || "/cincoestudiantes.png"}
            alt="Curso"
            className="curso-img"
          />
          <div className="curso-detalle">
            <h3 className="titulocurso">{curso.nom_curso}</h3>
            <p><strong>Precio:</strong> Bs. {curso.precio}</p>
            <p><strong>Horario:</strong> {curso.horario}</p>
            <p><strong>Modalidad:</strong> {curso.modalidad}</p>
            <p><strong>Nivel:</strong> {curso.nivel}</p>
          </div>
        </div>

        <div className="formulario-inscripcion">
          <h3 className="titulo-inscripcion">
            <img src="/avatarlapiz.png" alt="icono persona y lápiz" className="icono-titulo" />
            Completa tu Inscripción
          </h3>
          <label>Observaciones (Opcional)</label>
          <textarea></textarea>

          <div className="resumen-costos">
            <h3 className="titulo-inscripcion">Resumen de Costos</h3>
            <p><strong>Total a pagar:</strong> {curso.precio} Bs</p>
          </div>

          <div className="aceptar-condiciones">
            <input
              type="checkbox"
              id="terminos"
              checked={aceptaTerminos}
              onChange={(e) => {
                setAceptaTerminos(e.target.checked);
                setMostrarError(false); // Oculta el error al marcar
              }}
            />
            <label htmlFor="terminos">
              He leído y acepto los términos y condiciones del curso.
            </label>
          </div>

          {mostrarError && (
            <p className="error-texto" style={{ color: 'red' }}>
              Debes aceptar los términos y condiciones para continuar.
            </p>
          )}

          <button
            className="btn-inscripcion"
            onClick={() => {
              if (aceptaTerminos) {
                router.push(`/Inscribirseqr?id=${courseId}`);
              } else {
                setMostrarError(true);
              }
            }}
          >
            Continuar con el pago
          </button>



        </div>
      </div>


      <button className="boton-volver" onClick={() => window.history.back()}>
        &larr; Volver Atrás
      </button>

    </div>
  );
};

export default InscribirseCurso;




