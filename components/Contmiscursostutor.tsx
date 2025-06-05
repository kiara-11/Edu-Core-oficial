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
  const [cursoAEditar, setCursoAEditar] = useState<Curso | null>(null);

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

  const handleEditar = (curso: Curso) => {
    setCursoAEditar(curso);
    setModalEditarAbierto(true);
  };

  const handleEliminar = async (cursoId: number, nombreCurso: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el curso "${nombreCurso}"? Esta acción no se puede deshacer.`)) {
      try {
        const response = await fetch(`/api/cursos/${cursoId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        // Verificar si la respuesta es JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(text || 'Respuesta no válida del servidor');
        }

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Error al eliminar el curso');
        }

        alert('Curso eliminado exitosamente');
        fetchCursos(); // Actualizar la lista
      } catch (error) {
        console.error('Error al eliminar curso:', error);
        alert(error || 'Error al eliminar el curso. Inténtalo nuevamente.');
      }
    }
  };

  const cerrarModal = () => {
    setModalEditarAbierto(false);
    setCursoAEditar(null);
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
          cursos.map((curso, index) => (
            <div key={index} className={styles.cursoCard}>
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
          ))
        )}
      </div>

      {/* Modal para editar curso */}
      {modalEditarAbierto && cursoAEditar && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Editar Curso</h2>
              <button className={styles.closeBtn} onClick={cerrarModal}>
                ×
              </button>
            </div>
            <EditarCurso 
              curso={cursoAEditar} 
              onClose={cerrarModal}
              onCursoEditado={onCursoEditado}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Contmiscursostutor;