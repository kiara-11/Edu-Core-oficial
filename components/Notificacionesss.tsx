'use client';

import React, { useEffect, useState } from 'react';
import CardCheckNoti from './CardCheckNoti';
import CardCancelNoti from './CardCancelNoti';
import CardTimeNoti from './CardTimeNoti';
import './CardNoti.css';

interface SolicitudStatus {
    status: string;
    motivo_rechazo?: string | null;
}

interface NotificacionEstudiante {
    idSolcur: number; // 👈 agregado este campo
    estudiante: string;
    curso: string;
    mensaje: string;
    fecha: string;
    estado: string;
}

const Notificacionesss = () => {
    const [estadoSolicitud, setEstadoSolicitud] = useState<SolicitudStatus | null>(null);
    const [notificacionesEstudiantes, setNotificacionesEstudiantes] = useState<NotificacionEstudiante[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [localUserId, setLocalUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('id_user');
        if (storedUserId) {
            setLocalUserId(storedUserId);
        } else {
            setLoading(false);
            console.warn("No 'id_user' found in localStorage. Cannot fetch notifications.");
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!localUserId) return;

            setLoading(true);
            setError(null);

            try {
                const estadoRes = await fetch(`/api/user-solicitud-status?userId=${localUserId}`);
                const estadoData = await estadoRes.json();
                setEstadoSolicitud({
                    status: estadoData.status,
                    motivo_rechazo: estadoData.motivo_rechazo || null,
                });

                const notiRes = await fetch(`/api/solicitudnotif2?userId=${localUserId}`);
                const notiData = await notiRes.json();

                if (notiData.notificacionesEstudiantes) {
                    setNotificacionesEstudiantes(notiData.notificacionesEstudiantes);
                } else {
                    setNotificacionesEstudiantes([]);
                }
            } catch (err) {
                console.error("Error fetching notifications:", err);
                setError("Error al cargar las notificaciones.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [localUserId]);

    const aceptarNotificacion = () => {
        console.log("Notificación pendiente reconocida.");
    };

    const gestionarSolicitud = async (idSolcur: number, decision: 'aceptar' | 'rechazar') => {
        try {
            const res = await fetch('/api/gestionar-solicitud', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Id_solcur: idSolcur, decision }),
            });

            const data = await res.json();

            if (data.success) {
                // Eliminar la notificación de la lista local
                setNotificacionesEstudiantes(prev =>
                    prev.filter(n => n.idSolcur !== idSolcur)
                );
            } else {
                console.error('Error en respuesta del servidor:', data.error);
                alert('Ocurrió un error al procesar la solicitud.');
            }
        } catch (error) {
            console.error('Error al gestionar solicitud:', error);
            alert('Error al gestionar la solicitud.');
        }
    };


    const mensajes = {
        aprobado: {
            titulo: 'Solicitud Aprobada',
            detalle: '¡Felicidades! Tu solicitud para ser tutor ha sido aprobada.',
            botonTexto: 'Ir a mis cursos',
            botonLink: '/miscursos'
        },
        rechazado: {
            titulo: 'Solicitud Rechazada',
            detalle: 'Lo sentimos, tu solicitud para ser tutor no fue aprobada.',
            botonTexto: 'Contactar soporte',
            botonLink: '/contacto'
        },
        pendiente: {
            titulo: 'Solicitud pendiente',
            detalle: 'Tu solicitud para ser tutor está en revisión. Por favor espera la confirmación.',
            botonTexto: 'Aceptar',
            botonLink: ''
        }
    };

    if (loading) {
        return (
            <div className="containernotif">
                <p className="notititl">Notificaciones</p>
                <div className="notifcards">
                    <div className="cardcontent">
                        <p>Cargando notificaciones...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="containernotif">
                <p className="notititl">Notificaciones</p>
                <div className="notifcards">
                    <div className="cardcontent">
                        <p className="error-message">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="containernotif">
            <p className="notititl">Notificaciones</p>
            <div className="notifcards">
                {estadoSolicitud?.status === 'Pendiente' && (
                    <CardTimeNoti
                        titulo={mensajes.pendiente.titulo}
                        detalle={mensajes.pendiente.detalle}
                        botonTexto={mensajes.pendiente.botonTexto}
                        onBotonClick={aceptarNotificacion}
                    />
                )}
                {estadoSolicitud?.status === 'Aprobado' && (
                    <CardCheckNoti
                        titulo={mensajes.aprobado.titulo}
                        detalle={mensajes.aprobado.detalle}
                        botonTexto={mensajes.aprobado.botonTexto}
                        botonLink={mensajes.aprobado.botonLink}
                    />
                )}
                {estadoSolicitud?.status === 'Rechazado' && (
                    <CardCancelNoti
                        titulo={mensajes.rechazado.titulo}
                        detalle={mensajes.rechazado.detalle}
                        motivoRechazo={estadoSolicitud.motivo_rechazo ?? undefined}
                        botonTexto={mensajes.rechazado.botonTexto}
                        botonLink={mensajes.rechazado.botonLink}
                    />
                )}

                {notificacionesEstudiantes.length > 0 && (
                    notificacionesEstudiantes.map((notif, index) => (
                        <div className="cardcontent" key={index}>
                            <p><strong>{notif.estudiante}</strong> solicitó unirse al curso <strong>{notif.curso}</strong>.</p>
                            <p><em>{notif.mensaje}</em></p>
                            <p>{new Date(notif.fecha).toLocaleString()}</p>
                            <p>Estado: {notif.estado}</p>

                            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                <button onClick={() => gestionarSolicitud(notif.idSolcur, 'aceptar')}>Aceptar</button>
                                <button onClick={() => gestionarSolicitud(notif.idSolcur, 'rechazar')}>Rechazar</button>
                            </div>
                        </div>
                    ))
                )}

                {((!estadoSolicitud || estadoSolicitud.status === null) && notificacionesEstudiantes.length === 0) && (
                    <div className="cardcontent">
                        <p>No tienes notificaciones recientes.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notificacionesss;
