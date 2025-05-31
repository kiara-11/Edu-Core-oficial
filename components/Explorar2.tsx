'use client';

import { useState } from 'react';
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

const mockCourses: Course[] = [
  {
    id: 1,
    title: "Desarrollo Web Full Stack",
    instructor: "Maria Lopez Andrade",
    description: "Aprende las tecnologías más demandadas en desarrollo web desde cero",
    duration: "2 semanas",
    rating: 5,
    reviews: 5,
    price: 60,
    imageUrl: "",
    category: "Programación",
    level: "Principiante",
    modality: "Virtual"
  },
  {
    id: 2,
    title: "Desarrollo Web Full Stack",
    instructor: "Maria Lopez Andrade",
    description: "Aprende las tecnologías más demandadas en desarrollo web desde cero",
    duration: "2 semanas",
    rating: 5,
    reviews: 10,
    price: 60,
    imageUrl: "",
    category: "Programación",
    level: "Intermedio",
    modality: "Presencial"
  },
  {
    id: 3,
    title: "Desarrollo Web Full Stack",
    instructor: "Maria Lopez Andrade",
    description: "Aprende las tecnologías más demandadas en desarrollo web desde cero",
    duration: "2 semanas",
    rating: 5,
    reviews: 8,
    price: 60,
    imageUrl: "",
    category: "Diseño",
    level: "Avanzado",
    modality: "Virtual"
  },
  {
    id: 4,
    title: "Desarrollo Web Full Stack",
    instructor: "Maria Lopez Andrade",
    description: "Aprende las tecnologías más demandadas en desarrollo web desde cero",
    duration: "2 semanas",
    rating: 5,
    reviews: 15,
    price: 60,
    imageUrl: "",
    category: "Marketing",
    level: "Principiante",
    modality: "Presencial"
  },
  {
    id: 5,
    title: "Desarrollo Web Full Stack",
    instructor: "Maria Lopez Andrade",
    description: "Aprende las tecnologías más demandadas en desarrollo web desde cero",
    duration: "2 semanas",
    rating: 5,
    reviews: 12,
    price: 60,
    imageUrl: "",
    category: "Programación",
    level: "Intermedio",
    modality: "Virtual"
  },
  {
    id: 6,
    title: "Desarrollo Web Full Stack",
    instructor: "Maria Lopez Andrade",
    description: "Aprende las tecnologías más demandadas en desarrollo web desde cero",
    duration: "2 semanas",
    rating: 5,
    reviews: 7,
    price: 60,
    imageUrl: "",
    category: "Diseño",
    level: "Avanzado",
    modality: "Presencial"
  }
];

export default function CourseExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [modalityFilter, setModalityFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || course.category === categoryFilter;
    const matchesLevel = !levelFilter || course.level === levelFilter;
    const matchesModality = !modalityFilter || course.modality === modalityFilter;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesModality;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ));
  };

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
            <option value="Programación">Programación</option>
            <option value="Diseño">Diseño</option>
            <option value="Marketing">Marketing</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Nivel (Primaria, Secundaria, Universidad, etc)</option>
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
          </select>

          <select
            value={modalityFilter}
            onChange={(e) => setModalityFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Modalidad (Virtual / Presencial)</option>
            <option value="Virtual">Virtual</option>
            <option value="Presencial">Presencial</option>
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
        {filteredCourses.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <div className={styles.courseImage}>
              <img src={course.imageUrl || '/explorar.png'} alt={course.title} className={styles.courseImg} />
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
              
              
              <Link href="/explorarcurso/detalles">
                <button className={styles.viewMoreButton}>
                VER MÁS
                </button>
            </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}