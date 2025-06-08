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
}

export default function EditarCurso({ 
  cursoId, 
  onClose, 
  onCursoEditado 
}: {
  cursoId: number;
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
    materia: '',
    cantMinEstudiantes: '',
    resumen: '',
    queAprendere: '',
    horario: '',
    // Nuevos campos
    dia: '',
    horaInicio: '',
    horaFin: ''
  });

  // Función para parsear horario existente - MEJORADA
  const parseHorario = (horarioString: string | null | undefined) => {
    console.log('Parseando horario:', horarioString);
    
    if (!horarioString || horarioString.trim() === '') {
      console.log('Horario vacío o nulo');
      return { dia: '', horaInicio: '', horaFin: '' };
    }
    
    // Limpiar el string
    const horarioLimpio = horarioString.trim();
    
    // Múltiples patrones para diferentes formatos
    const patrones = [
      // Formato: "Lunes, 08:00 - 10:00" o "jueves, 17:28 - 17:34"
      /^(.+?),\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/i,
      // Formato: "Lunes 08:00 - 10:00" (sin coma)
      /^(.+?)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/i,
      // Formato: "Lunes: 08:00 - 10:00" (con dos puntos)
      /^(.+?):\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$/i
    ];
    
    for (const patron of patrones) {
      const match = horarioLimpio.match(patron);
      if (match) {
        const resultado = {
          dia: match[1].trim(),
          horaInicio: match[2],
          horaFin: match[3]
        };
        console.log('Horario parseado exitosamente:', resultado);
        return resultado;
      }
    }
    
    console.log('No se pudo parsear el horario, usando valores vacíos');
    return { dia: '', horaInicio: '', horaFin: '' };
  };

  // Función para construir horario combinado
  const construirHorario = (dia: string, horaInicio: string, horaFin: string) => {
    if (dia && horaInicio && horaFin) {
      return `${dia}, ${horaInicio} - ${horaFin}`;
    }
    return '';
  };

  // Función para obtener el nombre de modalidad
  const obtenerModalidad = (idMod: number | undefined) => {
    switch(idMod) {
      case 1: return 'Online';
      case 2: return 'Presencial';
      case 3: return 'Híbrido';
      default: return 'No especificado';
    }
  };

  // Función para obtener el nombre de nivel
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
        console.log('=== INICIO CARGA CURSO ===');
        console.log('Cargando curso con ID:', cursoId);
        
        const response = await fetch(`/api/editar?id=${cursoId}`);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('=== DATOS COMPLETOS RECIBIDOS ===');
        console.log('Data completa:', JSON.stringify(data, null, 2));
        console.log('Horario específico:', data.horario);
        console.log('Tipo de horario:', typeof data.horario);
        console.log('Horario es null?', data.horario === null);
        console.log('Horario es undefined?', data.horario === undefined);
        console.log('Horario es string vacío?', data.horario === '');
        console.log('================================');
        
        if (!data || !data.Id_curso) {
          throw new Error('Datos del curso incompletos');
        }
        
        setCurso(data);
        
        // Parsear horario - DEBUGGING EXTENDIDO
        const horarioValue = data.horario;
        console.log('=== PARSEO DE HORARIO ===');
        console.log('Valor original:', horarioValue);
        console.log('Tipo:', typeof horarioValue);
        console.log('Es null:', horarioValue === null);
        console.log('Es undefined:', horarioValue === undefined);
        console.log('Es string vacío:', horarioValue === '');
        console.log('Longitud si es string:', typeof horarioValue === 'string' ? horarioValue.length : 'N/A');
        
        const horarioParsed = parseHorario(horarioValue);
        console.log('Resultado del parseo:', horarioParsed);
        console.log('========================');
        
        setFormData({
          nombreCurso: data.nom_curso || '',
          descripcion: data.discripcion || '',
          precio: data.precio?.toString() || '',
          modalidad: data.Id_mod?.toString() || '',
          nivel: data.Id_nivel?.toString() || '',
          materia: data.nom_materia || '',
          cantMinEstudiantes: data.cant_est_min?.toString() || '',
          resumen: data.resumen || '',
          queAprendere: data.que_aprendere || '',
          horario: horarioValue || '',
          // Nuevos campos para horario
          dia: horarioParsed.dia,
          horaInicio: horarioParsed.horaInicio,
          horaFin: horarioParsed.horaFin
        });
        
        console.log('=== FORM DATA FINAL ===');
        console.log('FormData horario:', horarioValue || '');
        console.log('FormData dia:', horarioParsed.dia);
        console.log('FormData horaInicio:', horarioParsed.horaInicio);
        console.log('FormData horaFin:', horarioParsed.horaFin);
        console.log('======================');
        
      } catch (err) {
        console.error('Error al cargar curso:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar el curso');
      } finally {
        setLoading(false);
      }
    };

    if (cursoId) {
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
      
      // Actualizar el campo horario combinado
      const horarioActualizado = construirHorario(
        name === 'dia' ? value : newData.dia,
        name === 'horaInicio' ? value : newData.horaInicio,
        name === 'horaFin' ? value : newData.horaFin
      );
      
      newData.horario = horarioActualizado;
      
      console.log('Horario actualizado:', horarioActualizado);
      
      return newData;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Construir el horario final antes de enviar
      const horarioFinal = construirHorario(formData.dia, formData.horaInicio, formData.horaFin);
      
      const dataToSend = {
        ...formData,
        horario: horarioFinal
      };

      console.log('Datos a enviar:', dataToSend);
      console.log('Horario final a enviar:', horarioFinal);

      const response = await fetch(`/api/editar?id=${cursoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el curso');
      }

      const result = await response.json();
      if (result.success) {
        onCursoEditado();
        setEditMode(false);
        // Recargar los datos del curso para mostrar los cambios
        const updatedResponse = await fetch(`/api/editar?id=${cursoId}`);
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setCurso(updatedData);
        }
      } else {
        throw new Error(result.message || 'Error al actualizar');
      }
    } catch (err) {
      console.error('Error al actualizar:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
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
          <p>Por favor, verifica que el curso existe y que tienes permisos para acceder a él.</p>
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
        <h2>{editMode ? 'Editar Curso' : 'Detalles del Curso'}</h2>
        <button onClick={onClose} className={styles.closeBtn}>×</button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

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
              <h3>Cupos mínimos</h3>
              <p>{curso.cant_est_min}</p>
            </div>
            <div className={styles.detalleItem}>
              <h3>Horario</h3>
              <p>
                {(() => {
                  console.log('=== RENDERIZADO HORARIO ===');
                  console.log('curso.horario:', curso.horario);
                  console.log('tipo:', typeof curso.horario);
                  console.log('es null:', curso.horario === null);
                  console.log('es undefined:', curso.horario === undefined);
                  console.log('es string vacío:', curso.horario === '');
                  console.log('trim !== "":', curso.horario && curso.horario.trim() !== '');
                  console.log('==========================');
                  
                  if (curso.horario && typeof curso.horario === 'string' && curso.horario.trim() !== '') {
                    return curso.horario;
                  } else {
                    return 'No especificado';
                  }
                })()}
              </p>
              
            </div>
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
                min="0"
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
                name="materia"
                value={formData.materia}
                onChange={handleInputChange}
                required
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
            />
          </div>

          <div className={styles.formGroup}>
            <label>¿Qué aprenderán?</label>
            <textarea
              name="queAprendere"
              value={formData.queAprendere}
              onChange={handleInputChange}
              rows={3}
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