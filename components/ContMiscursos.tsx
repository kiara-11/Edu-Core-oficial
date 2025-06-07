'use client';

import React, { useEffect, useState } from 'react';
import TarjEstadoCurso from './TarjEstadoCurso';
import './Novedades.css';
import './ContMiscursos.css';

interface Curso {
  Id_progcur: number;
  NombreTutor: string;
  NombreCurso: string;
  Horario: string;
  Modalidad: string;
  Id_estado: number;
}

const ContMiscursos = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCursos = async () => {
      const id_user = localStorage.getItem("id_user");

      if (!id_user) {
        console.error("No se encontró id_user en localStorage");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/miscursos?id_user=${id_user}`);

        if (!res.ok) {
          console.error("Error al obtener cursos:", res.status);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setCursos(data);
      } catch (error) {
        console.error("Error en la solicitud de cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  const cursosEnProceso = cursos.filter((c) => c.Id_estado === 6);
  const cursosFinalizados = cursos.filter((c) => c.Id_estado === 7);

  if (loading) return <p>Cargando cursos...</p>;

  return (
  <div className="EstadoCursoEMR">
    <p className="titnovd">Mis cursos</p>

    <p className="subtitnovd">En proceso</p>
    <div className="contTarjetasCursoEstado">
      {cursosEnProceso.length > 0 ? (
        cursosEnProceso.map((curso) => (
          <TarjEstadoCurso key={curso.Id_progcur} curso={curso} />
        ))
      ) : (
        <p className="mensaje-vacio">No tienes cursos en proceso.</p>
      )}
    </div>

    <p className="subtitnovd">Finalizados</p>
    <div className="contTarjetasCursoEstado">
      {cursosFinalizados.length > 0 ? (
        cursosFinalizados.map((curso) => (
          <TarjEstadoCurso key={curso.Id_progcur} curso={curso} />
        ))
      ) : (
        <p className="mensaje-vacio">Aún no has finalizado ningún curso.</p>
      )}
    </div>
  </div>
);

};

export default ContMiscursos;
