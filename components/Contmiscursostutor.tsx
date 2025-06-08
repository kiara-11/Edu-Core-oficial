'use client';

import React, { useEffect, useState } from 'react';
import styles from './contmiscursostutor.module.css';
import EditarCurso from './EditarCurso';

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

const Contmiscursostutor = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [cursoIdAEditar, setCursoIdAEditar] = useState<number | null>(null);
  
  // Estados para el modal de confirmación de eliminar
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [cursoAEliminar, setCursoAEliminar] = useState<{id: number, nombre: string} | null>(null);
  const [eliminandoCurso, setEliminandoCurso] = useState(false);

  const fetchCursos = async () => {
    try {
      const id_user = localStorage.getItem('id_user');
      
      if (!id_user) {
        console.error("No se encontró id_user");
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/tutores?id_user=${id_user}`);
      
      // Verificar si la respuesta es JSON
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

  useEffect(() => {
    fetchCursos();
  }, []);

  useEffect(() => {
    if (modalEditarAbierto && cursoIdAEditar) {
      console.log('Modal abierto con curso ID:', cursoIdAEditar);
    }
  }, [modalEditarAbierto, cursoIdAEditar]);

  const handleEditar = (curso: Curso) => {
    console.log('Curso completo:', curso);
    console.log('ID del curso:', curso.Id_curso);
    console.log('Tipo del ID:', typeof curso.Id_curso);
    setCursoIdAEditar(curso.Id_curso);
    setModalEditarAbierto(true);
  };

  // Función para abrir el modal de confirmación
  const handleEliminar = (cursoId: number, nombreCurso: string) => {
    setCursoAEliminar({ id: cursoId, nombre: nombreCurso });
    setModalEliminarAbierto(true);
  };

  // Función para confirmar la eliminación
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

      // Intentar parsear la respuesta como JSON
      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        // Si no se puede parsear como JSON, obtener el texto
        const text = await response.text();
        throw new Error(text || 'Respuesta no válida del servidor');
      }

      // Verificar si la respuesta fue exitosa
      if (!response.ok) {
        // Manejar diferentes tipos de errores
        if (response.status === 409) {
          // Error de integridad referencial
          alert('No se puede eliminar el curso porque tiene estudiantes inscritos, valoraciones u otros datos relacionados. Contacte al administrador si necesita eliminar este curso.');
        } else if (response.status === 404) {
          alert('El curso no existe o ya fue eliminado.');
        } else {
          // Otros errores
          alert(result.error || 'Error al eliminar el curso');
        }
        return; // Salir sin cerrar el modal para que el usuario pueda intentar de nuevo
      }

      fetchCursos(); // Actualizar la lista
      cerrarModalEliminar();
      
    } catch (error) {
      console.error('Error al eliminar curso:', error);
      alert('Error de conexión. Verifica tu conexión a internet e inténtalo nuevamente.');
    } finally {
      setEliminandoCurso(false);
    }
  };

  // Función para cerrar el modal de eliminación
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
    fetchCursos(); // Actualizar la lista después de editar
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
        Mis cursos
      </div>
      <div className={styles.subHeader}>
        Cursos publicados
      </div>
      
      <div className={styles.cursosContainer}>
        {cursos.length === 0 ? (
          <div className={styles.noCursos}>
            No tienes cursos publicados aún.
          </div>
        ) : (
          cursos.map((curso, index) => {
          console.log(`Curso ${index}:`, curso);
          return (
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
                    {curso.Nombre} {curso.ApePat} {curso.ApeMat}
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
            );
          })
        )}
      </div>

      {/* Modal para editar curso */}
      {modalEditarAbierto && cursoIdAEditar !== null && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <EditarCurso 
              cursoId={cursoIdAEditar} 
              onClose={cerrarModal}
              onCursoEditado={onCursoEditado}
            />
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar - JSX corregido */}
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

export default Contmiscursostutor;