'use client';

import { useState, useEffect } from 'react';
import styles from './EditarCurso.module.css';

interface Horario {
  dia: string;
  inicio: string;
  fin: string;
}

interface Leccion {
  titulo: string;
  descripcion: string;
  duracion: number;
}

interface Prerequisito {
  descripcion: string;
}

interface Curso {
  Id_curso: number;
  Nombre: string;
  ApePat: string;
  ApeMat: string;
  email: string;
  nom_curso: string;
  discripcion: string;
  resumen?: string;
  que_aprendere?: string;
  cant_est_min: number;
  precio: number;
  modalidad: string;
  nivel: string;
  nom_materia: string;
  horario: string;
  foto_curso?: string;
  Id_nivel?: number;
  Id_mod?: number;
  Id_materia?: number;
}

interface EditarCursoProps {
  curso: Curso;
  onClose: () => void;
  onCursoEditado: () => void;
}

export default function EditarCurso({ curso, onClose, onCursoEditado }: EditarCursoProps) {
  // Estados para el formulario
  const [formData, setFormData] = useState({
    nombreCurso: '',
    nivel: '',
    descripcion: '',
    resumen: '',
    queAprendere: '',
    precio: '',
    duracion: '',
    modalidad: '',
    materia: '',
    cantMinEstudiantes: ''
  });

  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [prerequisitos, setPrerequisitos] = useState<Prerequisito[]>([]);
  
  // Estados temporales para agregar elementos
  const [horarioTemp, setHorarioTemp] = useState({ dia: '', inicio: '', fin: '' });
  const [leccionTemp, setLeccionTemp] = useState({ titulo: '', descripcion: '', duracion: 0 });
  const [prerequisitoTemp, setPrerequisitoTemp] = useState({ descripcion: '' });
  
  const [fotoCurso, setFotoCurso] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Opciones para los selectores
  const nivelesOptions = [
    { value: '1', label: 'Principiante' },
    { value: '2', label: 'Intermedio' },
    { value: '3', label: 'Avanzado' }
  ];

  const modalidadesOptions = [
    { value: '1', label: 'Online' },
    { value: '2', label: 'Presencial' },
    { value: '3', label: 'Híbrido' }
  ];

  const diasSemana = [
    'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  // Cargar datos del curso al inicializar
  useEffect(() => {
    const cargarDatosCurso = async () => {
      try {
        setLoading(true);
        
        // Cargar datos básicos del curso
        setFormData({
          nombreCurso: curso.nom_curso || '',
          nivel: curso.Id_nivel?.toString() || '',
          descripcion: curso.discripcion || '',
          resumen: curso.resumen || '',
          queAprendere: curso.que_aprendere || '',
          precio: curso.precio?.toString() || '',
          duracion: '',
          modalidad: curso.Id_mod?.toString() || '',
          materia: curso.nom_materia || '',
          cantMinEstudiantes: curso.cant_est_min?.toString() || ''
        });

        // Cargar datos completos del curso desde la API
        const response = await fetch(`/api/cursos?id=${curso.Id_curso}`);
        
        if (!response.ok) {
          throw new Error('Error al cargar datos del curso');
        }

        const data = await response.json();
        
        // Cargar horarios
        if (data.horarios) {
          const horariosFormateados = data.horarios.map((h: any) => ({
            dia: h.dia,
            inicio: h.fe_inicio ? new Date(h.fe_inicio).toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }) : '',
            fin: h.fe_fin ? new Date(h.fe_fin).toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }) : ''
          }));
          setHorarios(horariosFormateados);
        }

        // Cargar lecciones
        if (data.lecciones) {
          setLecciones(data.lecciones.map((l: any) => ({
            titulo: l.titulo_leccion,
            descripcion: l.descripcion_leccion || '',
            duracion: l.duracion_minutos || 0
          })));
        }

        // Cargar prerequisitos
        if (data.prerequisitos) {
          setPrerequisitos(data.prerequisitos.map((p: any) => ({
            descripcion: p.descripcion_prerequisito
          })));
        }

      } catch (error) {
        console.error('Error cargando datos del curso:', error);
        setError('Error al cargar datos del curso');
      } finally {
        setLoading(false);
      }
    };

    if (curso.Id_curso) {
      cargarDatosCurso();
    }
  }, [curso]);

  // Manejar cambios en el formulario
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Funciones para manejar horarios
  const agregarHorario = () => {
    if (horarioTemp.dia && horarioTemp.inicio && horarioTemp.fin) {
      if (horarioTemp.inicio >= horarioTemp.fin) {
        setError('La hora de inicio debe ser menor que la hora de fin');
        return;
      }
      
      setHorarios([...horarios, { ...horarioTemp }]);
      setHorarioTemp({ dia: '', inicio: '', fin: '' });
      setError('');
    } else {
      setError('Debe completar todos los campos del horario');
    }
  };

  const quitarHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  // Funciones para manejar lecciones
  const agregarLeccion = () => {
    if (leccionTemp.titulo.trim()) {
      setLecciones([...lecciones, { ...leccionTemp }]);
      setLeccionTemp({ titulo: '', descripcion: '', duracion: 0 });
    } else {
      setError('Debe ingresar un título para la lección');
    }
  };

  const quitarLeccion = (index: number) => {
    setLecciones(lecciones.filter((_, i) => i !== index));
  };

  // Funciones para manejar prerequisitos
  const agregarPrerequisito = () => {
    if (prerequisitoTemp.descripcion.trim()) {
      setPrerequisitos([...prerequisitos, { ...prerequisitoTemp }]);
      setPrerequisitoTemp({ descripcion: '' });
    } else {
      setError('Debe ingresar una descripción para el prerequisito');
    }
  };

  const quitarPrerequisito = (index: number) => {
    setPrerequisitos(prerequisitos.filter((_, i) => i !== index));
  };

  // Validar formulario
  const validarFormulario = () => {
    const { nombreCurso, nivel, descripcion, precio, modalidad, materia } = formData;
    
    if (!nombreCurso || !nivel || !descripcion || !precio || !modalidad || !materia) {
      setError('Por favor completa todos los campos obligatorios');
      return false;
    }

    if (horarios.length === 0) {
      setError('Debe agregar al menos un horario');
      return false;
    }

    const precioNum = parseFloat(precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      setError('El precio debe ser un número válido mayor a 0');
      return false;
    }

    return true;
  };

  // Actualizar curso
  const actualizarCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      
      // Datos básicos
      formDataToSend.append('nombreCompleto', `${curso.Nombre} ${curso.ApePat} ${curso.ApeMat}`);
      formDataToSend.append('email', curso.email);
      formDataToSend.append('nombreCurso', formData.nombreCurso);
      formDataToSend.append('nivel', formData.nivel);
      formDataToSend.append('descripcion', formData.descripcion);
      formDataToSend.append('precio', formData.precio);
      formDataToSend.append('modalidad', formData.modalidad);
      formDataToSend.append('materia', formData.materia);
      
      // Datos opcionales
      if (formData.resumen) formDataToSend.append('resumen', formData.resumen);
      if (formData.queAprendere) formDataToSend.append('queAprendere', formData.queAprendere);
      if (formData.cantMinEstudiantes) formDataToSend.append('cantMinEstudiantes', formData.cantMinEstudiantes);
      if (formData.duracion) formDataToSend.append('duracion', formData.duracion);
      
      // Arrays como JSON
      formDataToSend.append('horarios', JSON.stringify(horarios));
      formDataToSend.append('lecciones', JSON.stringify(lecciones));
      formDataToSend.append('prerequisitos', JSON.stringify(prerequisitos));
      
      // Foto del curso
      if (fotoCurso) {
        formDataToSend.append('fotoCurso', fotoCurso);
      }
      
      const response = await fetch(`/api/cursos?id=${curso.Id_curso}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar el curso');
      }

      alert('Curso actualizado exitosamente');
      onCursoEditado();
      onClose();

    } catch (error) {
      console.error('Error actualizando curso:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar el curso');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.nombreCurso) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando datos del curso...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={actualizarCurso} className={styles.form}>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        
        {/* Información básica */}
        <div className={styles.formGroup}>
          <h3 className={styles.sectionTitle}>Información Básica</h3>
          
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="nombreCurso">Nombre del curso *</label>
              <input
                id="nombreCurso"
                type="text"
                placeholder="Nombre del curso"
                value={formData.nombreCurso}
                onChange={(e) => handleInputChange('nombreCurso', e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="nivel">Nivel *</label>
              <select
                id="nivel"
                value={formData.nivel}
                onChange={(e) => handleInputChange('nivel', e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Seleccionar nivel</option>
                {nivelesOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="descripcion">Descripción del curso *</label>
              <textarea
                id="descripcion"
                placeholder="Descripción del curso"
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                className={styles.textarea}
                rows={3}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="precio">Precio *</label>
              <div className={styles.priceContainer}>
                <input
                  id="precio"
                  type="number"
                  placeholder="250"
                  value={formData.precio}
                  onChange={(e) => handleInputChange('precio', e.target.value)}
                  className={styles.priceInput}
                  min="0"
                  step="0.01"
                  required
                />
                <span className={styles.currency}>Bs.</span>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="modalidad">Modalidad *</label>
              <select
                id="modalidad"
                value={formData.modalidad}
                onChange={(e) => handleInputChange('modalidad', e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Seleccionar modalidad</option>
                {modalidadesOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label htmlFor="materia">Materia *</label>
              <input
                id="materia"
                type="text"
                placeholder="Materia del curso"
                value={formData.materia}
                onChange={(e) => handleInputChange('materia', e.target.value)}
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="cantMinEstudiantes">Cantidad mínima de estudiantes</label>
              <input
                id="cantMinEstudiantes"
                type="number"
                placeholder="Opcional"
                value={formData.cantMinEstudiantes}
                onChange={(e) => handleInputChange('cantMinEstudiantes', e.target.value)}
                className={styles.input}
                min="1"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="duracion">Duración del curso</label>
              <select
                id="duracion"
                value={formData.duracion}
                onChange={(e) => handleInputChange('duracion', e.target.value)}
                className={styles.select}
              >
                <option value="">Seleccionar duración</option>
                <option value="20">20 horas</option>
                <option value="40">40 horas</option>
                <option value="60">60 horas</option>
                <option value="80">80 horas</option>
                <option value="100">100 horas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className={styles.formGroup}>
          <h3 className={styles.sectionTitle}>Información Adicional</h3>
          
          <div className={styles.field}>
            <label htmlFor="resumen">Resumen del curso</label>
            <textarea
              id="resumen"
              placeholder="Resumen breve del curso"
              value={formData.resumen}
              onChange={(e) => handleInputChange('resumen', e.target.value)}
              className={styles.textarea}
              rows={2}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="queAprendere">¿Qué aprenderán los estudiantes?</label>
            <textarea
              id="queAprendere"
              placeholder="Describe qué conocimientos y habilidades adquirirán los estudiantes"
              value={formData.queAprendere}
              onChange={(e) => handleInputChange('queAprendere', e.target.value)}
              className={styles.textarea}
              rows={4}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="fotoCurso">Foto del curso</label>
            <input
              id="fotoCurso"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => setFotoCurso(e.target.files?.[0] || null)}
              className={styles.fileInput}
            />
            <small className={styles.helpText}>
              Formatos permitidos: JPG, JPEG, PNG, WEBP. Tamaño máximo: 5MB
            </small>
          </div>
        </div>

        {/* Horarios */}
        <div className={styles.formGroup}>
          <h3 className={styles.sectionTitle}>Horarios *</h3>
          
          <div className={styles.horarioForm}>
            <div className={styles.horarioInputs}>
              <div className={styles.horarioField}>
                <label htmlFor="dia">Día</label>
                <select
                  id="dia"
                  value={horarioTemp.dia}
                  onChange={(e) => setHorarioTemp({...horarioTemp, dia: e.target.value})}
                  className={styles.select}
                >
                  <option value="">Seleccionar día</option>
                  {diasSemana.map(dia => (
                    <option key={dia} value={dia}>
                      {dia}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.horarioField}>
                <label htmlFor="inicio">Hora de inicio</label>
                <input
                  id="inicio"
                  type="time"
                  value={horarioTemp.inicio}
                  onChange={(e) => setHorarioTemp({...horarioTemp, inicio: e.target.value})}
                  className={styles.timeInput}
                />
              </div>
              <div className={styles.horarioField}>
                <label htmlFor="fin">Hora de fin</label>
                <input
                  id="fin"
                  type="time"
                  value={horarioTemp.fin}
                  onChange={(e) => setHorarioTemp({...horarioTemp, fin: e.target.value})}
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
            <div className={styles.itemsTable}>
              <div className={styles.tableHeader}>
                <span>Día</span>
                <span>Inicio</span>
                <span>Fin</span>
                <span>Acciones</span>
              </div>
              {horarios.map((horario, index) => (
                <div key={index} className={styles.tableRow}>
                  <span>{horario.dia}</span>
                  <span>{horario.inicio}</span>
                  <span>{horario.fin}</span>
                  <button
                    type="button"
                    onClick={() => quitarHorario(index)}
                    className={styles.quitarBtn}
                  >
                    Quitar 🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lecciones */}
        <div className={styles.formGroup}>
          <h3 className={styles.sectionTitle}>Lecciones</h3>
          
          <div className={styles.leccionForm}>
            <div className={styles.leccionInputs}>
              <div className={styles.field}>
                <label htmlFor="tituloLeccion">Título de la lección</label>
                <input
                  id="tituloLeccion"
                  type="text"
                  placeholder="Título de la lección"
                  value={leccionTemp.titulo}
                  onChange={(e) => setLeccionTemp({...leccionTemp, titulo: e.target.value})}
                  className={styles.input}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="descripcionLeccion">Descripción</label>
                <textarea
                  id="descripcionLeccion"
                  placeholder="Descripción de la lección"
                  value={leccionTemp.descripcion}
                  onChange={(e) => setLeccionTemp({...leccionTemp, descripcion: e.target.value})}
                  className={styles.textarea}
                  rows={2}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="duracionLeccion">Duración (minutos)</label>
                <input
                  id="duracionLeccion"
                  type="number"
                  placeholder="60"
                  value={leccionTemp.duracion}
                  onChange={(e) => setLeccionTemp({...leccionTemp, duracion: parseInt(e.target.value) || 0})}
                  className={styles.input}
                  min="0"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={agregarLeccion}
              className={styles.agregarBtn}
            >
              AGREGAR LECCIÓN
            </button>
          </div>

          {lecciones.length > 0 && (
            <div className={styles.itemsTable}>
              <div className={styles.tableHeader}>
                <span>Título</span>
                <span>Descripción</span>
                <span>Duración</span>
                <span>Acciones</span>
              </div>
              {lecciones.map((leccion, index) => (
                <div key={index} className={styles.tableRow}>
                  <span>{leccion.titulo}</span>
                  <span>{leccion.descripcion || 'Sin descripción'}</span>
                  <span>{leccion.duracion} min</span>
                  <button
                    type="button"
                    onClick={() => quitarLeccion(index)}
                    className={styles.quitarBtn}
                  >
                    Quitar 🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Prerequisitos */}
        <div className={styles.formGroup}>
          <h3 className={styles.sectionTitle}>Prerequisitos</h3>
          
          <div className={styles.prerequisitoForm}>
            <div className={styles.field}>
              <label htmlFor="prerequisito">Prerequisito</label>
              <input
                id="prerequisito"
                type="text"
                placeholder="Describe un prerequisito del curso"
                value={prerequisitoTemp.descripcion}
                onChange={(e) => setPrerequisitoTemp({descripcion: e.target.value})}
                className={styles.input}
              />
            </div>
            <button
              type="button"
              onClick={agregarPrerequisito}
              className={styles.agregarBtn}
            >
              AGREGAR PREREQUISITO
            </button>
          </div>

          {prerequisitos.length > 0 && (
            <div className={styles.itemsTable}>
              <div className={styles.tableHeader}>
                <span>Prerequisito</span>
                <span>Acciones</span>
              </div>
              {prerequisitos.map((prerequisito, index) => (
                <div key={index} className={styles.tableRow}>
                  <span>{prerequisito.descripcion}</span>
                  <button
                    type="button"
                    onClick={() => quitarPrerequisito(index)}
                    className={styles.quitarBtn}
                  >
                    Quitar 🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.publicarBtn}
            disabled={loading}
          >
            {loading ? 'ACTUALIZANDO...' : 'ACTUALIZAR CURSO'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className={styles.cancelarBtn}
            disabled={loading}
          >
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  );
}