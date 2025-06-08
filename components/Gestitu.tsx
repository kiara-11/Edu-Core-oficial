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
    motivo_rechazo?: string; // Nueva propiedad
}

const Gestitu: React.FC = () => {
    const [solicitudes, setSolicitudes] = useState<SolicitudTutor[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('Todo');
    const [searchUser, setSearchUser] = useState<string>('');
    const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudTutor | null>(null);
    const [documentos, setDocumentos] = useState<Documento[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingDocs, setLoadingDocs] = useState(false);
    const [error, setError] = useState('');

    // Estado para el modal de motivo de rechazo
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    // Estado para el modal de mensaje
    const [messageModal, setMessageModal] = useState<{ show: boolean; type: 'success' | 'error'; message: string } | null>(null);

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
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [filterStatus, searchUser]);

    const fetchDocumentos = async (id_solicitud: number) => {
        setLoadingDocs(true);
        setDocumentos([]);
        try {
            const response = await fetch(
                `/api/documentos-solicitud?id=${id_solicitud}`
            );

            if (response.ok) {
                const data = await response.json();
                setDocumentos(data);
            } else {
                console.error('No se pudieron cargar los documentos.');
                setDocumentos([]);
            }
        } catch (error) {
            console.error('Error fetching documentos:', error);
            setDocumentos([]);
        } finally {
            setLoadingDocs(false);
        }
    };

    const handleView = async (solicitud: SolicitudTutor) => {
        setSelectedSolicitud(solicitud);
        await fetchDocumentos(solicitud.id_solicitud);
    };

    const handleApprove = async () => {
        if (!selectedSolicitud) return;

        setLoading(true);
        setError('');
        setMessageModal(null);

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

            setSolicitudes(prev =>
                prev.map(s =>
                    s.id_solicitud === selectedSolicitud.id_solicitud
                        ? { ...s, estado: 'Aprobado' as const }
                        : s
                )
            );

            setSelectedSolicitud(null);
            setDocumentos([]);

            setMessageModal({ show: true, type: 'success', message: 'Solicitud aprobada exitosamente' });

        } catch (error) {
            console.error('Error al aprobar solicitud:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al aprobar la solicitud';
            setError(errorMessage);
            setMessageModal({ show: true, type: 'error', message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    // Nueva función para abrir el modal de rechazo
    const handleRejectClick = () => {
        setShowRejectModal(true);
        setRejectReason('');
    };

    // Nueva función para confirmar el rechazo con motivo
    const handleConfirmReject = async () => {
        if (!selectedSolicitud || !rejectReason.trim()) {
            setMessageModal({ show: true, type: 'error', message: 'Debe proporcionar un motivo para el rechazo' });
            return;
        }

        setLoading(true);
        setError('');
        setMessageModal(null);

        try {
            const response = await fetch('/api/gestionar-solicitudes', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_solicitud: selectedSolicitud.id_solicitud,
                    accion: 'rechazar',
                    email: selectedSolicitud.email,
                    motivo_rechazo: rejectReason.trim() // Agregar el motivo
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Error al rechazar la solicitud');
            }

            setSolicitudes(prev =>
                prev.map(s =>
                    s.id_solicitud === selectedSolicitud.id_solicitud
                        ? { ...s, estado: 'Rechazado' as const, motivo_rechazo: rejectReason.trim() }
                        : s
                )
            );

            setSelectedSolicitud(null);
            setDocumentos([]);
            setShowRejectModal(false);
            setRejectReason('');

            setMessageModal({ show: true, type: 'success', message: 'Solicitud rechazada exitosamente' });

        } catch (error) {
            console.error('Error al rechazar solicitud:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al rechazar la solicitud';
            setError(errorMessage);
            setMessageModal({ show: true, type: 'error', message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedSolicitud(null);
        setDocumentos([]);
    };

    const handleCloseMessageModal = () => {
        setMessageModal(null);
        fetchSolicitudes();
    };

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

                    {loading && !selectedSolicitud && (
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
                            {loadingDocs ? (
                                <p>Cargando documentos...</p>
                            ) : documentos.length > 0 ? (
                                <ul className={styles.documentList}>
                                    {documentos.map((doc, i) => renderDocumento(doc, i))}
                                </ul>
                            ) : (
                                <p>No hay documentos adjuntos.</p>
                            )}
                        </div>

                        {/* Mostrar motivo de rechazo si existe */}
                        {selectedSolicitud.estado === 'Rechazado' && selectedSolicitud.motivo_rechazo && (
                            <div className={styles.detailSection}>
                                <h4>Motivo de Rechazo:</h4>
                                <div className={styles.rejectReason}>
                                    {selectedSolicitud.motivo_rechazo}
                                </div>
                            </div>
                        )}

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
                                    onClick={handleRejectClick}
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

            {/* MODAL DE MOTIVO DE RECHAZO */}
            {showRejectModal && (
                <div className={styles.messageModalOverlay}>
                    <div className={styles.messageModal}>
                        <div className={styles.messageModalHeader}>
                            <h3>Motivo de Rechazo</h3>
                            <button 
                                onClick={() => setShowRejectModal(false)} 
                                className={styles.messageModalCloseButton}
                            >×</button>
                        </div>
                        <div className={styles.messageModalBody}>
                            <p>Por favor, especifica el motivo por el cual se rechaza esta solicitud:</p>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className={styles.rejectReasonTextarea}
                                placeholder="Escribe aquí el motivo del rechazo..."
                                rows={4}
                                maxLength={500}
                            />
                            <small className={styles.characterCount}>
                                {rejectReason.length}/500 caracteres
                            </small>
                        </div>
                        <div className={styles.messageModalFooter}>
                            <button 
                                onClick={() => setShowRejectModal(false)}
                                className={styles.cancelButton}
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleConfirmReject}
                                className={styles.confirmRejectButton}
                                disabled={loading || !rejectReason.trim()}
                            >
                                {loading ? 'Procesando...' : 'Confirmar Rechazo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE MENSAJE */}
            {messageModal && messageModal.show && (
                <div className={styles.messageModalOverlay}>
                    <div className={`${styles.messageModal} ${styles[messageModal.type]}`}>
                        <div className={styles.messageModalHeader}>
                            <h3>{messageModal.type === 'success' ? 'Éxito' : 'Error'}</h3>
                            <button onClick={handleCloseMessageModal} className={styles.messageModalCloseButton}>×</button>
                        </div>
                        <div className={styles.messageModalBody}>
                            <p>{messageModal.message}</p>
                        </div>
                        <div className={styles.messageModalFooter}>
                            <button onClick={handleCloseMessageModal} className={styles.messageModalButton}>Aceptar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gestitu;