'use client'
import { useState, useEffect } from 'react';
import styles from './Explorar.module.css';
import Link from "next/link";

interface Curso {
  id: number;
  titulo: string;
  instructor: string;
  descripcion: string;
  categoria: string;
  nivel: string;
  modalidad: string;
  precio: number;
  duracion: string;
  imagen?: string;
  instructorFoto?: string;
  rating: number;
  reviewCount: number;
  totalInscritos: number;
}

const CursosGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedModality, setSelectedModality] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Opciones para los filtros
  const categories = ['Ciencias Exactas', 'Humanidades', 'Idiomas', 'Artes', 'Tecnología', 'Negocios'];
  const levels = ['Básico/Primaria', 'Secundaria', 'Universidad', 'Posgrado'];
  const modalities = ['Presencial/Virtual/Presencial', 'Solo Virtual', 'Solo Presencial'];
  const priceRanges = ['10-20 Bs', '20-30 Bs', '30-40 Bs', '40 Bs +'];

  // Obtener cursos de la API
  useEffect(() => {
    const fetchCursos = async () => {
      try {
        console.log('Iniciando fetch de cursos...');
        const response = await fetch('/api/explorar');
        console.log('Respuesta recibida:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error en la API:', errorData);
          throw new Error(`Error ${response.status}: ${errorData.error} - ${errorData.details}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        setCursos(data.cursos);
      } catch (error) {
        console.error('Error completo:', error);
        setError(`Error al cargar los cursos: ${error}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  // Filtrar cursos
  const filteredCursos = cursos.filter(curso => {
    const matchesSearch = curso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         curso.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         curso.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || curso.categoria === selectedCategory;
    const matchesLevel = !selectedLevel || curso.nivel === selectedLevel;
    const matchesModality = !selectedModality || curso.modalidad.includes(selectedModality.replace('Solo ', ''));
    
    let matchesPrice = true;
    if (selectedPrice) {
      const [min, max] = selectedPrice.split('-').map(p => parseInt(p.replace(/[^\d]/g, '')));
      if (selectedPrice.includes('+')) {
        matchesPrice = curso.precio >= min;
      } else {
        matchesPrice = curso.precio >= min && curso.precio <= max;
      }
    }

    return matchesSearch && matchesCategory && matchesLevel && matchesModality && matchesPrice;
  });

  // Renderizar estrellas
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < Math.floor(rating) ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ));
  };

  // Obtener imagen del curso o imagen genérica
  const getCourseImage = (curso: Curso) => {
    if (curso.imagen) {
      return curso.imagen;
    }
    if (curso.instructorFoto) {
      return curso.instructorFoto;
    }
    // Imagen genérica basada en la categoría
    const genericImages = {
      'Ciencias Exactas': '/images/generic-science.jpg',
      'Humanidades': '/images/generic-humanities.jpg',
      'Idiomas': '/images/generic-language.jpg',
      'Artes': '/images/generic-arts.jpg',
      'Tecnología': '/images/generic-tech.jpg',
      'Negocios': '/images/generic-business.jpg'
    };
    return genericImages[curso.categoria as keyof typeof genericImages] || '/images/generic-course.jpg';
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Cargando cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar curso, instructor o tema"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>🔍</button>
        </div>

        <div className={styles.filterSection}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Categoría/Materia/Humanidades</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Nivel/Primaria/Secundaria/Universidad</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select
            value={selectedModality}
            onChange={(e) => setSelectedModality(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Modalidad/Virtual/Presencial</option>
            {modalities.map(modality => (
              <option key={modality} value={modality}>{modality}</option>
            ))}
          </select>

          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Precio</option>
            {priceRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.tutorGrid}>
        {filteredCursos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', gridColumn: '1 / -1' }}>
            <p>No se encontraron cursos que coincidan con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredCursos.map(curso => (
            <div key={curso.id} className={styles.tutorCard}>
              <div className={styles.tutorHeader}>
                <div className={styles.tutorImageContainer}>
                  <img 
                    src={getCourseImage(curso)} 
                    alt={curso.titulo} 
                    className={styles.tutorImage}
                    onError={(e) => {
                      e.currentTarget.src = '/images/generic-course.jpg';
                    }}
                  />
                </div>
                <div className={styles.tutorInfo}>
                  <h3 className={styles.tutorSubject}>{curso.titulo}</h3>
                  <p className={styles.tutorName}>{curso.instructor}</p>
                </div>
              </div>

              <div className={styles.tutorDescription}>
                <h4>Descripción</h4>
                <p>{curso.descripcion}</p>
                {curso.duracion && (
                  <p style={{ fontSize: '14px', color: '#888', marginTop: '8px' }}>
                    Duración: {curso.duracion}
                  </p>
                )}
              </div>

              <div className={styles.tutorRating}>
                <div className={styles.stars}>
                  {renderStars(curso.rating)}
                </div>
                <span className={styles.reviewCount}>
                  {curso.rating} ({curso.reviewCount} reseñas)
                </span>
              </div>

              <div className={styles.tutorActions}>
                <div className={styles.videoCallIcon}>📚</div>
                <div className={styles.priceSection}>
                  <span className={styles.price}>Bs {curso.precio}</span>
                </div>
              </div>
              
              <div style={{ 
                fontSize: '14px', 
                color: '#666', 
                marginBottom: '15px', 
                textAlign: 'center' 
              }}>
                {curso.totalInscritos} estudiantes inscritos
              </div>

              <Link href={`/detalle/${curso.id}`}>
                <button className={styles.verMasButton}>VER MAS</button>
              </Link>
            </div>
          ))
        )}
      </div>

      <div className={styles.registerSection}>
        <span>¿Quieres enseñar? Únete como instructor</span>
        <Link href="/registro-instructor">
          <button className={styles.registerButton}>Registrarse</button>
        </Link>
      </div>
    </div>
  );
};

export default CursosGrid;