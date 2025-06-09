'use client';

import Image from 'next/image';
import { useEffect, useState, useRef, ChangeEvent } from 'react';
import "./Profile.css";

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nombreCompleto: '',
    user_name: '',
    email: '',
    telefono: '',
    bio: '',
    avatar: '/default_avatar.png',
  });

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Estados para datos académicos de tutor
  const [tutorData, setTutorData] = useState<{
    universidad: string;
    profesion: string;
    certificacion: string;
    entidad: string;
    anio: string;
    fechaInicioProfesion: string;
    fechaFinProfesion: string;
    fechaTitulacion: string;
    modalidad: string;
    horarios: string;
    frecuencia: string;
    materias: string;
    estado: string;
  } | null>(null);

  const [showTutorSection, setShowTutorSection] = useState(false);
  const [loadingTutorData, setLoadingTutorData] = useState(true);

  const [editData, setEditData] = useState(profileData);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  // Estado para el modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) return;

    // Carga info básica usuario
    fetch(`/api/usuario?email=${email}`)
      .then(res => res.json())
      .then(data => {
        if (data?.nombreCompleto) {
          setProfileData(prev => ({
            ...prev,
            nombreCompleto: data.nombreCompleto,
            email: data.email,
            telefono: data.telefono || '',
            user_name: data.user_name || '',
            bio: data.bio || '',
          }));
          setEditData(prev => ({
            ...prev,
            nombreCompleto: data.nombreCompleto,
            email: data.email,
            telefono: data.telefono || '',
            user_name: data.user_name || '',
            bio: data.bio || '',
          }));
        }
      })
      .catch(error => console.error('Error loading user data:', error));

    // Fetch user avatar
    const fetchAvatar = async (userEmail: string) => {
      try {
        const response = await fetch(`/api/perfil-photo?email=${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          const data = await response.json();
          setProfileData(prev => ({ ...prev, avatar: data.photoUrl || '/default_avatar.png' }));
          setEditData(prev => ({ ...prev, avatar: data.photoUrl || '/default_avatar.png' }));
        } else {
          console.error('Failed to fetch avatar:', response.status, response.statusText);
          setProfileData(prev => ({ ...prev, avatar: '/default_avatar.png' }));
          setEditData(prev => ({ ...prev, avatar: '/default_avatar.png' }));
        }
      } catch (error) {
        console.error('Error fetching avatar:', error);
        setProfileData(prev => ({ ...prev, avatar: '/default_avatar.png' }));
        setEditData(prev => ({ ...prev, avatar: '/default_avatar.png' }));
      }
    };

    // Fetch datos académicos de tutor
    const fetchTutorData = async (userEmail: string) => {
      try {
        setLoadingTutorData(true);
        const response = await fetch(`/api/tutor-academico?email=${encodeURIComponent(userEmail)}`);
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.esTutor) {
            setShowTutorSection(true);
            setTutorData(data.datosAcademicos);
          } else {
            setShowTutorSection(false);
            setTutorData(null);
          }
        } else {
          console.error('Error fetching tutor data:', response.status);
          setShowTutorSection(false);
          setTutorData(null);
        }
      } catch (error) {
        console.error('Error fetching tutor data:', error);
        setShowTutorSection(false);
        setTutorData(null);
      } finally {
        setLoadingTutorData(false);
      }
    };

    if (email) {
      fetchAvatar(email);
      fetchTutorData(email);
    }
  }, []);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const updated = { ...editData };

    const res = await fetch('/api/usuario', {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    });

    if (res.ok) {
      setProfileData(updated);
      setIsEditing(false);
      localStorage.setItem('nombreCompleto', updated.nombreCompleto);
      localStorage.setItem('email', updated.email);
      setShowSuccessModal(true);
    } else {
      alert("❌ Error al guardar los cambios.");
    }
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarClick = () => {
    if (fileInputRef.current && !uploading) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const email = localStorage.getItem("email");
    if (!email) {
      alert('Error: No se encontró el correo del usuario logueado para subir la foto.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email);

    try {
      const response = await fetch('/api/perfil-photo', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(prev => ({ ...prev, avatar: data.photoUrl }));
        setEditData(prev => ({ ...prev, avatar: data.photoUrl }));
      } else {
        const errorData = await response.json();
        alert(`Error al subir la foto: ${errorData.message || 'Error desconocido'}`);
        console.error('Upload error:', errorData);
      }
    } catch (error) {
      alert('Error de red al subir la foto.');
      console.error('Network error during upload:', error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePasswordChange = async () => {
    try {
      const response = await fetch('/api/cambiarContrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profileData.email,
          contrasenaActual: currentPassword,
          contrasenaNueva: newPassword
        })
      });
      const data = await response.json();
      setPasswordMessage(data.message);
    } catch (error) {
      setPasswordMessage("Error al actualizar contraseña.");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Mi Perfil</h1>
        <p className="profile-subtitle">Gestiona tu información personal</p>
      </div>

      <div className="profile-content">
        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="profile-avatar-container" onClick={handleAvatarClick}>
            {uploading && (
              <div className="profile-avatar-overlay">
                <div className="loading-spinner"></div>
              </div>
            )}
            {!uploading && (
              <div className="profile-avatar-overlay">
                <span className="change-photo-text">Cambiar Foto</span>
              </div>
            )}
            <Image
              src={profileData.avatar}
              alt="Avatar"
              width={120}
              height={120}
              className="profile-avatar-image"
              priority
            />
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Información Personal */}
        <div className="info-section">
          <div className="info-header">
            <h2>Información Personal</h2>
            {!isEditing ? (
              <button onClick={handleEdit} className="edit-button">Editar</button>
            ) : (
              <div className="action-buttons">
                <button onClick={handleSave} className="save-button">Guardar</button>
                <button onClick={handleCancel} className="cancel-button">Cancelar</button>
              </div>
            )}
          </div>

          <div className="info-grid">
            <div className="info-field">
              <label>Nombre completo</label>
              {!isEditing ? (
                <p>{profileData.nombreCompleto}</p>
              ) : (
                <input
                  type="text"
                  value={editData.nombreCompleto}
                  onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
                />
              )}
            </div>

            <div className="info-field">
              <label>Nombre de usuario</label>
              {!isEditing ? (
                <p>{profileData.user_name}</p>
              ) : (
                <input
                  type="text"
                  value={editData.user_name}
                  onChange={(e) => handleInputChange('user_name', e.target.value)}
                />
              )}
            </div>

            <div className="info-field">
              <label>Correo electrónico</label>
              {!isEditing ? (
                <p>{profileData.email}</p>
              ) : (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              )}
            </div>

            <div className="info-field">
              <label>Teléfono</label>
              {!isEditing ? (
                <p>{profileData.telefono}</p>
              ) : (
                <input
                  type="tel"
                  value={editData.telefono}
                  onChange={(e) => handleInputChange('telefono', e.target.value)}
                />
              )}
            </div>

            <div className="info-field full-width">
              <label>Biografía</label>
              {!isEditing ? (
                <p>{profileData.bio}</p>
              ) : (
                <textarea
                  rows={3}
                  value={editData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Sección Académica de Tutor - Solo si es tutor aprobado */}
        {loadingTutorData ? (
          <div className="info-section tutor-loading">
            <p>Cargando información académica...</p>
          </div>
        ) : showTutorSection && tutorData ? (
          <div className="info-section tutor-section">
            <div className="info-header">
              <h2>🎓 Información Académica (Tutor)</h2>
              <div className="tutor-status">
                <span className="status-badge approved">✅ {tutorData.estado}</span>
              </div>
            </div>
            
            <div className="tutor-info-grid">
              <div className="info-field">
                <label>Universidad</label>
                <p>{tutorData.universidad || 'No registrado'}</p>
              </div>
              
              <div className="info-field">
                <label>Profesión/Título</label>
                <p>{tutorData.profesion || 'No registrado'}</p>
              </div>
              
              <div className="info-field">
                <label>Certificación</label>
                <p>{tutorData.certificacion || 'No registrado'}</p>
              </div>
              
              <div className="info-field">
                <label>Entidad Emisora</label>
                <p>{tutorData.entidad || 'No registrado'}</p>
              </div>
              
              <div className="info-field">
                <label>Año</label>
                <p>{tutorData.anio || 'No registrado'}</p>
              </div>
              
              <div className="info-field">
                <label>Fecha Titulación</label>
                <p>{tutorData.fechaTitulacion || 'No registrado'}</p>
              </div>
              
              <div className="info-field">
                <label>Modalidad</label>
                <p>{tutorData.modalidad || 'No registrado'}</p>
              </div>
              
              <div className="info-field">
                <label>Horarios</label>
                <p>{tutorData.horarios || 'No registrado'}</p>
              </div>
              
              
              
              {tutorData.fechaInicioProfesion && (
                <div className="info-field">
                  <label>Inicio Profesión</label>
                  <p>{tutorData.fechaInicioProfesion}</p>
                </div>
              )}
              
              {tutorData.fechaFinProfesion && (
                <div className="info-field">
                  <label>Fin Profesión</label>
                  <p>{tutorData.fechaFinProfesion}</p>
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Seguridad */}
        <div className="security-section">
          <h2>Seguridad</h2>
          <div className="security-options">
            <button className="security-button" onClick={() => setShowPasswordModal(true)}>
              🔐 Cambiar contraseña
            </button>
          </div>
        </div>

        {/* Modal de contraseña */}
        {showPasswordModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>🔐 Cambiar contraseña</h3>
              <input
                type="password"
                placeholder="Contraseña actual"
                className="txtbox"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Nueva contraseña"
                className="txtbox"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button className="modal-btn" onClick={handlePasswordChange}>Guardar</button>
              <button className="modal-btn" onClick={() => setShowPasswordModal(false)}>Cancelar</button>
              {passwordMessage && <p className="mensaje-texto">{passwordMessage}</p>}
            </div>
          </div>
        )}

        {/* Modal de éxito */}
        {showSuccessModal && (
          <div className="success-modal-overlay">
            <div className="success-modal">
              <div className="success-modal-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#10b981"/>
                  <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="success-modal-title">¡Cambios guardados con éxito!</h3>
              <p className="success-modal-message">Tu información de perfil ha sido actualizada correctamente.</p>
              <button 
                className="success-modal-button"
                onClick={() => setShowSuccessModal(false)}
              >
                Aceptar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Perfil;