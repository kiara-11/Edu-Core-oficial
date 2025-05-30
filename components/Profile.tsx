'use client';

import Image from 'next/image';
import { useState } from 'react';
import "./Profile.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'WARA HUAMAPACO',
    email: 'wara.huamapaco@email.com',
    phone: '+51 987 654 321',
    bio: 'Estudiante de Ingeniería de Sistemas',
    avatar: '/Imagen de WhatsApp 2024-11-13 a las 19.33.07_84c43483.png'
  });

  const [editData, setEditData] = useState(profileData);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profileData);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
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

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Mi Perfil</h1>
        <p className="profile-subtitle">Gestiona tu información personal</p>
      </div>

      <div className="profile-content">
        {/* Avatar Section */}
        <div className="avatar-section">
          <div className="avatar-container">
            <div className="avatar-wrapper">
              <Image
                src={isEditing ? editData.avatar : profileData.avatar}
                alt="Avatar del usuario"
                width={120}
                height={120}
                className="profile-avatar"
              />
              {isEditing && (
                <div className="avatar-overlay" onClick={() => setShowImageUpload(true)}>
                  <svg className="camera-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
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
                  <button 
                    onClick={() => setShowImageUpload(false)}
                    className="cancel-upload"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info Section */}
        <div className="info-section">
          <div className="info-header">
            <h2>Información Personal</h2>
            {!isEditing ? (
              <button onClick={handleEdit} className="edit-button">
                <svg className="edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
            ) : (
              <div className="action-buttons">
                <button onClick={handleSave} className="save-button">
                  <svg className="save-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Guardar
                </button>
                <button onClick={handleCancel} className="cancel-button">
                  <svg className="cancel-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="info-grid">
            <div className="info-field">
              <label className="field-label">Nombre completo</label>
              {!isEditing ? (
                <p className="field-value">{profileData.name}</p>
              ) : (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="field-input"
                />
              )}
            </div>

            <div className="info-field">
              <label className="field-label">Correo electrónico</label>
              {!isEditing ? (
                <p className="field-value">{profileData.email}</p>
              ) : (
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="field-input"
                />
              )}
            </div>

            <div className="info-field">
              <label className="field-label">Teléfono</label>
              {!isEditing ? (
                <p className="field-value">{profileData.phone}</p>
              ) : (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="field-input"
                />
              )}
            </div>

            <div className="info-field full-width">
              <label className="field-label">Biografía</label>
              {!isEditing ? (
                <p className="field-value">{profileData.bio}</p>
              ) : (
                <textarea
                  value={editData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="field-textarea"
                  rows={3}
                />
              )}
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="security-section">
          <h2>Seguridad</h2>
          <div className="security-options">
            <button className="security-button">
              <svg className="security-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Cambiar contraseña
            </button>
            <button className="security-button">
              <svg className="security-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Autenticación de dos factores
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;