'use client';
import React, { useState, useEffect } from 'react';
import styles from './Restudiante.module.css';
import Link from 'next/link';
import Header from "@/components/Header";

const Page = () => {
  const [interesa, setInteresa] = useState('');
  const [academico, setAcademico] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [horario, setHorario] = useState('');
  const [frecuencia, setFrecuencia] = useState('');
  const [isFormValid, setIsFormValid] = useState(false); 

  useEffect(() => {

    const validateForm = () => {
      if (interesa && academico && modalidad && horario && frecuencia) {
        setIsFormValid(true);
      } else {
        setIsFormValid(false);
      }
    };
    
    validateForm();  // Validar el formulario cada vez que cambie un campo
  }, [interesa, academico, modalidad, horario, frecuencia]);

  return (
    <div>
      <Header />
      <div className={styles.backgroundLogo}>
        <img src="/logoBackground.png" alt="Logo de fondo" className={styles.logoImage} />
      </div>

      <div className={styles.registroContent}>
        <h1 className={styles.registroTitle}>Personaliza tu experiencia</h1>

        <form className={styles.registroForm}>
          {/* Sección 1: ¿Qué te interesa aprender? */}
          <section className={styles.registroSection}>
            <h3>¿Qué te interesa aprender?</h3>
            <div className={styles.optionsGrid}>
              {["Matemáticas", "Finanzas", "Idiomas", "Arte", "Tecnología e Informática", "Otro"].map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input
                    type="radio"
                    name="interesa"
                    value={option}
                    checked={interesa === option}
                    onChange={(e) => setInteresa(e.target.value)} // Actualiza el estado
                    className={styles.hiddenRadio}
                  />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Sección 2: Tu perfil académico */}
          <section className={styles.registroSection}>
            <h3>Tu perfil académico</h3>
            <div className={styles.optionsGrid}>
              {["Primaria", "Secundaria", "Universidad", "Profesional", "Otro"].map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input
                    type="radio"
                    name="academico"
                    value={option}
                    checked={academico === option}
                    onChange={(e) => setAcademico(e.target.value)} // Actualiza el estado
                    className={styles.hiddenRadio}
                  />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Sección 3: ¿Cómo prefieres aprender? */}
          <section className={styles.registroSection}>
            <h3>¿Cómo prefieres aprender?</h3>
            <h4>Modalidad</h4>
            <div className={styles.optionsGrid}>
              {["Virtual", "Presencial", "Ambos"].map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input
                    type="radio"
                    name="modalidad"
                    value={option}
                    checked={modalidad === option}
                    onChange={(e) => setModalidad(e.target.value)} // Actualiza el estado
                    className={styles.hiddenRadio}
                  />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>

            <h4>Horario</h4>
            <div className={styles.optionsGrid}>
              {["Mañana", "Tarde", "Noche", "Por confirmar"].map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input
                    type="radio"
                    name="horario"
                    value={option}
                    checked={horario === option}
                    onChange={(e) => setHorario(e.target.value)} // Actualiza el estado
                    className={styles.hiddenRadio}
                  />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>

            <h4>Frecuencia</h4>
            <div className={styles.optionsGrid}>
              {["Una vez por semana", "Dos veces por semana", "Por confirmar"].map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input
                    type="radio"
                    name="frecuencia"
                    value={option}
                    checked={frecuencia === option}
                    onChange={(e) => setFrecuencia(e.target.value)} // Actualiza el estado
                    className={styles.hiddenRadio}
                  />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Botón solo habilitado si todos los campos están completos */}
          <div className={styles.continueContainer}>
            <Link href={isFormValid ? "/registro/roles/restudiante/rfinal" : "#"} passHref>
              <button 
                type="submit" 
                className={styles.continueButton} 
                disabled={!isFormValid}
                style={{ opacity: isFormValid ? 1 : 0.5 }}
              >
                Completado
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
