'use client';

import React, { useState, useEffect } from 'react';
import styles from './Gestitu.module.css';

interface Documento {
  nombre: string;
  base64: string; // URL o base64
}

interface SolicitudTutor {
  id: number;
  usuario: {
    nombre: string;
    correo: string;
    avatar?: string;
  };
  departamento: string;
  ciudad: string;
  celular: string;
  universidad: string;
  titulo: string;
  certificacion: string;
  entidad: string;
  año: string;
  materias: string;
  modalidad: string;
  horarios: string;
  frecuencia: string;
  documentos: Documento[];
  certificaciones: Documento[];
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
}

const Gestitu: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudTutor[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('Todo');
  const [searchUser, setSearchUser] = useState<string>('');
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudTutor | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('solicitudesTutor');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSolicitudes(parsed);
        }
      } catch (error) {
        console.error('Error parsing solicitudesTutor from localStorage:', error);
      }
    }
  }, []);

  const updateLocalStorage = (newSolicitudes: SolicitudTutor[]) => {
    try {
      localStorage.setItem('solicitudesTutor', JSON.stringify(newSolicitudes));
    } catch (error) {
      console.error('Error saving solicitudesTutor to localStorage:', error);
    }
  };

  const filtered = solicitudes.filter(s => {
    const matchesStatus = filterStatus === 'Todo' || s.estado === filterStatus;
    const matchesSearch =
      s.usuario.nombre.toLowerCase().includes(searchUser.toLowerCase()) ||
      s.materias.toLowerCase().includes(searchUser.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleView = (sol: SolicitudTutor) => setSelectedSolicitud(sol);

  const handleApprove = () => {
    if (!selectedSolicitud) return;

    // Actualizar estado solicitud
    const updatedSolicitudes: SolicitudTutor[] = solicitudes.map(s =>
      s.id === selectedSolicitud.id ? { ...s, estado: 'Aprobado' } : s
    );
    setSolicitudes(updatedSolicitudes);
    updateLocalStorage(updatedSolicitudes);
    setSelectedSolicitud(null);

    // Actualizar rol en localStorage.rolesUsuarios
    const storedRoles = localStorage.getItem('rolesUsuarios');
    const roles: Record<string, string> = storedRoles ? JSON.parse(storedRoles) : {};
    roles[selectedSolicitud.usuario.correo] = 'Tutor';
    localStorage.setItem('rolesUsuarios', JSON.stringify(roles));

    localStorage.setItem('solicitudTutorPendiente', 'false');
    localStorage.setItem('solicitudTutorEstado', 'Aprobado');

    // Guardar datos académicos del tutor aprobado en localStorage
    const tutorDatos = {
      universidad: selectedSolicitud.universidad,
      titulo: selectedSolicitud.titulo,
      certificacion: selectedSolicitud.certificacion,
      entidad: selectedSolicitud.entidad,
      año: selectedSolicitud.año
    };
    localStorage.setItem('solicitudTutorAprobada', JSON.stringify(tutorDatos));
    localStorage.setItem('esTutorAprobado', 'true');
  };

  const handleReject = () => {
    if (!selectedSolicitud) return;

    // Actualizar estado solicitud
    const updatedSolicitudes: SolicitudTutor[] = solicitudes.map(s =>
      s.id === selectedSolicitud.id ? { ...s, estado: 'Rechazado' } : s
    );
    setSolicitudes(updatedSolicitudes);
    updateLocalStorage(updatedSolicitudes);
    setSelectedSolicitud(null);

    // Actualizar rol en localStorage.rolesUsuarios a Estudiante
    const storedRoles = localStorage.getItem('rolesUsuarios');
    const roles: Record<string, string> = storedRoles ? JSON.parse(storedRoles) : {};
    roles[selectedSolicitud.usuario.correo] = 'Estudiante';
    localStorage.setItem('rolesUsuarios', JSON.stringify(roles));

    localStorage.setItem('solicitudTutorPendiente', 'false');
    localStorage.setItem('solicitudTutorEstado', 'Rechazado');

    // Quitar bandera de tutor aprobado si existía
    localStorage.removeItem('solicitudTutorAprobada');
    localStorage.setItem('esTutorAprobado', 'false');
  };

  const handleClose = () => setSelectedSolicitud(null);

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.card}>
          <h2 className={styles.title}>Gestión de Solicitudes de Tutor</h2>

          <div className={styles.filters}>
            <label>
              Estado:
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className={styles.select}
              >
                <option value="Todo">Todo</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </label>

            <label>
              Buscar:
              <input
                type="text"
                value={searchUser}
                onChange={e => setSearchUser(e.target.value)}
                className={styles.input}
                placeholder="Nombre o Materia"
              />
            </label>
          </div>

          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div>Nombre</div>
              <div>Correo</div>
              <div>Materia</div>
              <div>Estado</div>
              <div>Acciones</div>
            </div>

            {filtered.length === 0 ? (
              <div className={styles.noResults}>
                No hay solicitudes que coincidan con la búsqueda.
              </div>
            ) : (
              filtered.map(solicitud => (
                <div key={solicitud.id} className={styles.tableRow}>
                  <div>{solicitud.usuario.nombre}</div>
                  <div>{solicitud.usuario.correo}</div>
                  <div>{solicitud.materias}</div>
                  <div>{solicitud.estado}</div>
                  <div>
                    <button
                      className={styles.viewButton}
                      onClick={() => handleView(solicitud)}
                    >
                      Ver
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {selectedSolicitud && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <button onClick={handleClose} className={styles.closeButton}>×</button>
            <h3>Detalle de Solicitud</h3>
            <p><b>Nombre:</b> {selectedSolicitud.usuario.nombre}</p>
            <p><b>Correo:</b> {selectedSolicitud.usuario.correo}</p>
            <p><b>Celular:</b> {selectedSolicitud.celular}</p>
            <p><b>Departamento:</b> {selectedSolicitud.departamento}</p>
            <p><b>Ciudad:</b> {selectedSolicitud.ciudad}</p>
            <p><b>Universidad:</b> {selectedSolicitud.universidad}</p>
            <p><b>Título:</b> {selectedSolicitud.titulo}</p>
            <p><b>Certificación:</b> {selectedSolicitud.certificacion}</p>
            <p><b>Entidad emisora:</b> {selectedSolicitud.entidad}</p>
            <p><b>Año:</b> {selectedSolicitud.año}</p>
            <p><b>Materias:</b> {selectedSolicitud.materias}</p>
            <p><b>Modalidad:</b> {selectedSolicitud.modalidad}</p>
            <p><b>Horarios:</b> {selectedSolicitud.horarios}</p>
            <p><b>Frecuencia:</b> {selectedSolicitud.frecuencia}</p>

            <h4>Documentos:</h4>
            <ul>
              {selectedSolicitud.documentos.map((doc, i) => (
                <li key={i}>
                  <a
                    href={doc.base64}
                    download={doc.nombre}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {doc.nombre}
                  </a>
                </li>
              ))}
            </ul>

            <h4>Certificaciones:</h4>
            <ul>
              {selectedSolicitud.certificaciones.map((cert, i) => (
                <li key={i}>
                  <a
                    href={cert.base64}
                    download={cert.nombre}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {cert.nombre}
                  </a>
                </li>
              ))}
            </ul>

            <div className={styles.buttonGroup}>
              <button onClick={handleApprove} className={styles.approveButton}>Aprobar</button>
              <button onClick={handleReject} className={styles.rejectButton}>Rechazar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gestitu;
