'use client';

import { useState } from 'react';
import styles from './PublicarCurso.module.css';

interface Horario {
  dia: string;
  inicio: string;
  fin: string;
}

export default function PublicarCurso() {
  const [nombreCurso, setNombreCurso] = useState('');
  const [nivel, setNivel] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [duracion, setDuracion] = useState('');
  const [modalidad, setModalidad] = useState('');
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [diaTemp, setDiaTemp] = useState('');
  const [inicioTemp, setInicioTemp] = useState('');
  const [finTemp, setFinTemp] = useState('');

  const agregarHorario = () => {
    if (diaTemp && inicioTemp && finTemp) {
      setHorarios([...horarios, { dia: diaTemp, inicio: inicioTemp, fin: finTemp }]);
      setDiaTemp('');
      setInicioTemp('');
      setFinTemp('');
    }
  };

  const quitarHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const publicarCurso = () => {
    const cursoData = {
      nombreCurso,
      nivel,
      descripcion,
      precio,
      duracion,
      modalidad,
      horarios
    };
    console.log('Curso a publicar:', cursoData);
  };

  const cancelar = () => {
    setNombreCurso('');
    setNivel('');
    setDescripcion('');
    setPrecio('');
    setDuracion('');
    setModalidad('');
    setHorarios([]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2 className={styles.title}>Publicar nuevo curso</h2>
        
        <div className={styles.formGroup}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Nombre del curso:</label>
              <input
                type="text"
                placeholder="Nombre del curso"
                value={nombreCurso}
                onChange={(e) => setNombreCurso(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label>Nivel:</label>
              <select
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                className={styles.select}
              >
                <option value="">Intermedio</option>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Descripción del curso:</label>
              <textarea
                placeholder="Descripción del curso"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className={styles.textarea}
              />
            </div>
            <div className={styles.field}>
              <label>Precio:</label>
              <div className={styles.priceContainer}>
                <input
                  type="number"
                  placeholder="250"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  className={styles.priceInput}
                />
                <select className={styles.currency}>
                  <option value="bs">Bs.</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Duración del curso:</label>
              <select
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                className={styles.select}
              >
                <option value="">Horas</option>
                <option value="20">20 horas</option>
                <option value="40">40 horas</option>
                <option value="60">60 horas</option>
                <option value="80">80 horas</option>
              </select>
            </div>
            <div className={styles.field}>
              <label>Modalidad:</label>
              <select
                value={modalidad}
                onChange={(e) => setModalidad(e.target.value)}
                className={styles.select}
              >
                <option value="">Online</option>
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>
          </div>
        </div>

        <h3 className={styles.horariosTitle}>Horarios disponibles</h3>
        
        <div className={styles.horarioForm}>
          <div className={styles.horarioInputs}>
            <div className={styles.horarioField}>
              <label>Día:</label>
              <select
                value={diaTemp}
                onChange={(e) => setDiaTemp(e.target.value)}
                className={styles.select}
              >
                <option value="">Lunes</option>
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miercoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
                <option value="sabado">Sábado</option>
                <option value="domingo">Domingo</option>
              </select>
            </div>
            <div className={styles.horarioField}>
              <label>Horario de inicio:</label>
              <input
                type="time"
                value={inicioTemp}
                onChange={(e) => setInicioTemp(e.target.value)}
                className={styles.timeInput}
              />
            </div>
            <div className={styles.horarioField}>
              <label>Horario de finalización:</label>
              <input
                type="time"
                value={finTemp}
                onChange={(e) => setFinTemp(e.target.value)}
                className={styles.timeInput}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={agregarHorario}
            className={styles.agregarBtn}
          >
            AGREGAR HORARIO
          </button>
        </div>

        {horarios.length > 0 && (
          <div className={styles.horariosTable}>
            <div className={styles.tableHeader}>
              <span>Día</span>
              <span>Horario de inicio:</span>
              <span>Horario de finalización:</span>
              <span></span>
            </div>
            {horarios.map((horario, index) => (
              <div key={index} className={styles.tableRow}>
                <span>{horario.dia}</span>
                <span>{horario.inicio}</span>
                <span>{horario.fin}</span>
                <button
                  onClick={() => quitarHorario(index)}
                  className={styles.quitarBtn}
                >
                  Quitar 🗑️
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={publicarCurso}
            className={styles.publicarBtn}
          >
            PUBLICAR CURSO
          </button>
          <button
            type="button"
            onClick={cancelar}
            className={styles.cancelarBtn}
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
}