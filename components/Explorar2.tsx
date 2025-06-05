'use client';

import { useState, useEffect } from 'react';
import styles from './Explorar2.module.css';
import Link from "next/link";

interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  duration: string;
  rating: number;
  reviews: number;
  price: number;
  imageUrl: string;
  category: string;
  level: string;
  modality: string;
}

// Imagen por defecto en caso de error
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop';

export default function CourseExplorer() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [modalityFilter, setModalityFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Cargar cursos desde la API
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/explorarcurso');
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.courses);
      } else {
        setError('Error al cargar los cursos');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || course.category === categoryFilter;
    const matchesLevel = !levelFilter || course.level === levelFilter;
    const matchesModality = !modalityFilter || course.modality === modalityFilter;
    
    let matchesPrice = true;
    if (priceFilter) {
      if (priceFilter === '0-50') {
        matchesPrice = course.price >= 0 && course.price <= 50;
      } else if (priceFilter === '50-100') {
        matchesPrice = course.price > 50 && course.price <= 100;
      } else if (priceFilter === '100+') {
        matchesPrice = course.price > 100;
      }
    }
    
    return matchesSearch && matchesCategory && matchesLevel && matchesModality && matchesPrice;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ));
  };

  // Función para manejar errores de imagen
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = DEFAULT_IMAGE;
  };

  // Obtener opciones únicas para los filtros
  const uniqueCategories = [...new Set(courses.map(course => course.category))];
  const uniqueLevels = [...new Set(courses.map(course => course.level))];
  const uniqueModalities = [...new Set(courses.map(course => course.modality))];

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
          <p>Error: {error}</p>
          <button onClick={fetchCourses} style={{ marginTop: '10px', padding: '8px 16px' }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Explorar Cursos</h1>
      
      <div className={styles.searchSection}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Busca cursos, tema o tutor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            🔍
          </button>
        </div>
        
        <button 
          className={styles.filterButton}
          onClick={() => setShowFilters(!showFilters)}
        >
          ≡ Filtrar
        </button>
      </div>

      {showFilters && (
        <div className={styles.filtersContainer}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Categoría (Inglés, Matemática, etc...)</option>
            {uniqueCategories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Nivel (Primaria, Secundaria, Universidad, etc)</option>
            {uniqueLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>

          <select
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Modalidad (Virtual / Presencial)</option>
            {uniqueModalities.map(modality => (
              <option key={modality} value={modality}>{modality}</option>
            ))}
          </select>

          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Precio</option>
            <option value="0-50">Bs. 0 - 50</option>
            <option value="50-100">Bs. 50 - 100</option>
            <option value="100+">Bs. 100+</option>
          </select>
        </div>
      )}

      <div className={styles.coursesGrid}>
        {filteredCourses.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
            <p>No se encontraron cursos que coincidan con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.courseImage}>
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className={styles.courseImg}
                  onError={handleImageError}
                />
              </div>
              
              <div className={styles.courseContent}>
                <h3 className={styles.courseTitle}>{course.title}</h3>
                
                <div className={styles.instructorInfo}>
                  <img src="/avatar.png" alt="Instructor" className={styles.instructorAvatar} />
                  <span className={styles.instructorName}>{course.instructor}</span>
                </div>
                
                <p className={styles.courseDescription}>{course.description}</p>
                
                <div className={styles.courseDetails}>
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>🕒</span>
                    <span>{course.duration}</span>
                  </div>
                  
                  <div className={styles.detailItem}>
                    <span className={styles.icon}>📋</span>
                    <span>{course.modality}</span>
                  </div>
                </div>
                
                <div className={styles.courseFooter}>
                  <div className={styles.rating}>
                    <div className={styles.stars}>
                      {renderStars(course.rating)}
                    </div>
                    <span className={styles.reviewCount}>({course.reviews})</span>
                  </div>
                  
                  <div className={styles.price}>
                    <span className={styles.priceAmount}>Bs. {course.price}</span>
                  </div>
                </div>
                
                <Link href={`/explorarcurso/detalles?id=${course.id}`}>
                  <button className={styles.viewMoreButton}>
                    VER MÁS
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}