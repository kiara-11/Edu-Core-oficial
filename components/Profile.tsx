'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import "./Profile.css";

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nombreCompleto: '',
    user_name: '',
    email: '',
    telefono: '',
    bio: '',
    avatar: '/Imagen de WhatsApp 2024-11-13 a las 19.33.07_84c43483.png',
  });

  // Datos académicos tutor aprobado (solo lectura)
  const [tutorData, setTutorData] = useState<{
    universidad: string;
    titulo: string;
    certificacion: string;
    entidad: string;
    año: string;
  } | null>(null);

  // Control para mostrar sección tutor
  const [showTutorSection, setShowTutorSection] = useState(false);

  const [editData, setEditData] = useState(profileData);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

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
        }
      });

    // Verificar si usuario es tutor aprobado
    const esTutor = localStorage.getItem('esTutorAprobado');
    if (esTutor === 'true') {
      setShowTutorSection(true);
      const solicitudAprobada = JSON.parse(localStorage.getItem('solicitudTutorAprobada') || '{}');
      setTutorData({
        universidad: solicitudAprobada.universidad || '',
        titulo: solicitudAprobada.titulo || '',
        certificacion: solicitudAprobada.certificacion || '',
        entidad: solicitudAprobada.entidad || '',
        año: solicitudAprobada.año || ''
      });
    } else {
      setShowTutorSection(false);
      setTutorData(null);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditData(prev => ({
          ...prev,
          avatar: result
        }));
      };
      reader.readAsDataURL(file);
    }
    setShowImageUpload(false);
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
        {/* Avatar */}
        <div className="avatar-section">
          <div className="avatar-container">
            <div className="avatar-wrapper">
              <Image
                src={isEditing ? editData.avatar : profileData.avatar}
                alt="Avatar"
                width={120}
                height={120}
                className="profile-avatar"
              />
              {isEditing && (
                <div className="avatar-overlay" onClick={() => setShowImageUpload(true)}>
                  📷
                </div>
              )}
            </div>
            {isEditing && showImageUpload && (
              <div className="image-upload-modal">
                <div className="upload-content">
                  <h3>Cambiar foto de perfil</h3>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                    id="avatar-upload"
                  />
                  <label htmlFor="avatar-upload" className="upload-button">
                    Seleccionar imagen
                  </label>
                  <button onClick={() => setShowImageUpload(false)} className="cancel-upload">Cancelar</button>
                </div>
              </div>
            )}
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

        {/* Mostrar sección académica SOLO si es tutor aprobado */}
        {showTutorSection && tutorData && (
          <div className="info-section" style={{ marginTop: '2rem', backgroundColor: '#f0f4f8' }}>
            <h2>Información Académica (Tutor)</h2>
            <div className="info-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="info-field">
                <label>Universidad</label>
                <p>{tutorData.universidad || 'No registrado'}</p>
              </div>
              <div className="info-field">
                <label>Título</label>
                <p>{tutorData.titulo || 'No registrado'}</p>
              </div>
              <div className="info-field">
                <label>Certificación</label>
                <p>{tutorData.certificacion || 'No registrado'}</p>
              </div>
              <div className="info-field">
                <label>Entidad emisora</label>
                <p>{tutorData.entidad || 'No registrado'}</p>
              </div>
              <div className="info-field">
                <label>Año</label>
                <p>{tutorData.año || 'No registrado'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Seguridad */}
        <div className="security-section">
          <h2>Seguridad</h2>
          <div className="security-options">
            <button className="security-button" onClick={() => setShowPasswordModal(true)}>Cambiar contraseña</button>
            <button className="security-button">Autenticación de dos factores</button>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default Perfil;
