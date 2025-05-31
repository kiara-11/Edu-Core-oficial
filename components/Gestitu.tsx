'use client';

import React, { useState } from 'react';
import styles from './Gestitu.module.css';

interface Tutor {
  id: number;
  name: string;
  specialty: string;
  status: string;
  avatar: string;
  email: string;
  phone: string;
  registrationDate: string;
  biography: string;
  documents: string[];
  certifications: string[];
}

const Gestitu: React.FC = () => {
  const [tutors, setTutors] = useState<Tutor[]>([
    {
      id: 1,
      name: "Alejandra Lopez",
      specialty: "Matemáticas",
      status: "Pendiente",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b5c19ad2?w=150&h=150&fit=crop&crop=face",
      email: "alejandralopez@gmail.com",
      phone: "+569 78394627",
      registrationDate: "12/10/2025",
      biography: "Licenciada... con experiencia...",
      documents: ["Título Universitario.pdf", "CV.pdf"],
      certifications: ["Certificado en Pedagogía.pdf"]
    },
    {
      id: 2,
      name: "Alejandra Lopez",
      specialty: "Matemáticas",
      status: "Pendiente",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b5c19ad2?w=150&h=150&fit=crop&crop=face",
      email: "alejandralopez@gmail.com",
      phone: "+569 78394627",
      registrationDate: "12/10/2025",
      biography: "Licenciada... con experiencia...",
      documents: ["Título Universitario.pdf", "CV.pdf"],
      certifications: ["Certificado en Pedagogía.pdf"]
    },
    {
      id: 3,
      name: "Alejandra Lopez",
      specialty: "Matemáticas",
      status: "Pendiente",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b5c19ad2?w=150&h=150&fit=crop&crop=face",
      email: "alejandralopez@gmail.com",
      phone: "+569 78394627",
      registrationDate: "12/10/2025",
      biography: "Licenciada... con experiencia...",
      documents: ["Título Universitario.pdf", "CV.pdf"],
      certifications: ["Certificado en Pedagogía.pdf"]
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<string>("Todo");
  const [searchUser, setSearchUser] = useState<string>("");
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);

  const filteredTutors = tutors.filter(tutor => {
    const matchesStatus = filterStatus === "Todo" || tutor.status === filterStatus;
    const matchesSearch = tutor.name.toLowerCase().includes(searchUser.toLowerCase()) || 
                         tutor.specialty.toLowerCase().includes(searchUser.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleView = (tutor: Tutor) => {
    setSelectedTutor(tutor);
  };

  const handleApprove = () => {
    if (selectedTutor) {
      setTutors(tutors.map(tutor => 
        tutor.id === selectedTutor.id 
          ? { ...tutor, status: "Aprobado" }
          : tutor
      ));
      setSelectedTutor(null);
    }
  };

  const handleReject = () => {
    if (selectedTutor) {
      setTutors(tutors.map(tutor => 
        tutor.id === selectedTutor.id 
          ? { ...tutor, status: "Rechazado" }
          : tutor
      ));
      setSelectedTutor(null);
    }
  };

  const handleClose = () => {
    setSelectedTutor(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <div className={styles.card}>
          <h2 className={styles.title}>Gestión de Tutores</h2>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label className={styles.label}>Estado:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={styles.select}
              >
                <option value="Todo">Todo</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.label}>Buscar Usuario:</label>
              <input
                type="text"
                placeholder="Buscar"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>Foto</div>
              <div className={styles.headerCell}>Nombre</div>
              <div className={styles.headerCell}>Especialidad</div>
              <div className={styles.headerCell}>Estado</div>
              <div className={styles.headerCell}>Acción</div>
            </div>

            {filteredTutors.map((tutor) => (
              <div key={tutor.id} className={styles.tableRow}>
                <div className={styles.avatarCell}>
                  <div className={styles.avatar}>
                    <img src={tutor.avatar} alt={tutor.name} />
                  </div>
                </div>
                <div className={styles.cell}>{tutor.name}</div>
                <div className={styles.cell}>{tutor.specialty}</div>
                <div className={styles.cell}>
                  <span className={`${styles.status} ${styles[tutor.status.toLowerCase()]}`}>
                    • {tutor.status}
                  </span>
                </div>
                <div className={styles.cell}>
                  <button
                    onClick={() => handleView(tutor)}
                    className={styles.viewButton}
                  >
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedTutor && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarContent}>
            <button 
              onClick={handleClose}
              className={styles.closeButton}
            >
              ×
            </button>
            
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <img src={selectedTutor.avatar} alt={selectedTutor.name} />
              </div>
              <div className={styles.userDetails}>
                <h3 className={styles.userName}>{selectedTutor.name}</h3>
                <p className={styles.userEmail}>{selectedTutor.email}</p>
                <p className={styles.userPhone}>{selectedTutor.phone}</p>
                <p className={styles.userDate}>Registrado: {selectedTutor.registrationDate}</p>
              </div>
            </div>

            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Biografía:</h4>
              <p className={styles.biography}>{selectedTutor.biography}</p>
            </div>

            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Documentos:</h4>
              <ul className={styles.documentList}>
                {selectedTutor.documents.map((doc, index) => (
                  <li key={index} className={styles.documentItem}>{doc}</li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h4 className={styles.sectionTitle}>Certificaciones:</h4>
              <ul className={styles.documentList}>
                {selectedTutor.certifications.map((cert, index) => (
                  <li key={index} className={styles.documentItem}>{cert}</li>
                ))}
              </ul>
            </div>

            <div className={styles.buttonGroup}>
              <button
                onClick={handleApprove}
                className={styles.approveButton}
              >
                APROBAR
              </button>
              <button
                onClick={handleReject}
                className={styles.rejectButton}
              >
                SOLICITAR REVISIÓN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gestitu;