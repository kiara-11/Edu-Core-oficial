'use client';

import React, { useEffect, useState } from 'react';
import styles from './contmiscursostutor.module.css';
import EditarCursoAdmi from './EditarCursoAdmi';

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
  Id_tutor: number;
}

interface Tutor {
  Id_user: number;
  Nombre: string;
  ApePat: string;
  ApeMat: string;
  email: string;
}

const ContmiscursosAdmi = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [cursoIdAEditar, setCursoIdAEditar] = useState<number | null>(null);
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [cursoAEliminar, setCursoAEliminar] = useState<{id: number, nombre: string} | null>(null);
  const [eliminandoCurso, setEliminandoCurso] = useState(false);

  const fetchCursos = async () => {
    try {
      const res = await fetch('/api/cursosAdmi');
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(text || 'Respuesta no válida del servidor');
      }

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Error al cargar cursos');
      }

      setCursos(data);
    } catch (error) {
      console.error('Error al cargar cursos:', error);
      alert(error || 'Error al cargar cursos');
    } finally {
      setLoading(false);
    }
  };

  const fetchTutores = async () => {
    try {
      const res = await fetch('/api/tutores2');
      const data = await res.json();
      if (res.ok) {
        setTutores(data);
      }
    } catch (error) {
      console.error('Error al cargar tutores:', error);
    }
  };

  useEffect(() => {
    fetchCursos();
    fetchTutores();
  }, []);

  const handleEditar = (curso: Curso) => {
    setCursoIdAEditar(curso.Id_curso);
    setModalEditarAbierto(true);
  };

  const handleEliminar = (cursoId: number, nombreCurso: string) => {
    setCursoAEliminar({ id: cursoId, nombre: nombreCurso });
    setModalEliminarAbierto(true);
  };

  const confirmarEliminacion = async () => {
    if (!cursoAEliminar) return;
    
    setEliminandoCurso(true);
    
    try {
      const response = await fetch(`/api/cursos/${cursoAEliminar.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        const text = await response.text();
        throw new Error(text || 'Respuesta no válida del servidor');
      }

      if (!response.ok) {
        if (response.status === 409) {
          alert('No se puede eliminar el curso porque tiene estudiantes inscritos, valoraciones u otros datos relacionados.');
        } else if (response.status === 404) {
          alert('El curso no existe o ya fue eliminado.');
        } else {
          alert(result.error || 'Error al eliminar el curso');
        }
        return;
      }

      fetchCursos();
      cerrarModalEliminar();
      
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      alert('Error de conexión. Verifica tu conexión a internet e inténtalo nuevamente.');
    } finally {
      setEliminandoCurso(false);
    }
  };

  const cerrarModalEliminar = () => {
    setModalEliminarAbierto(false);
    setCursoAEliminar(null);
    setEliminandoCurso(false);
  };

  const cerrarModal = () => {
    setModalEditarAbierto(false);
    setCursoIdAEditar(null);
  };

  const onCursoEditado = () => {
    fetchCursos();
    cerrarModal();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Cargando cursos...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Gestión de Cursos (Administrador)
      </div>
      <div className={styles.subHeader}>
        Todos los cursos del sistema
      </div>
      
      <div className={styles.cursosContainer}>
        {cursos.length === 0 ? (
          <div className={styles.noCursos}>
            No hay cursos registrados en el sistema.
          </div>
        ) : (
          cursos.map((curso, index) => (
            <div key={curso.Id_curso || index} className={styles.cursoCard}> 
              <div className={styles.cursoInfo}>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatarPlaceholder}></div>
                </div>
                <div className={styles.cursoDetails}>
                  <h3 className={styles.cursoTitulo}>
                    {curso.nom_curso}
                  </h3>
                  <p className={styles.cursoSubtitulo}>
                    Tutor: {curso.Nombre} {curso.ApePat} {curso.ApeMat}
                  </p>
                  <p className={styles.cursoDescripcion}>
                    {curso.discripcion}
                  </p>
                </div>
              </div>
              
              <div className={styles.cursoStats}>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Precio:</span>
                  <span className={`${styles.statValue} ${styles.precio}`}>Bs. {curso.precio}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Horario:</span>
                  <span className={styles.statValue}>{curso.horario}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Modalidad:</span>
                  <span className={styles.statValue}>{curso.modalidad}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Nivel:</span>
                  <span className={styles.statValue}>{curso.nivel}</span>
                </div>
                <div className={styles.statRow}>
                  <span className={styles.statLabel}>Cupos disponibles:</span>
                  <span className={styles.statValue}>{curso.cant_est_min || 'Sin límite'}</span>
                </div>
              </div>
              
              <div className={styles.acciones}>
                <button 
                  className={styles.btnEditar}
                  onClick={() => handleEditar(curso)}
                >
                  EDITAR
                </button>
                <button 
                  className={styles.btnEliminar}
                  onClick={() => handleEliminar(curso.Id_curso, curso.nom_curso)}
                >
                  ELIMINAR
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {modalEditarAbierto && cursoIdAEditar !== null && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <EditarCursoAdmi 
              cursoId={cursoIdAEditar} 
              tutores={tutores}
              onClose={cerrarModal}
              onCursoEditado={onCursoEditado}
            />
          </div>
        </div>
      )}

      {modalEliminarAbierto && cursoAEliminar && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalEliminar}>
            <div className={styles.iconContainer}>
              <svg className={styles.deleteIcon} viewBox="0 0 24 24">
                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </div>
            
            <h3 className={styles.modalTitle}>
              ¿Confirmar eliminación?
            </h3>
            
            <p className={styles.modalMessage}>
              ¿Estás seguro de que deseas eliminar el curso{' '}
              <span className={styles.courseName}>"{cursoAEliminar.nombre}"</span>?
            </p>
            
            <div className={styles.warningText}>
              Esta acción no se puede deshacer.
            </div>
            
            <div className={styles.buttonContainer}>
              <button
                className={styles.btnCancelar}
                onClick={cerrarModalEliminar}
                disabled={eliminandoCurso}
              >
                Cancelar
              </button>
              
              <button
                className={styles.btnEliminar}
                onClick={confirmarEliminacion}
                disabled={eliminandoCurso}
              >
                {eliminandoCurso && (
                  <div className={styles.spinner}></div>
                )}
                {eliminandoCurso ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContmiscursosAdmi;