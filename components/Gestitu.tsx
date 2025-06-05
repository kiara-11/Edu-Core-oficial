'use client';

import React, { useState, useEffect } from 'react';
import styles from './Gestitu.module.css';

interface Documento {
  id?: number;
  nombre: string;
  base64: string;
  tipo: 'certificado' | 'docente';
  direccion?: string;
}

interface SolicitudTutor {
  id_solicitud: number;
  user_name: string;
  nombreCompleto: string;
  email: string;
  telefono?: string;
  universidad: string;
  profesion: string;
  certificacion?: string;
  entidad?: string;
  anio?: number;
  modalidad: string;
  horarios: string;
  frecuencia: string;
  materias: string;
  estado: 'Pendiente' | 'Aprobado' | 'Rechazado';
}

const Gestitu: React.FC = () => {
  const [solicitudes, setSolicitudes] = useState<SolicitudTutor[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('Todo');
  const [searchUser, setSearchUser] = useState<string>('');
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudTutor | null>(null);
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar solicitudes al montar el componente
  useEffect(() => {
    fetchSolicitudes();
  }, []);

  // Cargar solicitudes desde la API
  const fetchSolicitudes = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'Todo') {
        params.append('estado', filterStatus);
      }
      if (searchUser.trim()) {
        params.append('busqueda', searchUser.trim());
      }

      const response = await fetch(`/api/gestionar-solicitudes?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar las solicitudes');
      }

      const data = await response.json();
      setSolicitudes(data);
    } catch (error) {
      console.error('Error fetching solicitudes:', error);
      setError('Error al cargar las solicitudes. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Recargar cuando cambien los filtros
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSolicitudes();
    }, 500); // Debounce de 500ms

    return () => clearTimeout(timeoutId);
  }, [filterStatus, searchUser]);

  // Función para cargar documentos de una solicitud específica
const fetchDocumentos = async (universidad: string, email: string) => {
  try {
    const response = await fetch(
      `/api/documentos-solicitud?universidad=${encodeURIComponent(universidad)}&email=${encodeURIComponent(email)}`
    );

    if (response.ok) {
      const data = await response.json();
      setDocumentos(data);
    } else {
      setDocumentos([]);
    }
  } catch (error) {
    console.error('Error fetching documentos:', error);
    setDocumentos([]);
  }
};

  // Manejar visualización de solicitud
  const handleView = async (solicitud: SolicitudTutor) => {
  setSelectedSolicitud(solicitud);
  await fetchDocumentos(solicitud.universidad, solicitud.email);
};
  // Aprobar solicitud
  const handleApprove = async () => {
    if (!selectedSolicitud) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/gestionar-solicitudes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_solicitud: selectedSolicitud.id_solicitud,
          accion: 'aprobar',
          email: selectedSolicitud.email
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al aprobar la solicitud');
      }

      // Actualizar el estado local
      setSolicitudes(prev => 
        prev.map(s => 
          s.id_solicitud === selectedSolicitud.id_solicitud 
            ? { ...s, estado: 'Aprobado' as const }
            : s
        )
      );

      setSelectedSolicitud(null);
      setDocumentos([]);
      
      // Mostrar mensaje de éxito
      alert('Solicitud aprobada exitosamente');

    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      setError(error instanceof Error ? error.message : 'Error al aprobar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  // Rechazar solicitud
  const handleReject = async () => {
    if (!selectedSolicitud) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/gestionar-solicitudes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_solicitud: selectedSolicitud.id_solicitud,
          accion: 'rechazar',
          email: selectedSolicitud.email
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al rechazar la solicitud');
      }

      // Actualizar el estado local
      setSolicitudes(prev => 
        prev.map(s => 
          s.id_solicitud === selectedSolicitud.id_solicitud 
            ? { ...s, estado: 'Rechazado' as const }
            : s
        )
      );

      setSelectedSolicitud(null);
      setDocumentos([]);
      
      // Mostrar mensaje de éxito
      alert('Solicitud rechazada');

    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      setError(error instanceof Error ? error.message : 'Error al rechazar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedSolicitud(null);
    setDocumentos([]);
  };

  // Función para renderizar documentos
  const renderDocumento = (doc: Documento, index: number) => {
    const isBase64 = doc.base64?.startsWith('data:');
    const filename = doc.nombre || `documento_${index + 1}.pdf`;
    
    if (isBase64) {
      return (
        <li key={index}>
          <a
            href={doc.base64}
            download={filename}
            target="_blank"
            rel="noreferrer"
            className={styles.documentLink}
          >
            📄 {filename}
          </a>
        </li>
      );
    } else {
      return (
        <li key={index}>
          <span className={styles.documentName}>📄 {filename}</span>
          <small> (Documento no disponible)</small>
        </li>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.card}>
          <h2 className={styles.title}>Gestión de Solicitudes de Tutor</h2>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

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

          {loading && (
            <div className={styles.loadingMessage}>
              Cargando solicitudes...
            </div>
          )}

          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div>Nombre</div>
              <div>Correo</div>
              <div>Universidad</div>
              <div>Materia</div>
              <div>Estado</div>
              <div>Acciones</div>
            </div>

            {!loading && solicitudes.length === 0 ? (
              <div className={styles.noResults}>
                No hay solicitudes que coincidan con la búsqueda.
              </div>
            ) : (
              solicitudes.map(solicitud => (
                <div key={solicitud.id_solicitud} className={styles.tableRow}>
                  <div>{solicitud.nombreCompleto || solicitud.user_name}</div>
                  <div>{solicitud.email}</div>
                  <div>{solicitud.universidad}</div>
                  <div>{solicitud.materias}</div>
                  <div>
                    <span className={`${styles.statusBadge} ${styles[solicitud.estado.toLowerCase()]}`}>
                      {solicitud.estado}
                    </span>
                  </div>
                  <div>
                    <button
                      className={styles.viewButton}
                      onClick={() => handleView(solicitud)}
                      disabled={loading}
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
            
            <div className={styles.detailSection}>
              <h4>Información Personal</h4>
              <p><b>Nombre:</b> {selectedSolicitud.nombreCompleto || selectedSolicitud.user_name}</p>
              <p><b>Correo:</b> {selectedSolicitud.email}</p>
              <p><b>Teléfono:</b> {selectedSolicitud.telefono || 'No proporcionado'}</p>
            </div>

            <div className={styles.detailSection}>
              <h4>Formación Académica</h4>
              <p><b>Universidad:</b> {selectedSolicitud.universidad}</p>
              <p><b>Título:</b> {selectedSolicitud.profesion}</p>
              <p><b>Certificación:</b> {selectedSolicitud.certificacion || 'No especificada'}</p>
              <p><b>Entidad emisora:</b> {selectedSolicitud.entidad || 'No especificada'}</p>
              <p><b>Año:</b> {selectedSolicitud.anio || 'No especificado'}</p>
            </div>

            <div className={styles.detailSection}>
              <h4>Perfil como Tutor</h4>
              <p><b>Materias:</b> {selectedSolicitud.materias}</p>
              <p><b>Modalidad:</b> {selectedSolicitud.modalidad}</p>
              <p><b>Horarios:</b> {selectedSolicitud.horarios}</p>
              <p><b>Frecuencia:</b> {selectedSolicitud.frecuencia}</p>
            </div>

            <div className={styles.detailSection}>
              <h4>Documentos:</h4>
              {documentos.length > 0 ? (
                <ul className={styles.documentList}>
                  {documentos.map((doc, i) => renderDocumento(doc, i))}
                </ul>
              ) : (
                <p>No hay documentos disponibles</p>
              )}
            </div>

            {selectedSolicitud.estado === 'Pendiente' && (
              <div className={styles.buttonGroup}>
                <button 
                  onClick={handleApprove} 
                  className={styles.approveButton}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Aprobar'}
                </button>
                <button 
                  onClick={handleReject} 
                  className={styles.rejectButton}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Rechazar'}
                </button>
              </div>
            )}

            {selectedSolicitud.estado !== 'Pendiente' && (
              <div className={styles.statusInfo}>
                <p>Estado actual: <strong>{selectedSolicitud.estado}</strong></p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gestitu;