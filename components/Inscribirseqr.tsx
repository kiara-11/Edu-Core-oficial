'use client';

import React, { useEffect, useState } from 'react';
import './Inscribirseqr.css';
import { useSearchParams } from 'next/navigation';

type Curso = {
  nom_curso: string;
  precio: number;
  horario: string;
  modalidad: string;
  fe_inicio?: string;
  foto_curso?: string;
  Id_user: number; // Tutor
};

const InscribirseQR = () => {
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');

  const [curso, setCurso] = useState<Curso | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetch(`/api/cursoincrip/${courseId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) setError(data.error);
          else setCurso(data);
        })
        .catch(() => setError("Error al cargar el curso"));
    }
  }, [courseId]);

  const handlePagoCompletado = async () => {
    if (!curso || !courseId) {
      alert('Faltan datos para procesar la inscripción.');
      return;
    }

    const idEstudiante = localStorage.getItem("id_user");
    if (!idEstudiante) {
      alert('No se encontró usuario logueado.');
      return;
    }

    try {
      const response = await fetch('/api/solicitudnotif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Id_user: parseInt(idEstudiante),
          Id_curso: parseInt(courseId),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('¡Solicitud enviada y tutor notificado!');
      } else {
        alert('Error: ' + data.error);
      }
    } catch {
      alert('Fallo en la comunicación con el servidor.');
    }
  };

  if (error) return <p>Error: {error}</p>;
  if (!curso) return <p>Cargando curso...</p>;

  return (
    <div className="inscripcion-container">
      <h2>Inscribirse a un Curso</h2>

      <div className="tarjeta-inscripcion">
        <div className="info-curso">
          <img
            src={curso.foto_curso || "/cincoestudiantes.png"}
            alt="Curso"
            className="dimimgest"
          />
          <div className="datos-curso">
            <h3>{curso.nom_curso}</h3>
            <div className="detalle-curso">
              <span>Bs. {curso.precio}</span>
              <span>● {curso.horario}</span>
              {curso.fe_inicio && <span>● {curso.fe_inicio}</span>}
              <span>📡 {curso.modalidad}</span>
            </div>
          </div>
        </div>

        <div className="qr-section">
          <h4 className='centro'>Pago por Código QR</h4>
          <div className="qr-box">
            <img
              src="/codigoqr.png"
              alt="Código QR"
              className="img-curso"
            />
            <p className="monto">Monto a pagar: <strong>{curso.precio} Bs</strong></p>
            <p className="instruccion">
              Escanea el código QR con tu app de banca móvil preferida para realizar el pago
            </p>
          </div>
          <div className="botones">
            <button className="cancelar" onClick={() => window.history.back()}>Cancelar</button>
            <button className="confirmar" onClick={handlePagoCompletado}>He completado el pago</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscribirseQR;
