import React from 'react';
import styles from './Formul.module.css';
import Link from 'next/link';
const Formul = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Conviértete en Tutor en EduCore</h1>
        <p className={styles.subtitle}>
          Explora los beneficios de formar parte de nuestra red de tutores
          <br />
          y lleva tu enseñanza al siguiente nivel.
        </p>
      </div>

      <div className={styles.content}>
        <div className={styles.mainSection}>
          <div className={styles.mainCard}>
            <div className={styles.illustration}>
              <img 
                src="/tutor-main-illustration.png" 
                alt="Ilustración principal de tutores" 
                className={styles.mainImage}
              />
              <div className={styles.badge}>OPORTUNIDAD</div>
            </div>
          </div>
          
          <div className={styles.mainContent}>
            <h2 className={styles.mainTitle}>Amplía tu impacto educativo</h2>
            <p className={styles.mainText}>
              Tu perfil será visible para cientos de estudiantes que buscan clases personalizadas. 
              EduCore promociona tus cursos y te conecta directamente con quienes necesitan tu experiencia.
            </p>
          </div>
        </div>

        {/* Sección de tarjetas derechas */}
        <div className={styles.rightSection}>
          <div className={styles.card}>
            <div className={styles.cardIconContainer}>
              {/* Aquí va tu imagen de flexibilidad */}
              <img 
                src="/flexibility-icon.png" 
                alt="Flexibilidad" 
                className={styles.cardIcon}
              />
              <div className={styles.cardBadge}>FLEXIBILIDAD</div>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Tú decides cuándo y cómo enseñar</h3>
              <p className={styles.cardText}>
                Fije tu horario, modalidad (virtual, presencial o híbrida) y organiza tus 
                clases según tu disponibilidad. EduCore se adapta a tu ritmo.
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIconContainer}>
              {/* Aquí va tu imagen de acompañamiento */}
              <img 
                src="/team-support-icon.png" 
                alt="Acompañamiento" 
                className={styles.cardIcon}
              />
              <div className={styles.cardBadge}>ACOMPAÑAMIENTO</div>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>No estás solo, estás en equipo</h3>
              <p className={styles.cardText}>
                Nuestro equipo te acompaña con soporte técnico, guías, recursos 
                didácticos y atención personalizada para que solo te enfoques en enseñar.
              </p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIconContainer}>
              {/* Aquí va tu imagen de ingresos */}
              <img 
                src="/money-earnings-icon.png" 
                alt="Ingresos" 
                className={styles.cardIcon}
              />
              <div className={styles.cardBadge}>INGRESOS</div>
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>Monetiza tu experiencia sin límites</h3>
              <p className={styles.cardText}>
                Ofrece clases individuales, grupales o pequeñas. Tú defines tu tarifa y 
                modalidad, y mientras más valor entregas, más ingresos puedes generar.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Requisitos */}
      <div className={styles.requirementsSection}>
        <div className={styles.requirementsContent}>
          <div className={styles.requirementsText}>
            <h2 className={styles.requirementsTitle}>Requisitos para convertirte en Tutor</h2>
            <ul className={styles.requirementsList}>
              <li className={styles.requirementItem}>
                <span className={styles.requirementDot}></span>
                <span className={styles.requirementText}>
                  Certificado o título que avale tu formación académica o técnica.
                </span>
              </li>
              <li className={styles.requirementItem}>
                <span className={styles.requirementDot}></span>
                <span className={styles.requirementText}>
                  Dominio claro del área que deseas enseñar.
                </span>
              </li>
              <li className={styles.requirementItem}>
                <span className={styles.requirementDot}></span>
                <span className={styles.requirementText}>
                  Disponibilidad para brindar clases virtuales, presenciales o mixtas.
                </span>
              </li>
              <li className={styles.requirementItem}>
                <span className={styles.requirementDot}></span>
                <span className={styles.requirementText}>
                  Experiencia previa impartiendo clases o tutorías (formal o informal).
                </span>
              </li>
              <li className={styles.requirementItem}>
                <span className={styles.requirementDot}></span>
                <span className={styles.requirementText}>
                  Buena actitud, responsabilidad y vocación educativa.
                </span>
              </li>
              <li className={styles.requirementItem}>
                <span className={styles.requirementDot}></span>
                <span className={styles.requirementText}>
                  Deseamos reclutar a los estudiantes clases de calidad y tutorías altamente especializadas.
                </span>
              </li>
            </ul>
            <Link href="/registro-tutor">
  <button className={styles.registerButton}>
    REGISTRARSE COMO TUTOR
  </button>
</Link>
          </div>
          
          <div className={styles.requirementsImageSection}>
            <div className={styles.requirementsImageContainer}>
              <img 
                src="/tutor-woman.png" 
                alt="Tutora profesional" 
                className={styles.requirementsImage}
              />
            </div>
            <div className={styles.validationCard}>
              <h3 className={styles.validationTitle}>Validación profesional EduCore</h3>
              <p className={styles.validationText}>
                Todo aspirante a tutor será evaluado por nuestro equipo.
                <br />
                Revisaremos tus certificados, títulos, experiencia y 
                perfil académico antes de aprobar tu incorporación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Formul;