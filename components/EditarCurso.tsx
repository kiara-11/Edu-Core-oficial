'use client';

import { useState, useEffect } from 'react';
import styles from './PublicarCurso.module.css';

interface Horario {
  dia: string;
  inicio: string;
  fin: string;
}

interface Curso {
  Id_curso: number;
  Nombre: string;
  ApePat: string;
  ApeMat: string;
  email: string;
  nom_curso: string;
  discripcion: string;
  cant_est_min: number;
  precio: number;
  modalidad: string;
  nivel: string;
  nom_materia: string;
  horario: string;
}

interface EditarCursoProps {
  curso: Curso;
  onClose: () => void;
  onCursoEditado: () => void;
}

export default function EditarCurso({ curso, onClose, onCursoEditado }: EditarCursoProps) {
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
  const [error, setError] = useState('');

  // Cargar datos del curso al inicializar
  useEffect(() => {
    const cargarDatosCurso = async () => {
      try {
        setNombreCurso(curso.nom_curso);
        setNivel(curso.nivel);
        setDescripcion(curso.discripcion);
        setPrecio(curso.precio.toString());
        setModalidad(curso.modalidad);
        setMateria(curso.nom_materia);
        setCantMinEstudiantes(curso.cant_est_min ? curso.cant_est_min.toString() : '');

        // Cargar horarios completos del curso
        const responseHorarios = await fetch(`/api/cursos/${curso.Id_curso}/horarios`);
        
        // Verificar si la respuesta es JSON
        /*const contentType = responseHorarios.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await responseHorarios.text();
          throw new Error(text || 'Respuesta no válida del servidor');
        }*/

        const horariosData = await responseHorarios.json();
        
        if (!responseHorarios.ok) {
          throw new Error(horariosData.error || 'Error al cargar horarios');
        }

        const horariosFormateados = horariosData.map((h: any) => ({
          dia: h.dia,
          inicio: h.fe_inicio ? new Date(h.fe_inicio).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '',
          fin: h.fe_fin ? new Date(h.fe_fin).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : ''
        }));
        setHorarios(horariosFormateados);

        // Cargar otros datos completos del curso si es necesario
        const responseCurso = await fetch(`/api/cursos/${curso.Id_curso}`);
        
        // Verificar si la respuesta es JSON
       /* const contentTypeCurso = responseCurso.headers.get('content-type');
        if (!contentTypeCurso || !contentTypeCurso.includes('application/json')) {
          const text = await responseCurso.text();
          throw new Error(text || 'Respuesta no válida del servidor');
        }*/

        const cursoCompleto = await responseCurso.json();
        
        if (!responseCurso.ok) {
          throw new Error(cursoCompleto.error || 'Error al cargar datos del curso');
        }

        setDuracion(cursoCompleto.duracion || '');
      } catch (error) {
        console.error('Error cargando datos del curso:', error);
        //setError(error.message || 'Error al cargar datos del curso');
      }
    };

    cargarDatosCurso();
  }, [curso]);

  const agregarHorario = () => {
    if (diaTemp && inicioTemp && finTemp) {
      setHorarios([...horarios, { dia: diaTemp, inicio: inicioTemp, fin: finTemp }]);
      setDiaTemp('');
      setInicioTemp('');
      setFinTemp('');
    } else {
      setError('Debe completar todos los campos del horario');
    }
  };

  const quitarHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const editarCurso = async () => {
    setError('');
    
    if (!nombreCurso || !nivel || !descripcion || !precio || !modalidad || !materia) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    if (horarios.length === 0) {
      setError('Debe agregar al menos un horario');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // Datos básicos
      formData.append('nombreCompleto', `${curso.Nombre} ${curso.ApePat} ${curso.ApeMat}`);
      formData.append('email', curso.email);
      formData.append('nombreCurso', nombreCurso);
      formData.append('nivel', nivel);
      formData.append('descripcion', descripcion);
      formData.append('precio', precio);
      formData.append('duracion', duracion);
      formData.append('modalidad', modalidad);
      formData.append('materia', materia);
      if (cantMinEstudiantes) {
        formData.append('cantMinEstudiantes', cantMinEstudiantes);
      }
      
      // Horarios
      formData.append('horarios', JSON.stringify(horarios));
      
      const response = await fetch(`/api/cursos/${curso.Id_curso}`, {
        method: 'PUT',
        body: formData,
      });

      // Verificar si la respuesta es JSON
     /* const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || 'Respuesta no válida del servidor');
      }*/

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar el curso');
      }

      alert('Curso actualizado exitosamente');
      onCursoEditado();
    } catch (error) {
      console.error('Error editando curso:', error);
      //setError(error.message || 'Error al actualizar el curso. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const cancelar = () => {
    onClose();
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.formGroup}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre del curso:</label>
              <input
                type="text"
                placeholder="Nombre del curso"
                value={nombreCurso}
                onChange={(e) => setNombreCurso(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label>Nivel:</label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className={styles.select}
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
              <label>Descripción del curso:</label>
              <textarea
                placeholder="Descripción del curso"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className={styles.textarea}
              />
            </div>
            <div className={styles.field}>
              <label>Precio:</label>
              <div className={styles.priceContainer}>
                <input
                  type="number"
                  placeholder="250"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className={styles.priceInput}
                />
                <select className={styles.currency}>
                  <option value="bs">Bs.</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Duración del curso:</label>
              <select
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                className={styles.select}
              >
                <option value="">Seleccionar duración</option>
                <option value="20">20 horas</option>
                <option value="40">40 horas</option>
                <option value="60">60 horas</option>
                <option value="80">80 horas</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Modalidad:</label>
              <select
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value)}
                className={styles.select}
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
              <label>Materia:</label>
              <input
                type="text"
                placeholder="Materia del curso"
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label>Cantidad mínima de estudiantes:</label>
              <input
                type="number"
                placeholder="Opcional"
                value={cantMinEstudiantes}
                onChange={(e) => setCantMinEstudiantes(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <h3 className={styles.horariosTitle}>Horarios disponibles</h3>
        
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
                <option value="sabado">Sábado</option>
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
            onClick={editarCurso}
            className={styles.publicarBtn}
            disabled={loading}
          >
            {loading ? 'ACTUALIZANDO...' : 'ACTUALIZAR CURSO'}
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
    </div>
  );
}