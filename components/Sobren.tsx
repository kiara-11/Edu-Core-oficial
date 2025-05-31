import React from 'react';
import styles from './Sobren.module.css';

function Sobren() {
  const teamMembers = [
    {
      name: "Kiara Carmen Pino Morales",
      role: "Estudiante de la carrera de Ingeniería de Sistemas",
      photo: "/kiara-photo.png"
    },
    {
      name: "Mauricio David Mercado",
      role: "Estudiante de la carrera de Ingeniería de Sistemas",
      photo: "/mauricio-photo.png"
    },
    {
      name: "Evelyn Cristina Burgoa Aliagah",
      role: "Estudiante de la carrera de Ingeniería de Sistemas",
      photo: "/evelyn-photo.png"
    },
    {
      name: "Wara Rocío Huañapaco Laura",
      role: "Estudiante de la carrera de Ingeniería de Sistemas",
      photo: "/Wara-photo.png"
    }
  ];

  return (
    <>
      <main className={styles['sobren-container']}>
        <h2 className={styles['sobren-title']}>Sobre Nosotros</h2>
        <div className={styles['sobren-content']}>
          <div className={styles['sobren-images-left']}>
            <img src="/foto1.png" alt="Estudiante 1" className={styles['img-vertical']} />
          </div>

          <div className={styles['sobren-images-center']}>
            <img src="/foto-edificio.png" alt="Edificio EMI" className={styles['img-small']} />
            <img src="/foto-estudiantes.png" alt="Estudiantes conversando" className={styles['img-small1']} />
          </div>

          <div className={styles['sobren-text']}>
            <h3><span className={styles['highlighted']}>EduCore</span> Es Un Proyecto <br /> Desarrollado Por Estudiantes De La EMI.</h3>
            <h5 className={styles['p2']}>
              Con el propósito de transformar la forma en que se imparten clases particulares. Creamos una plataforma que conecta fácilmente a tutores calificados con estudiantes, ofreciendo una experiencia segura, flexible y moderna para ambos.
            </h5>

            <div className={styles['sobren-mision-vision']}>
              <div className={styles['mision']}>
                <h4>MISIÓN:</h4>
                <p>Facilitar el acceso a clases personalizadas mediante tecnología y confianza.</p>
              </div>
              <div className={styles['vision']}>
                <h4>VISIÓN:</h4>
                <p>Ser la plataforma educativa de referencia en Bolivia para el aprendizaje personalizado.</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles['proposito-section']}>
          <h2 className={styles['proposito-title']}>CREAMOS EDUCORE CON PROPÓSITO</h2>

          <div className={styles['valores-container']}>
            <div className={styles['valor-card']}>
              <div className={styles['valor-header']}>
                <h3>Innovación Inteligente</h3>
              </div>
              <div className={styles['valor-icon']}>
                <img src="/icono-innovacion.png" alt="Innovación" className={styles['icon-img']} />
              </div>
              <p className={styles['valor-description']}>
                Desarrollamos EduCore aplicando la creatividad de la EMI y escuchando las necesidades reales de estudiantes y tutores.
              </p>
            </div>

            <div className={styles['valor-card']}>
              <div className={styles['valor-header']}>
                <h3>Educación con Confianza</h3>
              </div>
              <div className={styles['valor-icon']}>
                <img src="/icono-confianza.png" alt="Confianza" className={styles['icon-img']} />
              </div>
              <p className={styles['valor-description']}>
                Validamos a cada tutor y cuidamos que cada clase ofrecida sea segura, transparente y de calidad.
              </p>
            </div>

            <div className={styles['valor-card']}>
              <div className={styles['valor-header']}>
                <h3>Compromiso Estudiantil</h3>
              </div>
              <div className={styles['valor-icon']}>
                <img src="/icono-compromiso.png" alt="Compromiso" className={styles['icon-img']} />
              </div>
              <p className={styles['valor-description']}>
                Somos estudiantes como tú, y por eso entendemos lo importante que es tener acceso a buenos tutores y horarios flexibles.
              </p>
            </div>
          </div>
        </div>
      </main>

      <section className={styles['team-section']}>
        <div className={styles['team-container']}>
          <h2 className={styles['team-title']}>Conoce al Equipo Detrás de EduCore</h2>

          <div className={styles['team-grid']}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles['team-member-card']}>
                <div className={styles['member-photo-container']}>
                  <img
                    src={member.photo}
                    alt={member.name}
                    className={styles['member-photo']}
                  />
                </div>
                <div className={styles['member-info']}>
                  <h3 className={styles['member-name']}>{member.name}</h3>
                  <p className={styles['member-role']}>{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Sobren;
