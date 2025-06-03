'use client';

import { useState, useEffect } from 'react';
import styles from './PublicarCurso.module.css';

interface Horario {
  dia: string;
  inicio: string;
  fin: string;
}

interface Usuario {
  nombreCompleto: string;
  email: string;
}

export default function PublicarCurso() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nombreCurso, setNombreCurso] = useState('');
  const [nivel, setNivel] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracion, setDuracion] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [materia, setMateria] = useState('');
  const [cantMinEstudiantes, setCantMinEstudiantes] = useState('');
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [diaTemp, setDiaTemp] = useState('');
  const [inicioTemp, setInicioTemp] = useState('');
  const [finTemp, setFinTemp] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mostrarSolicitudEnviada, setMostrarSolicitudEnviada] = useState(false);

  // Extraer usuario del localStorage al cargar el componente
  useEffect(() => {
    try {
      const nombreCompleto = localStorage.getItem('nombreCompleto');
      const email = localStorage.getItem('email');
      
      if (nombreCompleto && email) {
        setUsuario({
          nombreCompleto: nombreCompleto,
          email: email
        });
      } else {
        // Intentar extraer de otras fuentes posibles
        const usuarioString = localStorage.getItem('usuario');
        if (usuarioString) {
          const usuarioData = JSON.parse(usuarioString);
          if (usuarioData.nombre && usuarioData.correo) {
            setUsuario({
              nombreCompleto: usuarioData.nombre,
              email: usuarioData.correo
            });
          }
        }
      }
    } catch (error) {
      console.error('Error extrayendo datos del usuario:', error);
    }
  }, []);

  const agregarHorario = () => {
    if (diaTemp && inicioTemp && finTemp) {
      setHorarios([...horarios, { dia: diaTemp, inicio: inicioTemp, fin: finTemp }]);
      setDiaTemp('');
      setInicioTemp('');
      setFinTemp('');
    }
  };

  const quitarHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const publicarCurso = async () => {
    if (!usuario) {
      setMensaje('Error: No se pudo identificar el usuario');
      return;
    }

    // Validar campos requeridos
    if (!nombreCurso || !nivel || !descripcion || !precio || !duracion || !modalidad || !materia || horarios.length === 0) {
      setMensaje('Por favor, complete todos los campos requeridos');
      return;
    }

    setLoading(true);
    setMensaje('');

    const cursoData = {
      nombreCompleto: usuario.nombreCompleto,
      email: usuario.email,
      nombreCurso,
      nivel,
      descripcion,
      precio: parseInt(precio),
      duracion: parseInt(duracion),
      modalidad,
      materia,
      cantMinEstudiantes: cantMinEstudiantes ? parseInt(cantMinEstudiantes) : null,
      horarios
    };

    try {
      console.log('Enviando datos:', cursoData); // Para debug
      
      const response = await fetch('/api/publicarcurso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cursoData),
      });

      console.log('Response status:', response.status); // Para debug
      console.log('Response headers:', response.headers.get('content-type')); // Para debug

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Respuesta no es JSON:', textResponse);
        setMensaje('Error del servidor. Revisa la consola para más detalles.');
        return;
      }

      const result = await response.json();

      if (response.ok) {
        // Mostrar mensaje de solicitud enviada en lugar del mensaje de éxito simple
        setMostrarSolicitudEnviada(true);
        // Limpiar formulario
        limpiarFormulario();
      } else {
        setMensaje(`Error: ${result.error || 'No se pudo publicar el curso'}`);
      }
    } catch (error) {
      console.error('Error completo:', error);
      setMensaje('Error de conexión. Revisa la consola del navegador.');
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setNombreCurso('');
    setNivel('');
    setDescripcion('');
    setPrecio('');
    setDuracion('');
    setModalidad('');
    setMateria('');
    setCantMinEstudiantes('');
    setHorarios([]);
    setMensaje('');
  };

  const cancelar = () => {
    limpiarFormulario();
  };

  const cerrarMensajeSolicitud = () => {
    setMostrarSolicitudEnviada(false);
  };

  if (!usuario) {
    return (
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.errorMessage}>
            No se pudo cargar la información del usuario. Por favor, inicie sesión nuevamente.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2 className={styles.title}>Publicar nuevo curso</h2>
        
        {/* Información del usuario */}
        <div className={styles.userInfo}>
          <p><strong>Publicando como:</strong> {usuario.nombreCompleto} ({usuario.email})</p>
        </div>

        {mensaje && (
          <div className={`${styles.message} ${mensaje.includes('Error') ? styles.errorMessage : styles.successMessage}`}>
            {mensaje}
          </div>
        )}
        
        <div className={styles.formGroup}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre del curso: <span className={styles.required}>*</span></label>
              <input
                type="text"
                placeholder="Nombre del curso"
                value={nombreCurso}
                onChange={(e) => setNombreCurso(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Nivel: <span className={styles.required}>*</span></label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Seleccionar nivel</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Descripción del curso: <span className={styles.required}>*</span></label>
              <textarea
                placeholder="Descripción del curso"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className={styles.textarea}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Precio: <span className={styles.required}>*</span></label>
              <div className={styles.priceContainer}>
                <input
                  type="number"
                  placeholder="250"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className={styles.priceInput}
                  min="0"
                  required
                />
                <select className={styles.currency}>
                  <option value="bs">Bs.</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Duración del curso (horas): <span className={styles.required}>*</span></label>
              <select
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Seleccionar duración</option>
                <option value="20">20 horas</option>
                <option value="40">40 horas</option>
                <option value="60">60 horas</option>
                <option value="80">80 horas</option>
                <option value="100">100 horas</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Modalidad: <span className={styles.required}>*</span></label>
              <select
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Seleccionar modalidad</option>
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Materia: <span className={styles.required}>*</span></label>
              <input
                type="text"
                placeholder="Ej: Matemáticas, Programación, Inglés"
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.field}>
              <label>Cantidad mínima de estudiantes:</label>
              <input
                type="number"
                placeholder="Ej: 5"
                value={cantMinEstudiantes}
                onChange={(e) => setCantMinEstudiantes(e.target.value)}
                className={styles.input}
                min="1"
              />
            </div>
          </div>
        </div>

        <h3 className={styles.horariosTitle}>Horarios disponibles <span className={styles.required}>*</span></h3>
        
        <div className={styles.horarioForm}>
          <div className={styles.horarioInputs}>
            <div className={styles.horarioField}>
              <label>Día:</label>
              <select
                value={diaTemp}
                onChange={(e) => setDiaTemp(e.target.value)}
                className={styles.select}
              >
                <option value="">Seleccionar día</option>
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miercoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
                <option value="Sábados">Sábado</option>
                <option value="domingo">Domingo</option>
              </select>
            </div>
            <div className={styles.horarioField}>
              <label>Horario de inicio:</label>
              <input
                type="time"
                value={inicioTemp}
                onChange={(e) => setInicioTemp(e.target.value)}
                className={styles.timeInput}
              />
            </div>
            <div className={styles.horarioField}>
              <label>Horario de finalización:</label>
              <input
                type="time"
                value={finTemp}
                onChange={(e) => setFinTemp(e.target.value)}
                className={styles.timeInput}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={agregarHorario}
            className={styles.agregarBtn}
            disabled={!diaTemp || !inicioTemp || !finTemp}
          >
            AGREGAR HORARIO
          </button>
        </div>

        {horarios.length > 0 && (
          <div className={styles.horariosTable}>
            <div className={styles.tableHeader}>
              <span>Día</span>
              <span>Horario de inicio:</span>
              <span>Horario de finalización:</span>
              <span></span>
            </div>
            {horarios.map((horario, index) => (
              <div key={index} className={styles.tableRow}>
                <span>{horario.dia}</span>
                <span>{horario.inicio}</span>
                <span>{horario.fin}</span>
                <button
                  onClick={() => quitarHorario(index)}
                  className={styles.quitarBtn}
                >
                  Quitar 🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={publicarCurso}
            className={styles.publicarBtn}
            disabled={loading}
          >
            {loading ? 'PUBLICANDO...' : 'PUBLICAR CURSO'}
          </button>
          <button
            type="button"
            onClick={cancelar}
            className={styles.cancelarBtn}
            disabled={loading}
          >
            CANCELAR
          </button>
        </div>
      </div>

      {/* Mensaje de solicitud enviada */}
      {mostrarSolicitudEnviada && (
        <div className={styles.solicitudEnviadaOverlay}>
          <div className={styles.solicitudEnviadaContainer}>
            <div className={styles.iconoContainer}>
              <div className={styles.iconoCheck}>
                <span className={styles.checkMark}>✓</span>
              </div>
            </div>
            <p className={styles.mensajeTexto}>
             Su curso ha sido publicado exitosamente y será revisado por nuestro equipo.
            </p>
            <button 
              onClick={cerrarMensajeSolicitud}
              className={styles.cerrarBtn}
            >
              CONTINUAR
            </button>
          </div>
        </div>
      )}
    </div>
  );
}