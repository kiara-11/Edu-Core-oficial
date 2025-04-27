import React from 'react';
import styles from './Rtutor.module.css'; // Importa el módulo corregido
import Link from 'next/link';
import Header from "@/components/Header";

const Page = () => {
  return (
    <div >
      <Header />
      <div className={styles.backgroundLogo}>
        <img src="/logoBackground.png" alt="Logo de fondo" className={styles.logoImage} />
      </div>

      <div className={styles.registroContent}>
        <h1 className={styles.registroTitle}>Completa tu perfil de tutor</h1>

        <form className={styles.registroForm}>
          {/* Sección 1: Ubicación */}
          <section className={styles.registroSection}>
            <div className={styles.sectionHeader}>
              <h3>Sección 1: Ubicación</h3>
            </div>
            <div className={styles.formGroup}>
              <label>Departamento</label>
              <select className={styles.formInput}>
                <option>La Paz</option>
                <option>Cochabamba</option>
                <option>Oruro</option>
                <option>Potosí</option>
                <option>Chuquisaca</option>
                <option>Tarija</option>
                <option>Santa Cruz</option>
                <option>Beni</option>
                <option>Pando</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Ciudad</label>
              <select className={styles.formInput}>
                <option>La Paz</option>
                <option>El Alto</option>
                <option>Cochabamba</option>
                <option>Quillacollo</option>
                <option>Oruro</option>
                <option>Potosí</option>
                <option>Sucre</option>
                <option>Tarija</option>
                <option>Santa Cruz de la Sierra</option>
                <option>Montero</option>
                <option>Trinidad</option>
                <option>Cobija</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Número de celular</label>
              <input type="text" className={styles.formInput} placeholder="+591" />
            </div>
          </section>

          {/* Sección 2: Formación académica */}
          <section className={styles.registroSection}>
            <div className={styles.sectionHeader}>
              <h3>Sección 2: Formación académica</h3>
            </div>
            <div className={styles.formGroup}>
              <label>Universidad / Instituto</label>
              <input type="text" className={styles.formInput} placeholder="Universidad / Instituto" />
            </div>
            <div className={styles.formGroup}>
              <label>Título obtenido</label>
              <input type="text" className={styles.formInput} placeholder="Título obtenido" />
            </div>
            <div className={styles.añadirInfo}>+ Añadir otra información</div>
          </section>

          {/* Sección 3: Certificación */}
          <section className={styles.registroSection}>
            <div className={styles.sectionHeader}>
              <h3>Sección 3: Certificación (Opcional)</h3>
            </div>
            <div className={styles.formGroup}>
              <label>Nombre de la certificación</label>
              <input type="text" className={styles.formInput} placeholder="Nombre de la certificación" />
            </div>
            <div className={styles.formGroup}>
              <label>Entidad emisora</label>
              <input type="text" className={styles.formInput} placeholder="Entidad emisora" />
            </div>
            <div className={styles.formGroup}>
              <label>Año</label>
              <input type="text" className={styles.formInput} placeholder="Año" />
            </div>
            <div className={styles.añadirInfo}>+ Añadir otra certificación</div>
          </section>

          {/* Sección 4: Perfil como tutor */}
          <section className={styles.registroSection}>
            <div className={styles.sectionHeader}>
              <h3>Sección 4: Perfil como tutor</h3>
            </div>

            <div className={styles.sectionHeader}>
              <h4>¿Qué materias te gustaría enseñar?</h4>
            </div>
            <div className={styles.optionsGrid}>
              {["Matemáticas", "Finanzas", "Idiomas", "Arte", "Tecnología e Informática", "Otro"].map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input type="radio" name="materia" className={styles.hiddenRadio} />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>

            <div className={styles.sectionHeader}>
              <h4>¿Cuándo puedes impartir clases?</h4>
              <h5>Modalidad</h5>
            </div>
            <div className={styles.optionsGrid}>
              {["Virtual", "Presencial", "Ambos"].map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input type="radio" name="modalidad" className={styles.hiddenRadio} />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>

            <div className={styles.sectionHeader}>
              <h5>Horario</h5>
            </div>
            <div className={styles.optionsGrid}>
              {["Mañana", "Tarde", "Por confirmar"].map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input type="radio" name="horario" className={styles.hiddenRadio} />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>

            <div className={styles.sectionHeader}>
              <h5>Frecuencia</h5>
            </div>
            <div className={styles.optionsGrid}>
              {["Una vez por semana", "Dos veces por semana", "Por confirmar"].map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input type="radio" name="frecuencia" className={styles.hiddenRadio} />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>
          </section>

          <div className={styles.continueContainer}>
          <Link href="/registro/roles/rtutor/expe">
              <button type="submit" className={styles.continueButton}>Continuar</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
