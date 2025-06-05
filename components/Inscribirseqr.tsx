'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import './Inscribirseqr.css';

interface Curso {
  nombreEstudiante: string;
  nombreCurso: string;
  monto: number;
  horario: string;
  fecha: string;
  modalidad: string;
  descripcion: string;
  tutor: string;
  imagenCurso: string;
  qrPago: string;
}

const InscribirseQR: React.FC = () => {
  const [curso, setCurso] = useState<Curso | null>(null);
  const [mostrarSubirComprobante, setMostrarSubirComprobante] = useState(false);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [previewComprobante, setPreviewComprobante] = useState<string | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [subido, setSubido] = useState(false);

  useEffect(() => {
    const datosCurso: Curso = {
      nombreEstudiante: 'María López',
      nombreCurso: 'Curso De Python Desde Cero',
      monto: 60,
      horario: '16:00 - 18:00',
      fecha: '25-10-2025',
      modalidad: 'Virtual',
      descripcion: 'Aprende Python desde cero con ejemplos prácticos.',
      tutor: 'Juan Pérez',
      imagenCurso: '/cincoestudiantes.png',
      qrPago: '/codigoqr.png',
    };
    setCurso(datosCurso);
  }, []);

  const handleConfirmarPago = () => {
    setMostrarSubirComprobante(true);
  };

  const handleArchivoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    setComprobante(archivo || null);
    if (archivo) {
      const lector = new FileReader();
      lector.onloadend = () => {
        setPreviewComprobante(lector.result as string);
      };
      lector.readAsDataURL(archivo);

      setSubiendo(true);
      setTimeout(() => {
        setSubiendo(false);
        setSubido(true);
      }, 3000); // Simulación de carga
    } else {
      setPreviewComprobante(null);
    }
  };

  if (!curso) {
    return <div className="inscripcion-container">Cargando...</div>;
  }

  return (
    <div className="inscripcion-container">
      <h2>Inscribirse a un Curso</h2>
      <div className='dos-tarjetas'>
      <div className="grid-inscripcion">
        <div className="tarjeta-inscripcion">
          <h3 className="titulo-seccion">Datos del Curso</h3>
          <p><strong>Estudiante:</strong> {curso.nombreEstudiante}</p>
          <p><strong>Curso:</strong> {curso.nombreCurso}</p>
          <p><strong>Descripción:</strong> {curso.descripcion}</p>
          <p><strong>Tutor:</strong> {curso.tutor}</p>
          <p><strong>Horario:</strong> {curso.horario}</p>
          <p><strong>Fecha:</strong> {curso.fecha}</p>
          <p><strong>Modalidad:</strong> {curso.modalidad}</p>
          <p><strong>Monto:</strong> {curso.monto} Bs</p>
        </div>

        <div className="tarjeta-inscripcion">
          <h3 className="titulo-seccion centro">Pago por Código QR</h3>
          <div className="qr-box">
            <div className='qr'>
            <img src={curso.qrPago} alt="Código QR" className="qr-img" />
            </div>
            <p className="instruccion">
              Escanea el código QR con tu app de banca móvil preferida para realizar el pago.
            </p>
            <div className="botones">
              <button className="cancelar">Cancelar</button>
              <button className="confirmar" onClick={handleConfirmarPago}>He completado el pago</button>
            </div>
        </div>
            {mostrarSubirComprobante && (
              <div className="confirmar">
                <h5>Subir Comprobante</h5>
                <input type="file" accept="image/*,application/pdf" onChange={handleArchivoChange} />

                {subiendo && <div className="cargando">Subiendo comprobante...</div>}
                {subido && <div className="notificacion">✔️ Se subió el comprobante</div>}

                {previewComprobante && (
                  <div className="preview-comprobante">
                    <p>Vista previa del comprobante:</p>
                    {comprobante && comprobante.type.startsWith('image/') ? (
                      <img src={previewComprobante} alt="Comprobante" />
                    ) : (
                      <p>{comprobante?.name}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscribirseQR;
