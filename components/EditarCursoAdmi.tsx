'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import styles from './EditarCurso.module.css';

interface Curso {
  Id_curso: number;
  nom_curso: string;
  discripcion: string;
  precio: number;
  Id_mod?: number;
  Id_nivel?: number;
  Id_materia?: number;
  nom_materia?: string;
  cant_est_min: number;
  resumen?: string;
  que_aprendere?: string;
  horario?: string;
  modalidad?: string;
  nivel?: string;
  Id_tutor?: number;
  tutor_nombre?: string;
  tutor_apellidos?: string;
  tutor_email?: string;
}

interface Tutor {
  Id_user: number;
  Nombre: string;
  ApePat: string;
  ApeMat: string;
  email: string;
}

export default function EditarCursoAdmi({ 
  cursoId, 
  tutores,
  onClose, 
  onCursoEditado 
}: {
  cursoId: number;
  tutores: Tutor[];
  onClose: () => void;
  onCursoEditado: () => void;
}) {
  const [curso, setCurso] = useState<Curso | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombreCurso: '',
    descripcion: '',
    precio: '',
    modalidad: '',
    nivel: '',
    materiaNombre: '',
    cantMinEstudiantes: '',
    resumen: '',
    queAprendere: '',
    horario: '',
    dia: '',
    horaInicio: '',
    horaFin: '',
    tutorId: ''
  });

  const parseHorario = (horarioString: string | null | undefined) => {
    if (!horarioString || horarioString.trim() === '') {
      return { dia: '', horaInicio: '', horaFin: '' };
    }
    
    const horarioLimpio = horarioString.trim();
    const patrones = [
      /^(.+?),\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/i,
      /^(.+?)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/i,
      /^(.+?):\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/i
    ];
    
    for (const patron of patrones) {
      const match = horarioLimpio.match(patron);
      if (match) {
        return {
          dia: match[1].trim(),
          horaInicio: match[2],
          horaFin: match[3]
        };
      }
    }
    
    return { dia: '', horaInicio: '', horaFin: '' };
  };

  const construirHorario = (dia: string, horaInicio: string, horaFin: string) => {
    if (dia && horaInicio && horaFin) {
      return `${dia}, ${horaInicio} - ${horaFin}`;
    }
    return '';
  };

  const obtenerModalidad = (idMod: number | undefined) => {
    switch(idMod) {
      case 1: return 'Online';
      case 2: return 'Presencial';
      case 3: return 'Híbrido';
      default: return 'No especificado';
    }
  };

  const obtenerNivel = (idNivel: number | undefined) => {
    switch(idNivel) {
      case 1: return 'Principiante';
      case 2: return 'Intermedio';
      case 3: return 'Avanzado';
      default: return 'No especificado';
    }
  };

  useEffect(() => {
    const cargarCurso = async () => {
      try {
        setError('');
        const response = await fetch(`/api/editarAdmi?id=${cursoId}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.Id_curso) {
          throw new Error('Datos del curso incompletos');
        }
        
        setCurso(data);
        
        const horarioParsed = parseHorario(data.horario);
        
        setFormData({
          nombreCurso: data.nom_curso || '',
          descripcion: data.discripcion || '',
          precio: data.precio?.toString() || '',
          modalidad: data.Id_mod?.toString() || '',
          nivel: data.Id_nivel?.toString() || '',
          materiaNombre: data.nom_materia || data.desc_mat || '',
          cantMinEstudiantes: data.cant_est_min?.toString() || '',
          resumen: data.resumen || '',
          queAprendere: data.que_aprendere || '',
          horario: data.horario || '',
          dia: horarioParsed.dia,
          horaInicio: horarioParsed.horaInicio,
          horaFin: horarioParsed.horaFin,
          tutorId: data.Id_user?.toString() || ''
        });
        
      } catch (err) {
        console.error('Error al cargar curso:', {
          error: err,
          message: err instanceof Error ? err.message : 'Error desconocido',
          cursoId
        });
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar el curso');
      } finally {
        setLoading(false);
      }
    };

    if (cursoId && !isNaN(parseInt(cursoId.toString()))) {
      cargarCurso();
    } else {
      setError('ID de curso no válido');
      setLoading(false);
    }
  }, [cursoId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHorarioChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      const horarioActualizado = construirHorario(
        name === 'dia' ? value : newData.dia,
        name === 'horaInicio' ? value : newData.horaInicio,
        name === 'horaFin' ? value : newData.horaFin
      );
      newData.horario = horarioActualizado;
      return newData;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Validar datos antes de enviar
      if (!formData.nombreCurso.trim()) {
        throw new Error('El nombre del curso es requerido');
      }
      
      if (!formData.descripcion.trim()) {
        throw new Error('La descripción es requerida');
      }
      
      if (!formData.precio || parseFloat(formData.precio) <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }
      
      if (!formData.modalidad) {
        throw new Error('Debe seleccionar una modalidad');
      }
      
      if (!formData.nivel) {
        throw new Error('Debe seleccionar un nivel');
      }
      
      if (!formData.materiaNombre.trim()) {
        throw new Error('El nombre de la materia es requerido');
      }
      
      if (!formData.cantMinEstudiantes || parseInt(formData.cantMinEstudiantes) <= 0) {
        throw new Error('Los cupos mínimos deben ser mayor a 0');
      }
      
      if (!formData.tutorId) {
        throw new Error('Debe seleccionar un tutor');
      }
      
      if (!formData.dia || !formData.horaInicio || !formData.horaFin) {
        throw new Error('El horario completo es requerido');
      }

      // Validar que la hora de inicio sea menor que la hora de fin
      if (formData.horaInicio >= formData.horaFin) {
        throw new Error('La hora de inicio debe ser menor que la hora de fin');
      }

      const dataToSend = {
        nombreCurso: formData.nombreCurso.trim(),
        descripcion: formData.descripcion.trim(),
        precio: formData.precio,
        modalidad: formData.modalidad,
        nivel: formData.nivel,
        materiaNombre: formData.materiaNombre.trim(),
        cantMinEstudiantes: formData.cantMinEstudiantes,
        resumen: formData.resumen.trim(),
        queAprendere: formData.queAprendere.trim(),
        dia: formData.dia,
        horaInicio: formData.horaInicio,
        horaFin: formData.horaFin,
        tutorId: formData.tutorId
      };

      console.log('Enviando datos al servidor:', dataToSend);

      const response = await fetch(`/api/editarAdmi?id=${cursoId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      console.log('Respuesta del servidor:', result);

      if (!response.ok) {
        throw new Error(result.error || result.details || `Error ${response.status}: ${response.statusText}`);
      }
      
      if (result.success) {
        // Mostrar mensaje de éxito
        console.log('Curso actualizado exitosamente');
        
        // Llamar al callback para notificar que se editó el curso
        onCursoEditado();
        
        // Salir del modo de edición
        setEditMode(false);
        
        // Recargar los datos actualizados
        try {
          const updatedResponse = await fetch(`/api/editarAdmi?id=${cursoId}`);
          if (updatedResponse.ok) {
            const updatedData = await updatedResponse.json();
            setCurso(updatedData);
            
            const horarioParsed = parseHorario(updatedData.horario);
            setFormData(prev => ({
              ...prev,
              nombreCurso: updatedData.nom_curso || '',
              descripcion: updatedData.discripcion || '',
              precio: updatedData.precio?.toString() || '',
              modalidad: updatedData.Id_mod?.toString() || '',
              nivel: updatedData.Id_nivel?.toString() || '',
              materiaNombre: updatedData.nom_materia || updatedData.desc_mat || '',
              cantMinEstudiantes: updatedData.cant_est_min?.toString() || '',
              resumen: updatedData.resumen || '',
              queAprendere: updatedData.que_aprendere || '',
              dia: horarioParsed.dia,
              horaInicio: horarioParsed.horaInicio,
              horaFin: horarioParsed.horaFin,
              horario: updatedData.horario || '',
              tutorId: updatedData.Id_user?.toString() || ''
            }));
          }
        } catch (reloadError) {
          console.warn('Error al recargar datos actualizados:', reloadError);
          // No es crítico, el curso ya se actualizó
        }
      } else {
        throw new Error(result.message || 'Error al actualizar el curso');
      }
    } catch (err) {
      console.error('Error en handleSubmit:', {
        error: err,
        message: err instanceof Error ? err.message : 'Error desconocido'
      });
      setError(err instanceof Error ? err.message : 'Error desconocido al actualizar el curso');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !curso) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando curso...</div>
      </div>
    );
  }

  if (!curso) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Error al cargar curso</h2>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>
        <div className={styles.error}>
          <p><strong>Error:</strong> {error || 'No se pudo cargar el curso'}</p>
          <p><strong>ID del curso:</strong> {cursoId}</p>
          <p>Por favor, verifica que el curso existe.</p>
        </div>
        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelarBtn}>Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>{editMode ? 'Editar Curso (Admin)' : 'Detalles del Curso (Admin)'}</h2>
        <button onClick={onClose} className={styles.closeBtn}>×</button>
      </div>

      {error && (
        <div className={styles.error}>
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {!editMode ? (
        <div className={styles.detalles}>
          <div className={styles.detalleItem}>
            <h3>Nombre del Curso</h3>
            <p>{curso.nom_curso}</p>
          </div>

          <div className={styles.detalleItem}>
            <h3>Descripción</h3>
            <p>{curso.discripcion}</p>
          </div>

          <div className={styles.detalleRow}>
            <div className={styles.detalleItem}>
              <h3>Precio</h3>
              <p>Bs. {curso.precio}</p>
            </div>
            <div className={styles.detalleItem}>
              <h3>Modalidad</h3>
              <p>{obtenerModalidad(curso.Id_mod)}</p>
            </div>
          </div>

          <div className={styles.detalleRow}>
            <div className={styles.detalleItem}>
              <h3>Nivel</h3>
              <p>{obtenerNivel(curso.Id_nivel)}</p>
            </div>
            <div className={styles.detalleItem}>
              <h3>Materia</h3>
              <p>{curso.nom_materia || 'No especificado'}</p>
            </div>
          </div>

          <div className={styles.detalleRow}>
            <div className={styles.detalleItem}>
              <h3>Tutor</h3>
              <p>
                {curso.tutor_nombre 
                  ? `${curso.tutor_nombre} ${curso.tutor_apellidos || ''} (${curso.tutor_email || ''})` 
                  : 'No asignado'}
              </p>
            </div>
            <div className={styles.detalleItem}>
              <h3>Cupos mínimos</h3>
              <p>{curso.cant_est_min}</p>
            </div>
          </div>

          <div className={styles.detalleItem}>
            <h3>Horario</h3>
            <p>{curso.horario || 'No especificado'}</p>
          </div>

          {curso.resumen && (
            <div className={styles.detalleItem}>
              <h3>Resumen</h3>
              <p>{curso.resumen}</p>
            </div>
          )}

          {curso.que_aprendere && (
            <div className={styles.detalleItem}>
              <h3>¿Qué aprenderán?</h3>
              <p>{curso.que_aprendere}</p>
            </div>
          )}

          <div className={styles.actions}>
            <button onClick={() => setEditMode(true)} className={styles.publicarBtn}>
              Editar Curso
            </button>
            <button onClick={onClose} className={styles.cancelarBtn}>
              Cerrar
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nombre del Curso *</label>
            <input
              type="text"
              name="nombreCurso"
              value={formData.nombreCurso}
              onChange={handleInputChange}
              required
              maxLength={100}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Descripción *</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              required
              rows={4}
              maxLength={500}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Precio (Bs.) *</label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                required
                min="0.01"
                step="0.01"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Modalidad *</label>
              <select
                name="modalidad"
                value={formData.modalidad}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value="1">Online</option>
                <option value="2">Presencial</option>
                <option value="3">Híbrido</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Nivel *</label>
              <select
                name="nivel"
                value={formData.nivel}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value="1">Principiante</option>
                <option value="2">Intermedio</option>
                <option value="3">Avanzado</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Materia *</label>
              <input
                type="text"
                name="materiaNombre"
                value={formData.materiaNombre}
                onChange={handleInputChange}
                required
                placeholder="Ingrese el nombre de la materia"
                maxLength={100}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Cupos mínimos *</label>
              <input
                type="number"
                name="cantMinEstudiantes"
                value={formData.cantMinEstudiantes}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Tutor *</label>
              <select
                name="tutorId"
                value={formData.tutorId}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar tutor</option>
                {tutores.map(tutor => (
                  <option key={tutor.Id_user} value={tutor.Id_user}>
                    {tutor.Nombre} {tutor.ApePat} {tutor.ApeMat} ({tutor.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Horario *</label>
              <div className={styles.horarioContainer}>
                <div className={styles.horarioRow}>
                  <div className={styles.horarioField}>
                    <label className={styles.smallLabel}>Día</label>
                    <select
                      name="dia"
                      value={formData.dia}
                      onChange={handleHorarioChange}
                      required
                      className={styles.selectField}
                    >
                      <option value="">Seleccionar día</option>
                      <option value="Lunes">Lunes</option>
                      <option value="Martes">Martes</option>
                      <option value="Miércoles">Miércoles</option>
                      <option value="Jueves">Jueves</option>
                      <option value="Viernes">Viernes</option>
                      <option value="Sábado">Sábado</option>
                      <option value="Domingo">Domingo</option>
                    </select>
                  </div>
                  
                  <div className={styles.horarioField}>
                    <label className={styles.smallLabel}>Hora inicio</label>
                    <input
                      type="time"
                      name="horaInicio"
                      value={formData.horaInicio}
                      onChange={handleHorarioChange}
                      required
                      className={styles.timeField}
                    />
                  </div>
                  
                  <div className={styles.horarioField}>
                    <label className={styles.smallLabel}>Hora fin</label>
                    <input
                      type="time"
                      name="horaFin"
                      value={formData.horaFin}
                      onChange={handleHorarioChange}
                      required
                      className={styles.timeField}
                    />
                  </div>
                </div>
                
                <div className={styles.horarioPreview}>
                  <span className={styles.previewLabel}>Vista previa:</span>
                  <span className={styles.previewText}>
                    {formData.dia && formData.horaInicio && formData.horaFin 
                      ? `${formData.dia}, ${formData.horaInicio} - ${formData.horaFin}`
                      : 'Selecciona día y horarios'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Resumen</label>
            <textarea
              name="resumen"
              value={formData.resumen}
              onChange={handleInputChange}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className={styles.formGroup}>
            <label>¿Qué aprenderán?</label>
            <textarea
              name="queAprendere"
              value={formData.queAprendere}
              onChange={handleInputChange}
              rows={3}
              maxLength={1000}
            />
          </div>

          <div className={styles.actions}>
            <button 
              type="submit" 
              className={styles.publicarBtn}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button 
              type="button" 
              onClick={() => setEditMode(false)}
              className={styles.cancelarBtn}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}