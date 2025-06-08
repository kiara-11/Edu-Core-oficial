'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Registrotu.module.css';

// MODIFICACIÓN: Este tipo ya no es necesario ya que no usaremos un array de objetos.
// type Documento = {
//   nombre: string;
//   base64: string;
// };

const Registrotu = () => {
  const router = useRouter();

  // MODIFICACIÓN: Se añaden los campos para los archivos directamente al formData.
  const [formData, setFormData] = useState({
    departamento: '',
    ciudad: '',
    celular: '',
    universidad: '',
    titulo: '',
    certificacion: '',
    entidad: '',
    año: '',
    fe_in_prof: '',
    fe_fin_prof: '',
    fe_tit: '',
    materias: '',
    modalidad: '',
    horarios: '',
    frecuencia: '',
    documento_nombre: '',     // Nombre del archivo de documento
    documento_pdf: '',         // Base64 del archivo de documento
    certificacion_nombre: '',  // Nombre del archivo de certificación
    certificacion_pdf: ''      // Base64 del archivo de certificación
  });

  // MODIFICACIÓN: Estos estados ya no son necesarios. La información está en formData.
  // const [documentos, setDocumentos] = useState<Documento[]>([]);
  // const [certificaciones, setCertificaciones] = useState<Documento[]>([]);
  
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

  // MODIFICACIÓN: La lógica cambia para actualizar el estado formData.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'documento' | 'certificacion') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    if (file.type !== 'application/pdf') {
      setError('Solo se permiten archivos PDF');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('El archivo no debe superar los 5MB');
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      
      if (tipo === 'documento') {
        setFormData(prev => ({
          ...prev,
          documento_nombre: file.name,
          documento_pdf: base64String
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          certificacion_nombre: file.name,
          certificacion_pdf: base64String
        }));
      }
      
      setError('');
    };

    reader.readAsDataURL(file);
    e.target.value = ''; // Limpiar para poder subir el mismo archivo de nuevo
  };
  
  // MODIFICACIÓN: Nueva función para eliminar un archivo del estado formData.
  const removeDocument = (tipo: 'documento' | 'certificacion') => {
    if (tipo === 'documento') {
      setFormData(prev => ({
        ...prev,
        documento_nombre: '',
        documento_pdf: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        certificacion_nombre: '',
        certificacion_pdf: ''
      }));
    }
  };

  // Función para hacer scroll al primer campo vacío (RESTAURADA DEL CÓDIGO ORIGINAL)
  const scrollToFirstEmptyField = () => {
    const requiredFields = [
      { field: 'departamento', name: 'departamento' },
      { field: 'ciudad', name: 'ciudad' },
      { field: 'universidad', name: 'universidad' },
      { field: 'titulo', name: 'titulo' },
      { field: 'fe_tit', name: 'fe_tit' },
      { field: 'fe_in_prof', name: 'fe_in_prof' },
      { field: 'fe_fin_prof', name: 'fe_fin_prof' },
      { field: 'certificacion', name: 'certificacion' },
      { field: 'entidad', name: 'entidad' },
      { field: 'año', name: 'año' },
      { field: 'materias', name: 'materias' },
      { field: 'modalidad', name: 'modalidad' },
      { field: 'horarios', name: 'horarios' },
      { field: 'frecuencia', name: 'frecuencia' }
    ];

    for (const { field, name } of requiredFields) {
      const fieldValue = formData[field as keyof typeof formData];
      if (!fieldValue || fieldValue.trim() === '') {
        // Para campos select y input normales
        const element = document.querySelector(`[name="${name}"]`) as HTMLElement;
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          element.focus();
          return true;
        }
        
        // Para campos de botones (materias, modalidad, horarios, frecuencia)
        if (['materias', 'modalidad', 'horarios', 'frecuencia'].includes(field)) {
          const buttonSection = document.querySelector(`[data-field="${field}"]`) as HTMLElement;
          if (buttonSection) {
            buttonSection.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
            return true;
          }
        }
      }
    }
    return false;
  };

  // Función de validación mejorada (RESTAURADA DEL CÓDIGO ORIGINAL)
  const validateForm = () => {
    const requiredFields = [
      { field: 'departamento', label: 'Departamento' },
      { field: 'ciudad', label: 'Ciudad' },
      { field: 'universidad', label: 'Universidad/Instituto' },
      { field: 'titulo', label: 'Título obtenido' },
      { field: 'fe_tit', label: 'Fecha de obtención del título' },
      { field: 'fe_in_prof', label: 'Fecha de inicio como profesional' },
      { field: 'fe_fin_prof', label: 'Fecha de fin como profesional' },
      { field: 'certificacion', label: 'Nombre de la certificación' },
      { field: 'entidad', label: 'Entidad emisora' },
      { field: 'año', label: 'Año' },
      { field: 'materias', label: 'Materia que enseñas' },
      { field: 'modalidad', label: 'Modalidad' },
      { field: 'horarios', label: 'Horarios' },
      { field: 'frecuencia', label: 'Frecuencia' }
    ];

    const missingFields = requiredFields.filter(
      ({ field }) => !formData[field as keyof typeof formData] || formData[field as keyof typeof formData].trim() === ''
    );

    if (missingFields.length > 0) {
      setError(`Por favor, completa los siguientes campos obligatorios: ${missingFields.map(f => f.label).join(', ')}.`);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      scrollToFirstEmptyField();
      return;
    }

    try {
      const email = localStorage.getItem('email');
      if (!email) {
        setError('No se encontró información del usuario. Inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      // MODIFICACIÓN: El objeto a enviar es simplemente el formData, que ya lo contiene todo.
      // Se crea un objeto sin los campos de nombre de archivo para no enviarlos al backend.
      const { documento_nombre, certificacion_nombre, ...dataParaEnviar } = formData;

      const solicitudData = {
        email,
        ...dataParaEnviar
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
          {/* Sección 1: Ubicación (RESTAURADA DEL CÓDIGO ORIGINAL) */}
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

          {/* Sección 2: Formación académica (RESTAURADA DEL CÓDIGO ORIGINAL) */}
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

          {/* Sección 3: Certificación (RESTAURADA DEL CÓDIGO ORIGINAL) */}
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

            {/* --- PRIMER ARCHIVO --- */}
            <div className={styles.formGroup}>
              <label>Agregar Documento (PDF) de certificados <span style={{color: '#999', fontSize: '14px'}}>(opcional)</span>:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => handleFileChange(e, 'documento')}
                className={styles.formInput}
                // Deshabilitar si ya hay un archivo cargado para evitar confusiones
                disabled={!!formData.documento_nombre} 
              />
            </div>

            {/* MODIFICACIÓN: Mostrar el archivo cargado desde formData */}
            {formData.documento_nombre && (
              <div className={styles.documentList}>
                <ul>
                  <li className={styles.documentItem}>
                    <span>{formData.documento_nombre}</span>
                    <button 
                      type="button"
                      onClick={() => removeDocument('documento')}
                      className={styles.removeBtn}
                    >
                      ❌
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* --- SEGUNDO ARCHIVO --- */}
            <div className={styles.formGroup}>
              <label>Agregar Certificaciones adicionales (PDF) <span style={{color: '#999', fontSize: '14px'}}>(opcional)</span>:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => handleFileChange(e, 'certificacion')}
                className={styles.formInput}
                disabled={!!formData.certificacion_nombre}
              />
            </div>
            
            {/* MODIFICACIÓN: Mostrar el segundo archivo cargado desde formData */}
            {formData.certificacion_nombre && (
              <div className={styles.documentList}>
                <ul>
                  <li className={styles.documentItem}>
                    <span>{formData.certificacion_nombre}</span>
                    <button 
                      type="button"
                      onClick={() => removeDocument('certificacion')}
                      className={styles.removeBtn}
                    >
                      ❌
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </section>

          {/* Sección 4: Perfil como tutor (RESTAURADA DEL CÓDIGO ORIGINAL) */}
          <section className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Sección 4: Perfil como tutor</h2>
            
            <div className={styles.formGroup} data-field="materias">
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
              <div className={styles.subQuestion} data-field="modalidad">
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

              <div className={styles.subQuestion} data-field="horarios">
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

              <div className={styles.subQuestion} data-field="frecuencia">
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

      {/* Modal (RESTAURADO DEL CÓDIGO ORIGINAL) */}
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