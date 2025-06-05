'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Registrotu.module.css';

type Documento = {
  nombre: string;
  base64: string;
};

const Registrotu = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    departamento: '',
    ciudad: '',
    celular: '',
    universidad: '',
    titulo: '',
    certificacion: '',
    entidad: '',
    año: '',
    fe_in_prof: '',      // Nueva fecha inicio profesión
    fe_fin_prof: '',     // Nueva fecha fin profesión  
    fe_tit: '',          // Nueva fecha título
    materias: '',
    modalidad: '',
    horarios: '',
    frecuencia: ''
  });

  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [certificaciones, setCertificaciones] = useState<Documento[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (category: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category] === value ? '' : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'documento' | 'certificacion') => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    
    // Validar que sea PDF
    if (file.type !== 'application/pdf') {
      setError('Solo se permiten archivos PDF');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no debe superar los 5MB');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      const nuevoArchivo: Documento = {
        nombre: file.name,
        base64: base64String
      };

      if (tipo === 'documento') {
        setDocumentos(prev => [...prev, nuevoArchivo]);
      } else {
        setCertificaciones(prev => [...prev, nuevoArchivo]);
      }
      
      setError('');
    };

    reader.readAsDataURL(file);
  };

  // Función de validación mejorada
  const validateForm = () => {
    const requiredFields = [
      { field: 'departamento', label: 'Departamento' },
      { field: 'ciudad', label: 'Ciudad' },
      { field: 'universidad', label: 'Universidad/Instituto' },
      { field: 'titulo', label: 'Título obtenido' },
      { field: 'materias', label: 'Materia que enseñas' },
      { field: 'modalidad', label: 'Modalidad' },
      { field: 'horarios', label: 'Horarios' },
      { field: 'frecuencia', label: 'Frecuencia' }
    ];

    const missingFields = requiredFields.filter(
      ({ field }) => !formData[field as keyof typeof formData] || formData[field as keyof typeof formData].trim() === ''
    );

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(({ label }) => label).join(', ');
      setError(`Los siguientes campos son obligatorios: ${fieldNames}`);
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    // Validar campos obligatorios
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const email = localStorage.getItem('email');
      if (!email) {
        setError('No se encontró información del usuario. Inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      const solicitudData = {
        email,
        ...formData,
        documentos,
        certificaciones
      };

      const response = await fetch('/api/solicitud-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitudData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Error al enviar la solicitud');
      }

      // Guardar estado local para mantener compatibilidad
      localStorage.setItem('solicitudTutorPendiente', 'true');
      localStorage.setItem('solicitudTutorEstado', 'Pendiente');

      setModalVisible(true);

    } catch (error) {
      console.error('Error al enviar solicitud:', error);
      setError(error instanceof Error ? error.message : 'Error al enviar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const removeDocument = (index: number, tipo: 'documento' | 'certificacion') => {
    if (tipo === 'documento') {
      setDocumentos(prev => prev.filter((_, i) => i !== index));
    } else {
      setCertificaciones(prev => prev.filter((_, i) => i !== index));
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    router.push('/notificaciones');
  };

  return (
    <div className={styles.tutorFormContainer}>
      <div className={styles.formCard}>
        <h1 className={styles.formTitle}>Completa tu perfil de tutor</h1>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <div className={styles.formWrapper}>
          {/* Sección 1: Ubicación */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Sección 1: Ubicación</h2>
            <div className={styles.formGroup}>
              <label>Departamento <span style={{color: '#F67766'}}>*</span></label>
              <select
                name="departamento"
                value={formData.departamento}
                onChange={handleInputChange}
                className={styles.formSelect}
                required
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
              <label>Ciudad <span style={{color: '#F67766'}}>*</span></label>
              <select
                name="ciudad"
                value={formData.ciudad}
                onChange={handleInputChange}
                className={styles.formSelect}
                required
              >
                <option value="">Seleccionar Ciudad</option>
                <option value="la-paz-ciudad">La Paz</option>
                <option value="el-alto">El Alto</option>
                <option value="cochabamba-ciudad">Cochabamba</option>
                <option value="santa-cruz-ciudad">Santa Cruz</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Número de celular <span style={{color: '#F67766'}}>*</span></label>
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
              <label>Universidad/Instituto <span style={{color: '#F67766'}}>*</span></label>
              <input
                type="text"
                name="universidad"
                value={formData.universidad}
                onChange={handleInputChange}
                placeholder="Universidad Ejemplo"
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Título obtenido <span style={{color: '#F67766'}}>*</span></label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder="Título obtenido"
                className={styles.formInput}
                required
              />
            </div>

            {/* NUEVOS CAMPOS DE FECHA */}
            <div className={styles.formGroup}>
              <label>Fecha de obtención del título <span style={{color: '#F67766'}}>*</span></label>
              <input
                type="date"
                name="fe_tit"
                value={formData.fe_tit}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Fecha de inicio como profesional <span style={{color: '#F67766'}}>*</span></label>
              <input
                type="date"
                name="fe_in_prof"
                value={formData.fe_in_prof}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Fecha de fin como profesional <span style={{color: '#F67766'}}>*</span></label>
              <input
                type="date"
                name="fe_fin_prof"
                value={formData.fe_fin_prof}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>
          </section>

          {/* Sección 3: Certificación (Opcional) */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Sección 3: Certificación <span style={{color: '#F67766'}}>*</span></h2>
            <div className={styles.formGroup}>
              <label>Nombre de la certificación <span style={{color: '#F67766'}}>*</span></label>
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
              <label>Entidad emisora <span style={{color: '#F67766'}}>*</span></label>
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
              <label>Año <span style={{color: '#F67766'}}>*</span></label>
              <select
                name="año"
                value={formData.año}
                onChange={handleInputChange}
                className={styles.formSelect}
              >
                <option value="">Año</option>
                {Array.from({ length: 20 }, (_, i) => 2024 - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Subida de documentos PDF */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Documentos (PDF) <span style={{color: '#999', fontSize: '18px'}}>(Opcional)</span></h2>

            <div className={styles.formGroup}>
              <label>Agregar Documento (PDF) de certificados <span style={{color: '#999', fontSize: '14px'}}>(opcional)</span>:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => handleFileChange(e, 'documento')}
                className={styles.formInput}
              />
            </div>

            {documentos.length > 0 && (
              <div className={styles.documentList}>
                <h4>Documentos cargados:</h4>
                <ul>
                  {documentos.map((doc, i) => (
                    <li key={i} className={styles.documentItem}>
                      <span>{doc.nombre}</span>
                      <button 
                        type="button"
                        onClick={() => removeDocument(i, 'documento')}
                        className={styles.removeBtn}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Agregar Certificaciones adicionales (PDF) <span style={{color: '#999', fontSize: '14px'}}>(opcional)</span>:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => handleFileChange(e, 'certificacion')}
                className={styles.formInput}
              />
            </div>

            {certificaciones.length > 0 && (
              <div className={styles.documentList}>
                <h4>Certificaciones cargadas:</h4>
                <ul>
                  {certificaciones.map((cert, i) => (
                    <li key={i} className={styles.documentItem}>
                      <span>{cert.nombre}</span>
                      <button 
                        type="button"
                        onClick={() => removeDocument(i, 'certificacion')}
                        className={styles.removeBtn}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Sección 4: Perfil como tutor */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Sección 4: Perfil como tutor</h2>
            
            <div className={styles.formGroup}>
              <label style={{textAlign: 'center', display: 'block'}}>¿Qué materia enseñas? <span style={{color: '#F67766'}}>*</span></label>
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
                      {subject === 'Programas' && '💻'}
                      {subject === 'Idiomas' && '🌐'}
                      {subject === 'Otro' && '🎨'}
                    </div>
                    <span>{subject}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.questionSection}>
              <h3>¿Cuándo puedes impartir clases?</h3>
              <div className={styles.subQuestion}>
                <h4>Modalidad <span style={{color: '#F67766'}}>*</span></h4>
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
                <h4>Horarios <span style={{color: '#F67766'}}>*</span></h4>
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
                <h4>Frecuencia <span style={{color: '#F67766'}}>*</span></h4>
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
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Continuar'}
            </button>
          </section>
        </div>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Solicitud enviada</h2>
            <p>Tu solicitud ha sido enviada correctamente y está pendiente de aprobación por parte del administrador.</p>
            <button className={styles.modalBtn} onClick={closeModal}>
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Registrotu;