'use client'
import { useState } from 'react';
import styles from './Explorar.module.css';
import Link from "next/link";

interface Tutor {
  id: number;
  name: string;
  subject: string;
  description: string;
  rating: number;
  reviewCount: number;
  price: number;
  image: string;
}

const TutorGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedModality, setSelectedModality] = useState('');
  const [selectedPrice, setSelectedPrice] = useState('');

  const tutors: Tutor[] = [
    {
      id: 1,
      name: 'Maria Lopez Andrade',
      subject: 'Python',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.',
      rating: 5,
      reviewCount: 5,
      price: 15,
      image: '/avatar.png',
    },
    {
      id: 2,
      name: 'Jose Luis Campos',
      subject: 'Física',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.',
      rating: 5,
      reviewCount: 5,
      price: 20,
      image: '/avatar.png',
    },
    {
      id: 3,
      name: 'Andrea Riveros',
      subject: 'Biología',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.',
      rating: 4,
      reviewCount: 4.9,
      price: 18,
      image: '/avatar.png',
    },
    {
      id: 4,
      name: 'Rut Lima Ali',
      subject: 'Matemáticas',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.',
      rating: 4,
      reviewCount: 4.5,
      price: 22,
      image: '/avatar.png',
    },
    {
      id: 5,
      name: 'Rosa Maya Lopez',
      subject: 'Integrales',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.',
      rating: 5,
      reviewCount: 5,
      price: 25,
      image: '/avatar.png',
    },
    {
      id: 6,
      name: 'Alexander Cedeñot',
      subject: 'Cálculo I',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.',
      rating: 4,
      reviewCount: 4.3,
      price: 28,
      image: '/avatar.png',
    }
  ];

  const categories = ['Ciencias Exactas', 'Humanidades', 'Idiomas', 'Artes'];
  const levels = ['Básico/Primaria', 'Secundaria', 'Universidad', 'Posgrado'];
  const modalities = ['Presencial/Virtual/Presencial', 'Solo Virtual', 'Solo Presencial'];
  const priceRanges = ['10-20 Bs', '20-30 Bs', '30-40 Bs', '40 Bs +'];

  const filteredTutors = tutors.filter(tutor => {
    return tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           tutor.subject.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? styles.starFilled : styles.starEmpty}>
        ★
      </span>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Buscar docente, tema o tutor"
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
        {filteredTutors.map(tutor => (
          <div key={tutor.id} className={styles.tutorCard}>
            <div className={styles.tutorHeader}>
              <div className={styles.tutorImageContainer}>
                <img src={tutor.image} alt={tutor.name} className={styles.tutorImage} />
              </div>
              <div className={styles.tutorInfo}>
                <h3 className={styles.tutorSubject}>{tutor.subject}</h3>
                <p className={styles.tutorName}>{tutor.name}</p>
              </div>
            </div>

            <div className={styles.tutorDescription}>
              <h4>Descripción</h4>
              <p>{tutor.description}</p>
            </div>

            <div className={styles.tutorRating}>
              <div className={styles.stars}>
                {renderStars(tutor.rating)}
              </div>
              <span className={styles.reviewCount}>{tutor.rating}</span>
            </div>

            <div className={styles.tutorActions}>
              <div className={styles.videoCallIcon}>📹</div>
              <div className={styles.priceSection}>
                <span className={styles.price}>Bs {tutor.price}/hr</span>
              </div>
            </div>
            <Link href="/detalle">
                <button className={styles.verMasButton} >VER MAS</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorGrid;