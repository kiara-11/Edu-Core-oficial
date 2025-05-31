'use client'
import { useState } from 'react';
import styles from './Detalle.module.css';

interface CourseDetailProps {
  course?: {
    id: string;
    title: string;
    image: string;
    rating: number;
    reviewCount: number;
    price: number;
    schedule: string;
    startDate: string;
    lessons: number;
    modality: string;
    level: string;
    duration: string;
    description: string;
    learningTopics: string[];
    lessonsList: Array<{
      id: number;
      title: string;
      description: string;
    }>;
    tutor: {
      name: string;
      image: string;
      description: string;
      socialLinks: {
        facebook?: string;
        pinterest?: string;
        twitter?: string;
        email?: string;
        youtube?: string;
      };
    };
    reviews: Array<{
      id: number;
      userName: string;
      userImage: string;
      rating: number;
      comment: string;
    }>;
  };
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course }) => {
  const [activeTab, setActiveTab] = useState('resumen');

  const defaultCourse = {
    id: '1',
    title: 'Curso De Python Desde Cero',
    image: '/detalle.png',
    rating: 4.7,
    reviewCount: 120,
    price: 60,
    originalPrice: 80,
    schedule: 'De 16:00 A 18:00',
    startDate: '25 De Octubre',
    lessons: 8,
    modality: 'Virtual',
    level: 'Principiante',
    duration: 'Lunes A Viernes',
    description: 'Este curso de Python está dirigido a estudiantes y profesionales sin experiencia previa en programación. Aprenderás desde los conceptos más básicos hasta estructuras más avanzadas utilizando ejemplos prácticos que podrás aplicar en el mundo real.',
    learningTopics: [
      'Sintaxis básica y variables en Python',
      'Estructuras de control (condicionales y bucles)',
      'Funciones, listas, diccionarios y tuplas',
      'Manejo de errores y lectura de archivos',
      'Introducción a módulos como math, random y datetime',
      'Proyecto final práctico: programa funcional con Python'
    ],
    lessonsList: [
      {
        id: 1,
        title: 'Introducción a Python y configuración del entorno',
        description: 'Configuración inicial y primeros pasos'
      },
      {
        id: 2,
        title: 'Variables, operadores y tipos de datos',
        description: 'Fundamentos básicos del lenguaje'
      },
      {
        id: 3,
        title: 'Condicionales y estructuras repetitivas',
        description: 'Control de flujo en Python'
      },
      {
        id: 4,
        title: 'Funciones y organización del código',
        description: 'Creación y uso de funciones'
      },
      {
        id: 5,
        title: 'Estructuras de datos (listas, tuplas, diccionarios)',
        description: 'Manejo de datos complejos'
      },
      {
        id: 6,
        title: 'Archivos y manejo de excepciones',
        description: 'Lectura/escritura de archivos'
      },
      {
        id: 7,
        title: 'Módulos y bibliotecas básicas',
        description: 'Uso de librerías estándar'
      },
      {
        id: 8,
        title: 'Proyecto final: calculadora interactiva / sistema básico',
        description: 'Aplicación práctica de conocimientos'
      }
    ],
    tutor: {
      name: 'Alejandro Torres',
      image: '/avatar2.png',
      description: 'Soy estudiante de Ingeniería de Sistemas en la EMI, con experiencia enseñando Python y programación básica a jóvenes y adultos. Me apasiona compartir conocimiento de manera clara, con ejemplos prácticos y un enfoque paso a paso.',
      socialLinks: {
        facebook: 'https://www.facebook.com/eric.harris.102871?locale=es_LA',
        pinterest: '#',
        twitter: '#',
        email: '#',
        youtube: '#'
      }
    },
    reviews: [
      {
        id: 1,
        userName: 'Marycruz Ivonne',
        userImage: '/avatar.png',
        rating: 5,
        comment: 'Muy recomendable!'
      },
      {
        id: 2,
        userName: 'Marycruz Ivonne',
        userImage: '/avatar.png',
        rating: 5,
        comment: 'Muy recomendable!'
      },
      {
        id: 3,
        userName: 'Marycruz Ivonne',
        userImage: '/avatar.png',
        rating: 5,
        comment: 'Muy recomendable!'
      }
    ]
  };

  const courseData = course || defaultCourse;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'resumen':
        return (
          <div className={styles.tabContent}>
            <h3>DESCRIPCIÓN DEL CURSO</h3>
            <p>{courseData.description}</p>
            <h3>¿QUÉ APRENDERÉ EN ESTE CURSO?</h3>
            <ul>
              {courseData.learningTopics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
        );
      case 'lecciones':
        return (
          <div className={styles.tabContent}>
            <div className={styles.lessonsList}>
              {courseData.lessonsList.map((lesson) => (
                <div key={lesson.id} className={styles.lessonItem}>
                  <div className={styles.lessonNumber}>UNIDAD {lesson.id}:</div>
                  <div className={styles.lessonTitle}>{lesson.title}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'tutor':
        return (
          <div className={styles.tabContent}>
            <div className={styles.tutorCard}>
              <div className={styles.tutorHeader}>
                <div className={styles.tutorImage}>
                  <img src={courseData.tutor.image} alt={courseData.tutor.name} />
                </div>
                <div className={styles.tutorInfo}>
                  <h3 className={styles.tutorName}>{courseData.tutor.name}</h3>
                  <div className={styles.tutorBadge}>Sobre mí:</div>
                </div>
              </div>
              <p className={styles.tutorDescription}>{courseData.tutor.description}</p>
              <div className={styles.socialLinks}>
                <span className={styles.socialLabel}>Redes:</span>
                <div className={styles.socialIcons}>
                  {courseData.tutor.socialLinks.facebook && (
                    <a href={courseData.tutor.socialLinks.facebook} className={styles.socialIcon}>f</a>
                  )}
                  {courseData.tutor.socialLinks.pinterest && (
                    <a href={courseData.tutor.socialLinks.pinterest} className={styles.socialIcon}>P</a>
                  )}
                  {courseData.tutor.socialLinks.twitter && (
                    <a href={courseData.tutor.socialLinks.twitter} className={styles.socialIcon}>X</a>
                  )}
                  {courseData.tutor.socialLinks.email && (
                    <a href={courseData.tutor.socialLinks.email} className={styles.socialIcon}>@</a>
                  )}
                  {courseData.tutor.socialLinks.youtube && (
                    <a href={courseData.tutor.socialLinks.youtube} className={styles.socialIcon}>▶</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'reseñas':
        return (
          <div className={styles.tabContent}>
            <div className={styles.reviewsSection}>
              <div className={styles.reviewsHeader}>
                <h3>Reseñas</h3>
                <button className={styles.commentButton}>Comentar</button>
              </div>
              <div className={styles.reviewsList}>
                {courseData.reviews.map((review) => (
                  <div key={review.id} className={styles.reviewItem}>
                    <div className={styles.reviewUser}>
                      <img src={review.userImage} alt={review.userName} className={styles.reviewUserImage} />
                      <div className={styles.reviewUserInfo}>
                        <div className={styles.reviewStars}>
                          {renderStars(review.rating)}
                        </div>
                        <div className={styles.reviewUserName}>{review.userName}</div>
                        <div className={styles.reviewComment}>{review.comment}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.courseImage}>
          <img src={courseData.image} alt={courseData.title} />
        </div>
        
        <div className={styles.courseInfo}>
          <div className={styles.rating}>
            {renderStars(courseData.rating)}
            <span className={styles.ratingNumber}>({courseData.rating})</span>
          </div>
          
          <h1 className={styles.courseTitle}>{courseData.title}</h1>
          
          <div className={styles.courseDetails}>
            <div className={styles.detailItem}>
              <span className={styles.icon}>📚</span>
              <span>Lesson {courseData.lessons}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.icon}>🕐</span>
              <span>{courseData.schedule}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.icon}>📖</span>
              <span>Curso disponible 24/7</span>
            </div>
          </div>
          
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'resumen' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('resumen')}
            >
              Resumen
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'lecciones' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('lecciones')}
            >
              Lecciones
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'tutor' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('tutor')}
            >
              Tutor
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'reseñas' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('reseñas')}
            >
              Reseñas
            </button>
          </div>
          
          {renderTabContent()}
        </div>
      </div>
      
      <div className={styles.sidebar}>
        <div className={styles.priceCard}>
          <div className={styles.priceSection}>
            <span className={styles.label}>Precio Del Curso</span>
            <div className={styles.priceContainer}>
              <span className={styles.currency}>Bs.</span>
              <span className={styles.price}>{courseData.price}</span>
            </div>
          </div>
          
          <button className={styles.enrollButton}>
            INSCRIBIRME AHORA
          </button>
          
          <div className={styles.courseMetadata}>
            <div className={styles.metadataRow}>
              <span className={styles.metadataLabel}>Horario</span>
              <span className={styles.metadataValue}>{courseData.schedule}</span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metadataLabel}>Fecha De Inicio</span>
              <span className={styles.metadataValue}>{courseData.startDate}</span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metadataLabel}>Lecciones</span>
              <span className={styles.metadataValue}>{courseData.lessons}</span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metadataLabel}>Modalidad</span>
              <span className={styles.metadataValue}>{courseData.modality}</span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metadataLabel}>Nivel</span>
              <span className={styles.metadataValue}>{courseData.level}</span>
            </div>
            <div className={styles.metadataRow}>
              <span className={styles.metadataLabel}>Días De Clase</span>
              <span className={styles.metadataValue}>{courseData.duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;