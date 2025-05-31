'use client';

import React, { useState } from 'react';
import styles from './Registrotu.module.css';

const Registrotu = () => {
  const [formData, setFormData] = useState({
    departamento: '',
    ciudad: '',
    celular: '',
    universidad: '',
    titulo: '',
    certificacion: '',
    entidad: '',
    año: '',
    materias: '',
    modalidad: '',
    horarios: '',
    frecuencia: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (category: keyof typeof formData, value: string) => {
    // Para todas las secciones, solo una selección
    setFormData(prev => ({
      ...prev,
      [category]: prev[category] === value ? '' : value
    }));
  };

  const handleSubmit = () => {
    console.log('Datos del formulario:', formData);
  };

  return (
    <div className={styles.tutorFormContainer}>
      <div className={styles.formCard}>
        <h1 className={styles.formTitle}>Completa tu perfil de tutor</h1>
        
        <div className={styles.formWrapper}>
          {/* Sección 1: Ubicación */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Sección 1: Ubicación</h2>
            
            <div className={styles.formGroup}>
              <label>Departamento</label>
              <select 
                name="departamento" 
                value={formData.departamento}
                onChange={handleInputChange}
                className={styles.formSelect}
              >
                <option value="">Seleccionar Departamento</option>
                <option value="la-paz">La Paz</option>
                <option value="cochabamba">Cochabamba</option>
                <option value="santa-cruz">Santa Cruz</option>
                <option value="oruro">Oruro</option>
                <option value="potosi">Potosí</option>
                <option value="tarija">Tarija</option>
                <option value="chuquisaca">Chuquisaca</option>
                <option value="beni">Beni</option>
                <option value="pando">Pando</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Ciudad</label>
              <select 
                name="ciudad" 
                value={formData.ciudad}
                onChange={handleInputChange}
                className={styles.formSelect}
              >
                <option value="">Seleccionar Ciudad</option>
                <option value="la-paz-ciudad">La Paz</option>
                <option value="el-alto">El Alto</option>
                <option value="cochabamba-ciudad">Cochabamba</option>
                <option value="santa-cruz-ciudad">Santa Cruz</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Número de celular</label>
              <input
                type="tel"
                name="celular"
                value={formData.celular}
                onChange={handleInputChange}
                placeholder="+591"
                className={styles.formInput}
              />
            </div>
          </section>

          {/* Sección 2: Formación académica */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Sección 2: Formación académica</h2>
            
            <div className={styles.formGroup}>
              <label>Universidad/Instituto</label>
              <input
                type="text"
                name="universidad"
                value={formData.universidad}
                onChange={handleInputChange}
                placeholder="Universidad Ejemplo"
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Título obtenido</label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder="Título obtenido"
                className={styles.formInput}
              />
            </div>

            <div className={styles.addMore}>
              <span>+ Añadir otra información</span>
            </div>
          </section>

          {/* Sección 3: Certificación */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Sección 3: Certificación (Opcional)</h2>
            
            <div className={styles.formGroup}>
              <label>Nombre de la certificación</label>
              <input
                type="text"
                name="certificacion"
                value={formData.certificacion}
                onChange={handleInputChange}
                placeholder="Nombre de la certificación"
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Entidad emisora</label>
              <input
                type="text"
                name="entidad"
                value={formData.entidad}
                onChange={handleInputChange}
                placeholder="Entidad emisora"
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Año</label>
              <select 
                name="año" 
                value={formData.año}
                onChange={handleInputChange}
                className={styles.formSelect}
              >
                <option value="">Año</option>
                {Array.from({length: 20}, (_, i) => 2024 - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className={styles.addMore}>
              <span>+ Añadir otra certificación</span>
            </div>
          </section>

          {/* Sección 4: Perfil como tutor */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Sección 4: Perfil como tutor</h2>
            
            <div className={styles.subjectGrid}>
                {['Matemáticas', 'Programas', 'Idiomas', 'Otro'].map(subject => (
                    <button
                    key={subject}
                    type="button"
                    className={`${styles.subjectBtn} ${formData.materias === subject ? styles.selected : ''}`}
                    onClick={() => handleCheckboxChange('materias', subject)}
                    >
                    <div className={styles.subjectIcon}>
                        {subject === 'Matemáticas' && '📊'}
                        {subject === 'Programas' && '💰'}
                        {subject === 'Idiomas' && '💡'}
                        {subject === 'Otro' && '🎨'}
                    </div>
                    <span>{subject}</span>
                    </button>
                ))}
            </div>

            <div className={styles.questionSection}>
              <h3>¿Cuándo puedes impartir clases?</h3>
              
              <div className={styles.subQuestion}>
                <h4>Modalidad</h4>
                <div className={styles.optionGroup}>
                  {['Virtual', 'Presencial', 'Ambos'].map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.optionBtn} ${formData.modalidad === option ? styles.selected : ''}`}
                      onClick={() => handleCheckboxChange('modalidad', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.subQuestion}>
                <h4>Horarios</h4>
                <div className={styles.optionGroup}>
                  {['Mañana', 'Tarde', 'Por confirmar'].map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.optionBtn} ${formData.horarios === option ? styles.selected : ''}`}
                      onClick={() => handleCheckboxChange('horarios', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.subQuestion}>
                <h4>Frecuencia</h4>
                <div className={styles.optionGroup}>
                  {['Una vez por semana', 'Dos veces por semana', 'Por confirmar'].map(option => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.optionBtn} ${formData.frecuencia === option ? styles.selected : ''}`}
                      onClick={() => handleCheckboxChange('frecuencia', option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button 
              type="button" 
              className={styles.submitBtn}
              onClick={handleSubmit}
            >
              Continuar
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Registrotu;