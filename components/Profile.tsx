'use client';

import Image from 'next/image';
import { useEffect, useState, useRef, ChangeEvent } from 'react'; // Import useRef and ChangeEvent
import "./Profile.css";

const Perfil = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    nombreCompleto: '',
    user_name: '',
    email: '',
    telefono: '',
    bio: '',
    // This initial avatar path will be immediately overwritten by the fetch
    avatar: '/default_avatar.png', // Set a more generic default
  });

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false); // State for upload loading

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
  // const [showImageUpload, setShowImageUpload] = useState(false); // No longer needed
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
          setEditData(prev => ({ // Also initialize editData with fetched data
            ...prev,
            nombreCompleto: data.nombreCompleto,
            email: data.email,
            telefono: data.telefono || '',
            user_name: data.user_name || '',
            bio: data.bio || '',
          }));
        }
      });

    // Fetch user avatar (similar to Header)
    const fetchAvatar = async (userEmail: string) => {
      try {
        const response = await fetch(`/api/perfil-photo?email=${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          const data = await response.json();
          setProfileData(prev => ({ ...prev, avatar: data.photoUrl || '/default_avatar.png' }));
          setEditData(prev => ({ ...prev, avatar: data.photoUrl || '/default_avatar.png' })); // Also update editData
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

    if (email) {
      fetchAvatar(email);
    }

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
    setEditData(profileData); // Ensure editData is fresh with current profileData
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
      alert("¡Cambios de perfil guardados con éxito!"); // Feedback for general profile updates
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

  // --- NEW: handleAvatarClick and handleFileChange for direct upload ---
  const handleAvatarClick = () => {
    if (fileInputRef.current && !uploading) { // Only allow click if not already uploading
      fileInputRef.current.click(); // Trigger click on hidden file input
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const email = localStorage.getItem("email"); // Get current user email
    if (!email) {
      alert('Error: No se encontró el correo del usuario logueado para subir la foto.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email); // Send email to the API route

    try {
      const response = await fetch('/api/perfil-photo', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(prev => ({ ...prev, avatar: data.photoUrl })); // Update profileData
        setEditData(prev => ({ ...prev, avatar: data.photoUrl })); // Also update editData
        // alert('Foto de perfil actualizada con éxito!'); // Visual feedback is better than alert here
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
        fileInputRef.current.value = ''; // Clear the file input for subsequent uploads
      }
    }
  };
  // --- END NEW ---

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
          {/* New container for styling and click handling */}
          <div className="profile-avatar-container" onClick={handleAvatarClick}>
            {uploading && ( // Show spinner when uploading
              <div className="profile-avatar-overlay">
                <div className="loading-spinner"></div> {/* Use a specific class for this context */}
              </div>
            )}
            {!uploading && ( // Show "Cambiar Foto" overlay when not uploading
              <div className="profile-avatar-overlay">
                <span className="change-photo-text">Cambiar Foto</span>
              </div>
            )}
            <Image
              src={profileData.avatar} // Display the fetched or newly uploaded avatar
              alt="Avatar"
              width={120}
              height={120}
              className="profile-avatar-image" // New class for the Image tag
              priority // Or remove if not critical for LCP
            />
            {/* Hidden file input */}
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