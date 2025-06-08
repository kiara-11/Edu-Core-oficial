'use client'; // This is a client component

import React, { useEffect, useState } from 'react';
import CardCheckNoti from './CardCheckNoti';
import CardCancelNoti from './CardCancelNoti';
import CardTimeNoti from './CardTimeNoti';
import './CardNoti.css';

// ✅ AGREGADO: Interface para el estado de solicitud
interface SolicitudStatus {
    status: string;
    motivo_rechazo?: string;
}

const Notificacionesss = () => {
    // ✅ MODIFICADO: Cambiar el tipo de estado para incluir motivo de rechazo
    const [estadoSolicitud, setEstadoSolicitud] = useState<SolicitudStatus | null>(null);
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
        const fetchUserApplicationStatus = async () => {
            if (localUserId === null) {
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/user-solicitud-status?userId=${localUserId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch application status.');
                }
                const data = await response.json();

                // ✅ MODIFICADO: Guardar tanto el status como el motivo de rechazo
                if (data.status) {
                    setEstadoSolicitud({
                        status: data.status,
                        motivo_rechazo: data.motivo_rechazo || undefined
                    });
                } else {
                    setEstadoSolicitud(null);
                }
            } catch (err) {
                console.error("Error fetching application status:", err);
                setError('Error al cargar el estado de la solicitud.');
                setEstadoSolicitud(null);
            } finally {
                setLoading(false);
            }
        };

        if (localUserId) {
            fetchUserApplicationStatus();
        }
    }, [localUserId]);

    const aceptarNotificacion = () => {
        console.log("Notificación pendiente reconocida.");
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

    if (!localUserId && !loading) {
        return (
            <div className="containernotif">
                <p className="notititl">Notificaciones</p>
                <div className="notifcards">
                    <div className="cardcontent">
                        <p>Inicia sesión para ver tus notificaciones.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="containernotif">
            <p className="notititl">Notificaciones</p>
            <div className="notifcards">
                {/* ✅ MODIFICADO: Actualizar las condiciones para usar el nuevo formato */}
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
                {/* ✅ MODIFICADO: Pasar el motivo de rechazo al componente */}
                {estadoSolicitud?.status === 'Rechazado' && (
                    <CardCancelNoti
                        titulo={mensajes.rechazado.titulo}
                        detalle={mensajes.rechazado.detalle}
                        motivoRechazo={estadoSolicitud.motivo_rechazo} // ✅ NUEVO: Pasar motivo
                        botonTexto={mensajes.rechazado.botonTexto}
                        botonLink={mensajes.rechazado.botonLink}
                    />
                )}
                {!estadoSolicitud && ( 
                    <div className="cardcontent">
                        <p>No tienes solicitudes de tutor pendientes ni finalizadas.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notificacionesss;