import HeaderInicio from '../../../../components/HeaderInicio';
import styles from './Restudiante.module.css';
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
        <h1 className={styles.registroTitle}>Personaliza tu experiencia</h1>

        <form className={styles.registroForm}>
          <section className={styles.registroSection}>
            <h3>¿Qué te interesa aprender?</h3>
            <div className={styles.optionsGrid}>
              {["Matemáticas", "Finanzas", "Idiomas", "Arte", "Tecnología e Informática", "Otro"].map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input type="radio" name="interesa" className={styles.hiddenRadio} />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>
          </section>

          <section className={styles.registroSection}>
            <h3>Tu perfil académico</h3>
            <div className={styles.optionsGrid}>
              {["Primaria", "Secundaria", "Universidad", "Profesional", "Otro"].map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input type="radio" name="academico" className={styles.hiddenRadio} />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>
          </section>

          <section className={styles.registroSection}>
            <h3>¿Cómo prefieres aprender?</h3>

            <h4>Modalidad</h4>
            <div className={styles.optionsGrid}>
              {["Virtual", "Presencial", "Ambos"].map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input type="radio" name="modalidad" className={styles.hiddenRadio} />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>

            <h4>Horario</h4>
            <div className={styles.optionsGrid}>
              {["Mañana", "Tarde", "Noche", "Por confirmar"].map((option, index) => (
                <label key={index} className={styles.optionLabel}>
                  <input type="radio" name="horario" className={styles.hiddenRadio} />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>

            <h4>Frecuencia</h4>
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
            <Link href="/registro/roles/restudiante/rfinal">
              <button type="submit" className={styles.continueButton}>Completado</button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
