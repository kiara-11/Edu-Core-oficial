'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './PublicarCurso.module.css';

interface Horario {
  dia: string;
  inicio: string;
  fin: string;
}

interface Leccion {
  titulo: string;
  descripcion: string;
  duracion: string;
}

interface Usuario {
  nombreCompleto: string;
  email: string;
}

interface FieldError {
  field: string;
  message: string;
}

export default function PublicarCurso() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [nombreCurso, setNombreCurso] = useState('');
  const [nivel, setNivel] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [resumen, setResumen] = useState('');
  const [queAprendere, setQueAprendere] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracion, setDuracion] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [materia, setMateria] = useState('');
  const [cantMinEstudiantes, setCantMinEstudiantes] = useState('');
  const [fotoCurso, setFotoCurso] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string>('');
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [diaTemp, setDiaTemp] = useState('');
  const [inicioTemp, setInicioTemp] = useState('');
  const [finTemp, setFinTemp] = useState('');
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [tituloLeccionTemp, setTituloLeccionTemp] = useState('');
  const [descripcionLeccionTemp, setDescripcionLeccionTemp] = useState('');
  const [duracionLeccionTemp, setDuracionLeccionTemp] = useState('');
  const [prerequisitos, setPrerequisitos] = useState<string[]>([]);
  const [prerequisitoTemp, setPrerequisito] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mostrarSolicitudEnviada, setMostrarSolicitudEnviada] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldError[]>([]);
  const formRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<{ [key: string]: HTMLElement }>({});

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

  const validarCampos = (): FieldError[] => {
    const errors: FieldError[] = [];
    if (!nombreCurso.trim()) errors.push({ field: 'nombreCurso', message: 'El nombre del curso es requerido' });
    if (!nivel) errors.push({ field: 'nivel', message: 'Debe seleccionar un nivel' });
    if (!descripcion.trim()) errors.push({ field: 'descripcion', message: 'La descripción completa es requerida' });
    if (!resumen.trim()) errors.push({ field: 'resumen', message: 'El resumen del curso es requerido' });
    if (!precio || parseFloat(precio) <= 0) errors.push({ field: 'precio', message: 'Debe ingresar un precio válido mayor a 0' });
    if (!duracion) errors.push({ field: 'duracion', message: 'Debe seleccionar la duración del curso' });
    if (!modalidad) errors.push({ field: 'modalidad', message: 'Debe seleccionar una modalidad' });
    if (!materia.trim()) errors.push({ field: 'materia', message: 'La materia es requerida' });
    if (horarios.length === 0) errors.push({ field: 'horarios', message: 'Debe agregar al menos un horario disponible' });
    return errors;
  };

  const scrollToFirstError = (errors: FieldError[]) => {
    if (errors.length > 0) {
      const firstError = errors[0];
      const element = fieldRefs.current[firstError.field];
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement) {
          setTimeout(() => element.focus(), 500);
        }
      }
    }
  };

  const manejarCambioFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMensaje('La imagen no debe superar los 5MB');
        return;
      }
      setFotoCurso(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const agregarHorario = () => {
    if (diaTemp && inicioTemp && finTemp) {
      if (finTemp <= inicioTemp) {
        setMensaje('La hora de fin debe ser posterior a la hora de inicio');
        return;
      }
      setHorarios([...horarios, { dia: diaTemp, inicio: inicioTemp, fin: finTemp }]);
      setDiaTemp('');
      setInicioTemp('');
      setFinTemp('');
      setMensaje('');
    }
  };

  const quitarHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const agregarLeccion = () => {
    if (tituloLeccionTemp && descripcionLeccionTemp && duracionLeccionTemp) {
      setLecciones([...lecciones, { 
        titulo: tituloLeccionTemp, 
        descripcion: descripcionLeccionTemp,
        duracion: duracionLeccionTemp
      }]);
      setTituloLeccionTemp('');
      setDescripcionLeccionTemp('');
      setDuracionLeccionTemp('');
    }
  };

  const quitarLeccion = (index: number) => {
    setLecciones(lecciones.filter((_, i) => i !== index));
  };

  const agregarPrerequisito = () => {
    if (prerequisitoTemp.trim() && !prerequisitos.includes(prerequisitoTemp.trim())) {
      setPrerequisitos([...prerequisitos, prerequisitoTemp.trim()]);
      setPrerequisito('');
    }
  };

  const quitarPrerequisito = (index: number) => {
    setPrerequisitos(prerequisitos.filter((_, i) => i !== index));
  };

  const publicarCurso = async () => {
    if (!usuario) {
      setMensaje('Error: No se pudo identificar el usuario');
      return;
    }

    const errors = validarCampos();
    if (errors.length > 0) {
      setFieldErrors(errors);
      setMensaje(`Por favor, complete los campos requeridos (${errors.length} campos faltantes)`);
      scrollToFirstError(errors);
      return;
    }

    setFieldErrors([]);
    setLoading(true);
    setMensaje('');

    const formData = new FormData();
    formData.append('nombreCompleto', usuario.nombreCompleto);
    formData.append('email', usuario.email);
    formData.append('nombreCurso', nombreCurso.trim());
    formData.append('nivel', nivel);
    formData.append('descripcion', descripcion.trim());
    formData.append('resumen', resumen.trim());
    formData.append('queAprendere', queAprendere.trim());
    formData.append('precio', precio);
    formData.append('duracion', duracion);
    formData.append('modalidad', modalidad);
    formData.append('materia', materia.trim());
    formData.append('cantMinEstudiantes', cantMinEstudiantes || '1');
    if (fotoCurso) formData.append('fotoCurso', fotoCurso);
    formData.append('horarios', JSON.stringify(horarios));
    formData.append('lecciones', JSON.stringify(lecciones));
    formData.append('prerequisitos', JSON.stringify(prerequisitos));

    try {
      const response = await fetch('/api/publicarcurso', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMostrarSolicitudEnviada(true);
        limpiarFormulario();
      } else {
        const result = await response.json();
        setMensaje(`Error: ${result.error || 'No se pudo publicar el curso'}`);
      }
    } catch (error) {
      console.error('Error completo:', error);
      setMensaje('Error de conexión. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setNombreCurso('');
    setNivel('');
    setDescripcion('');
    setResumen('');
    setQueAprendere('');
    setPrecio('');
    setDuracion('');
    setModalidad('');
    setMateria('');
    setCantMinEstudiantes('');
    setFotoCurso(null);
    setPreviewFoto('');
    setHorarios([]);
    setLecciones([]);
    setPrerequisitos([]);
    setMensaje('');
    setFieldErrors([]);
  };

  const cancelar = () => {
    if (window.confirm('¿Está seguro que desea cancelar? Se perderán todos los datos ingresados.')) {
      limpiarFormulario();
    }
  };

  const cerrarMensajeSolicitud = () => {
    setMostrarSolicitudEnviada(false);
  };

  const manejarEnterPrerequisito = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      agregarPrerequisito();
    }
  };

  const manejarEnterHorario = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      agregarHorario();
    }
  };

  const hasFieldError = (fieldName: string) => {
    return fieldErrors.some(error => error.field === fieldName);
  };

  const getFieldError = (fieldName: string) => {
    const error = fieldErrors.find(error => error.field === fieldName);
    return error?.message || '';
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
      <div className={styles.form} ref={formRef}>
        <h2 className={styles.title}>Publicar nuevo curso</h2>
        <div className={styles.userInfo}>
          <p><strong>Publicando como:</strong> {usuario.nombreCompleto} ({usuario.email})</p>
        </div>

        {mensaje && (
          <div className={`${styles.message} ${mensaje.includes('Error') ? styles.errorMessage : styles.successMessage}`}>
            {mensaje}
          </div>
        )}

        <div className={`${styles.formGroup} ${styles.requiredField}`}>
          <label className={styles.sectionTitle}>Imagen del curso</label>
          <div className={styles.fotoContainer}>
            <input
              type="file"
              accept="image/*"
              onChange={manejarCambioFoto}
              className={styles.fileInput}
              id="foto-curso"
            />
            <label htmlFor="foto-curso" className={`${styles.fileInputLabel} ${previewFoto ? styles.hasImage : ''}`}>
              {previewFoto ? '📷 Cambiar imagen' : '📷 Seleccionar imagen'}
            </label>
            {previewFoto && (
              <div className={styles.previewContainer}>
                <img src={previewFoto} alt="Vista previa del curso" className={styles.previewImage} />
                <div className={styles.imageOverlay}>
                  <span>✓ Imagen cargada</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <div className={styles.row}>
            <div className={`${styles.field} ${styles.requiredField}`}>
              <label>Nombre del curso</label>
              <input
                ref={el => { if (el) fieldRefs.current['nombreCurso'] = el; }}
                type="text"
                placeholder="Ingrese el nombre del curso"
                value={nombreCurso}
                onChange={(e) => setNombreCurso(e.target.value)}
                className={`${styles.input} ${hasFieldError('nombreCurso') ? styles.inputError : ''}`}
                required
                maxLength={100}
              />
              {hasFieldError('nombreCurso') && (
                <div className={styles.fieldError}>{getFieldError('nombreCurso')}</div>
              )}
            </div>
            <div className={`${styles.field} ${styles.requiredField}`}>
              <label>Nivel</label>
              <select
                ref={el => { if (el) fieldRefs.current['nivel'] = el; }}
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className={`${styles.select} ${hasFieldError('nivel') ? styles.inputError : ''}`}
                required
              >
                <option value="">Seleccionar nivel</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
              {hasFieldError('nivel') && (
                <div className={styles.fieldError}>{getFieldError('nivel')}</div>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={`${styles.field} ${styles.requiredField}`}>
              <label>Resumen del curso</label>
              <textarea
                ref={el => { if (el) fieldRefs.current['resumen'] = el; }}
                placeholder="Breve resumen que aparecerá en la tarjeta del curso"
                value={resumen}
                onChange={(e) => setResumen(e.target.value)}
                className={`${styles.textareaSmall} ${hasFieldError('resumen') ? styles.inputError : ''}`}
                maxLength={200}
                required
              />
              <small className={styles.charCounter}>{resumen.length}/200 caracteres</small>
              {hasFieldError('resumen') && (
                <div className={styles.fieldError}>{getFieldError('resumen')}</div>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={`${styles.field} ${styles.requiredField}`}>
              <label>Descripción completa del curso</label>
              <textarea
                ref={el => { if (el) fieldRefs.current['descripcion'] = el; }}
                placeholder="Descripción detallada del curso, objetivos y contenido"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className={`${styles.textarea} ${hasFieldError('descripcion') ? styles.inputError : ''}`}
                required
              />
              {hasFieldError('descripcion') && (
                <div className={styles.fieldError}>{getFieldError('descripcion')}</div>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>¿Qué aprenderé en este curso?</label>
              <textarea
                placeholder="Lista los conocimientos y habilidades que obtendrán los estudiantes"
                value={queAprendere}
                onChange={(e) => setQueAprendere(e.target.value)}
                className={styles.textarea}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={`${styles.field} ${styles.requiredField}`}>
              <label>Precio</label>
              <div className={styles.priceContainer}>
                <input
                  ref={el => { if (el) fieldRefs.current['precio'] = el; }}
                  type="number"
                  placeholder="250"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className={`${styles.priceInput} ${hasFieldError('precio') ? styles.inputError : ''}`}
                  min="1"
                  step="0.01"
                  required
                />
                <div className={styles.currency}>Bs.</div>
              </div>
              {hasFieldError('precio') && (
                <div className={styles.fieldError}>{getFieldError('precio')}</div>
              )}
            </div>
            <div className={`${styles.field} ${styles.requiredField}`}>
              <label>Duración del curso</label>
              <select
                ref={el => { if (el) fieldRefs.current['duracion'] = el; }}
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                className={`${styles.select} ${hasFieldError('duracion') ? styles.inputError : ''}`}
                required
              >
                <option value="">Seleccionar duración</option>
                <option value="20">20 horas</option>
                <option value="40">40 horas</option>
                <option value="60">60 horas</option>
                <option value="80">80 horas</option>
                <option value="100">100 horas</option>
              </select>
              {hasFieldError('duracion') && (
                <div className={styles.fieldError}>{getFieldError('duracion')}</div>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={`${styles.field} ${styles.requiredField}`}>
              <label>Modalidad</label>
              <select
                ref={el => { if (el) fieldRefs.current['modalidad'] = el; }}
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value)}
                className={`${styles.select} ${hasFieldError('modalidad') ? styles.inputError : ''}`}
                required
              >
                <option value="">Seleccionar modalidad</option>
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
                <option value="hibrido">Híbrido</option>
              </select>
              {hasFieldError('modalidad') && (
                <div className={styles.fieldError}>{getFieldError('modalidad')}</div>
              )}
            </div>
            <div className={`${styles.field} ${styles.requiredField}`}>
              <label>Materia</label>
              <input
                ref={el => { if (el) fieldRefs.current['materia'] = el; }}
                type="text"
                placeholder="Ej: Matemáticas, Programación, Inglés"
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                className={`${styles.input} ${hasFieldError('materia') ? styles.inputError : ''}`}
                required
                maxLength={50}
              />
              {hasFieldError('materia') && (
                <div className={styles.fieldError}>{getFieldError('materia')}</div>
              )}
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Cantidad mínima de estudiantes</label>
              <input
                type="number"
                placeholder="Ej: 5"
                value={cantMinEstudiantes}
                onChange={(e) => setCantMinEstudiantes(e.target.value)}
                className={styles.input}
                min="1"
                max="50"
              />
              <small className={styles.charCounter}>Dejar vacío si no hay mínimo</small>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Prerequisitos</h3>
          <div className={styles.addItemForm}>
            <div className={styles.addItemInputs}>
              <div className={styles.field}>
                <input
                  type="text"
                  placeholder="Ej: Conocimientos básicos de matemáticas"
                  value={prerequisitoTemp}
                  onChange={(e) => setPrerequisito(e.target.value)}
                  onKeyDown={manejarEnterPrerequisito}
                  className={styles.input}
                  maxLength={150}
                />
              </div>
              <button
                type="button"
                onClick={agregarPrerequisito}
                className={styles.addBtn}
                disabled={!prerequisitoTemp.trim()}
              >
                Agregar
              </button>
            </div>
          </div>
          
          {prerequisitos.length > 0 && (
            <div className={styles.itemsList}>
              {prerequisitos.map((prerequisito, index) => (
                <div key={index} className={styles.itemRow}>
                  <span>{prerequisito}</span>
                  <button
                    onClick={() => quitarPrerequisito(index)}
                    className={styles.removeBtn}
                    title="Eliminar prerequisito"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`${styles.section} ${styles.requiredField}`}>
          <h3 className={styles.sectionTitle}>Lecciones del curso</h3>
          <div className={styles.addItemForm}>
            <div className={styles.leccionInputs}>
              <div className={styles.field}>
                <label>Título</label>
                <input
                  type="text"
                  placeholder="Título de la lección"
                  value={tituloLeccionTemp}
                  onChange={(e) => setTituloLeccionTemp(e.target.value)}
                  className={styles.input}
                  maxLength={80}
                />
              </div>
              <div className={styles.field}>
                <label>Descripción</label>
                <input
                  type="text"
                  placeholder="Descripción breve"
                  value={descripcionLeccionTemp}
                  onChange={(e) => setDescripcionLeccionTemp(e.target.value)}
                  className={styles.input}
                  maxLength={200}
                />
              </div>
              <div className={styles.field}>
                <label>Duración</label>
                <input
                  type="number"
                  placeholder="Minutos"
                  value={duracionLeccionTemp}
                  onChange={(e) => setDuracionLeccionTemp(e.target.value)}
                  className={styles.input}
                  min="1"
                  max="480"
                />
              </div>
              <button
                type="button"
                onClick={agregarLeccion}
                className={styles.addBtn}
                disabled={!tituloLeccionTemp.trim() || !descripcionLeccionTemp.trim() || !duracionLeccionTemp}
              >
                Agregar
              </button>
            </div>
          </div>
          
          {lecciones.length > 0 && (
            <div className={styles.leccionesList}>
              {lecciones.map((leccion, index) => (
                <div key={index} className={styles.leccionItem}>
                  <div className={styles.leccionInfo}>
                    <h4>Lección {index + 1}: {leccion.titulo}</h4>
                    <p>{leccion.descripcion}</p>
                    <span className={styles.duracion}>{leccion.duracion} minutos</span>
                  </div>
                  <button
                    onClick={() => quitarLeccion(index)}
                    className={styles.removeBtn}
                    title="Eliminar lección"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`${styles.section} ${styles.requiredField}`} ref={el => { if (el) fieldRefs.current['horarios'] = el; }}>
          <h3 className={styles.sectionTitle}>Horarios disponibles</h3>
          
          <div className={styles.addItemForm}>
            <div className={styles.horarioInputs}>
              <div className={styles.field}>
                <label>Día</label>
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
                  <option value="sabado">Sábado</option>
                  <option value="domingo">Domingo</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>Hora inicio</label>
                <input
                  type="time"
                  value={inicioTemp}
                  onChange={(e) => setInicioTemp(e.target.value)}
                  onKeyDown={manejarEnterHorario}
                  className={styles.timeInput}
                />
              </div>
              <div className={styles.field}>
                <label>Hora fin</label>
                <input
                  type="time"
                  value={finTemp}
                  onChange={(e) => setFinTemp(e.target.value)}
                  onKeyDown={manejarEnterHorario}
                  className={styles.timeInput}
                />
              </div>
              <button
                type="button"
                onClick={agregarHorario}
                className={styles.addBtn}
                disabled={!diaTemp || !inicioTemp || !finTemp}
              >
                Agregar
              </button>
            </div>
          </div>

          {hasFieldError('horarios') && (
            <div className={styles.fieldError}>{getFieldError('horarios')}</div>
          )}

          {horarios.length > 0 && (
            <div className={styles.horariosTable}>
              <div className={styles.tableHeader}>
                <span>Día</span>
                <span>Inicio</span>
                <span>Fin</span>
                <span></span>
              </div>
              {horarios.map((horario, index) => (
                <div key={index} className={styles.tableRow}>
                  <span className={styles.capitalize}>{horario.dia}</span>
                  <span>{horario.inicio}</span>
                  <span>{horario.fin}</span>
                  <button
                    onClick={() => quitarHorario(index)}
                    className={styles.removeBtn}
                    title="Eliminar horario"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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