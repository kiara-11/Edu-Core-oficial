import React from 'react';
import './StatsBar.css';
import Image from 'next/image';

const StatsBar = () => {
  return (
    <section className="stats-bar">
      <div className="stat">
        <div className="stat-icon">
          <Image src="/tutor.png" alt="Tutores" width={32} height={32} />
        </div>
        <div className="stat-text">
          <h3>3K+</h3>
          <p>Tutores Registrados</p>
        </div>
      </div>

      <div className="stat">
        <div className="stat-icon">
          <Image src="/clases.png" alt="Clases" width={32} height={32} />
        </div>
        <div className="stat-text">
          <h3>15K+</h3>
          <p>Clases Impartidas Exitosamente</p>
        </div>
      </div>

      <div className="stat">
        <div className="stat-icon">
          <Image src="/satisfaccion.png" alt="Satisfacción" width={32} height={32} />
        </div>
        <div className="stat-text">
          <h3>97%+</h3>
          <p>Nivel De Satisfacción De Estudiantes</p>
        </div>
      </div>
    </section>
  );
};

export default StatsBar;