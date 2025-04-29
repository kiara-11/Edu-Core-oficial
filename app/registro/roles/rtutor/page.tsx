'use client'; 

import React, { useState, useEffect } from 'react';
import styles from './Rtutor.module.css'; 
import Link from 'next/link';
import Header from "@/components/Header";

const Page = () => {
  const [departamento, setDepartamento] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [celular, setCelular] = useState('');
  const [universidad, setUniversidad] = useState('');
  const [titulo, setTitulo] = useState('');
  const [certificacion, setCertificacion] = useState('');
  const [entidad, setEntidad] = useState('');
  const [anio, setAnio] = useState('');
  const [materia, setMateria] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [horario, setHorario] = useState('');
  const [frecuencia, setFrecuencia] = useState('');

  return (
    <div>
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
              <select 
                className={styles.formInput} 
                value={departamento} 
                onChange={(e) => setDepartamento(e.target.value)}
              >
                <option value="">Selecciona un departamento</option>
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
              <select 
                className={styles.formInput} 
                value={ciudad} 
                onChange={(e) => setCiudad(e.target.value)}
              >
                <option value="">Selecciona una ciudad</option>
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
              <input 
                type="text" 
                className={styles.formInput} 
                placeholder="+591" 
                value={celular} 
                onChange={(e) => setCelular(e.target.value)}
              />
            </div>
          </section>

          {/* Sección 2: Formación académica */}
          <section className={styles.registroSection}>
            <div className={styles.sectionHeader}>
              <h3>Sección 2: Formación académica</h3>
            </div>
            <div className={styles.formGroup}>
              <label>Universidad / Instituto</label>
              <input 
                type="text" 
                className={styles.formInput} 
                placeholder="Universidad / Instituto" 
                value={universidad} 
                onChange={(e) => setUniversidad(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Título obtenido</label>
              <input 
                type="text" 
                className={styles.formInput} 
                placeholder="Título obtenido" 
                value={titulo} 
                onChange={(e) => setTitulo(e.target.value)}
              />
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
              <input 
                type="text" 
                className={styles.formInput} 
                placeholder="Nombre de la certificación" 
                value={certificacion} 
                onChange={(e) => setCertificacion(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Entidad emisora</label>
              <input 
                type="text" 
                className={styles.formInput} 
                placeholder="Entidad emisora" 
                value={entidad} 
                onChange={(e) => setEntidad(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Año</label>
              <input 
                type="text" 
                className={styles.formInput} 
                placeholder="Año" 
                value={anio} 
                onChange={(e) => setAnio(e.target.value)}
              />
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
                  <input 
                    type="radio" 
                    name="materia" 
                    className={styles.hiddenRadio} 
                    onChange={() => setMateria(option)} 
                  />
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
                  <input 
                    type="radio" 
                    name="modalidad" 
                    className={styles.hiddenRadio} 
                    onChange={() => setModalidad(option)} 
                  />
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
                  <input 
                    type="radio" 
                    name="horario" 
                    className={styles.hiddenRadio} 
                    onChange={() => setHorario(option)} 
                  />
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
                  <input 
                    type="radio" 
                    name="frecuencia" 
                    className={styles.hiddenRadio} 
                    onChange={() => setFrecuencia(option)} 
                  />
                  <span className={styles.optionButton}>{option}</span>
                </label>
              ))}
            </div>
          </section>

          <div className={styles.continueContainer}>
            <Link href={(
              departamento && ciudad && celular && universidad && titulo && certificacion && 
              entidad && anio && materia && modalidad && horario && frecuencia
            ) ? "/registro/roles/rtutor/expe" : "#"}>
              <button 
                type="submit" 
                className={styles.continueButton} 
                disabled={
                  !(departamento && ciudad && celular && universidad && titulo && certificacion && 
                    entidad && anio && materia && modalidad && horario && frecuencia)
                }
              >
                Continuar
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
