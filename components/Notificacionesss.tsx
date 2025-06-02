'use client';

import React, { useEffect, useState } from 'react';
import CardCheckNoti from './CardCheckNoti';
import CardCancelNoti from './CardCancelNoti';
import CardTimeNoti from './CardTimeNoti';
import './CardNoti.css';

const Notificacionesss = () => {
  const [estadoSolicitud, setEstadoSolicitud] = useState<string | null>(null);
  const [pendiente, setPendiente] = useState(false);

  useEffect(() => {
    const pendienteLocal = localStorage.getItem('solicitudTutorPendiente');
    const estadoLocal = localStorage.getItem('solicitudTutorEstado');
    setPendiente(pendienteLocal === 'true');
    setEstadoSolicitud(estadoLocal);
  }, []);

  const aceptarNotificacion = () => {
    // Acción que "acepta" la notificación pendiente, por ejemplo:
    // Marcar como ya no pendiente para ocultarla
    localStorage.setItem('solicitudTutorPendiente', 'false');
    setPendiente(false);
  };

  // Mensajes dinámicos para mostrar en las tarjetas
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
      botonLink: '' // no se usa ahora
    }
  };

  return (
    <div className="containernotif">
      <p className="notititl">Notificaciones</p>
      <div className="notifcards">
        {pendiente && (
          <CardTimeNoti
            titulo={mensajes.pendiente.titulo}
            detalle={mensajes.pendiente.detalle}
            botonTexto={mensajes.pendiente.botonTexto}
            onBotonClick={aceptarNotificacion}
          />
        )}
        {!pendiente && estadoSolicitud === 'Aprobado' && (
          <CardCheckNoti
            titulo={mensajes.aprobado.titulo}
            detalle={mensajes.aprobado.detalle}
            botonTexto={mensajes.aprobado.botonTexto}
            botonLink={mensajes.aprobado.botonLink}
          />
        )}
        {!pendiente && estadoSolicitud === 'Rechazado' && (
          <CardCancelNoti
            titulo={mensajes.rechazado.titulo}
            detalle={mensajes.rechazado.detalle}
            botonTexto={mensajes.rechazado.botonTexto}
            botonLink={mensajes.rechazado.botonLink}
          />
        )}
        {!pendiente && !estadoSolicitud && (
          <div className="cardcontent">
            <p>No tienes solicitudes pendientes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notificacionesss;
