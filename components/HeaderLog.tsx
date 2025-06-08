// components/Header.tsx
'use client';

import Image from 'next/image';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import styles from './headerySide.module.css';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correoUsuario, setCorreoUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');
  const [loadingRole, setLoadingRole] = useState(true);
  const [userAvatarUrl, setUserAvatarUrl] = useState('/default_avatar.png');
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

  useEffect(() => {
  const nombre = localStorage.getItem('nombreCompleto');
  const correo = localStorage.getItem('email');

  if (nombre) setNombreCompleto(nombre); // <--- Corrected: removed the extra 'p'
  if (correo) setCorreoUsuario(correo);

    const fetchAvatar = async (userEmail: string) => {
      try {
        const response = await fetch(`/api/perfil-photo?email=${encodeURIComponent(userEmail)}`);
        if (response.ok) {
          const data = await response.json();
          setUserAvatarUrl(data.photoUrl || '/default_avatar.png');
        } else {
          console.error('Failed to fetch avatar:', response.status, response.statusText);
          setUserAvatarUrl('/default_avatar.png');
        }
      } catch (error) {
        console.error('Error fetching avatar:', error);
        setUserAvatarUrl('/default_avatar.png');
      }
    };

    if (correo) {
      fetchAvatar(correo);
    }
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
        setRolUsuario('Estudiante');
        setLoadingRole(false);
        return;
      }

      try {
        const response = await fetch(`/api/usuario/rol?email=${encodeURIComponent(email)}`);
        if (!response.ok) throw new Error('No se pudo obtener el rol');
        const data = await response.json();
        setRolUsuario(data.rol && data.rol.trim() !== '' ? data.rol : 'Estudiante');
      } catch (err) {
        console.error('Error obteniendo el rol:', err);
        setRolUsuario('Estudiante');
      } finally {
        setLoadingRole(false);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  // Modified handleAvatarClick to open file input directly
  const handleAvatarClick = () => {
    if (fileInputRef.current && !uploading && !isDropdownOpen) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!correoUsuario) {
      alert('Error: No se encontró el correo del usuario logueado para subir la foto.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', correoUsuario);

    try {
      const response = await fetch('/api/perfil-photo', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUserAvatarUrl(data.photoUrl);
        // alert('Foto de perfil actualizada con éxito!'); // Removed redundant alert, visual feedback is better
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

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <Image
                src="/logoBackground.png"
                alt="EduCore Logo"
                width={100}
                height={100}
                className={styles.logoImage}
              />
            </div>
          </div>

          <div className={styles.userSection} ref={dropdownRef}>
            <div className={styles.userInfo} onClick={toggleDropdown}>
              <p className={styles.userName}>{nombreCompleto || 'Usuario'}</p>
              <p className={styles.userRole}>
                {loadingRole ? 'Cargando...' : rolUsuario}
              </p>
              <p className={styles.userProfile}>Mi Perfil</p>
            </div>
            {/* Start of enhanced user avatar section */}
            <div
              className={styles.userAvatarContainer} // New container for styling
              onClick={handleAvatarClick}
            >
              {uploading && (
                <div className={styles.avatarOverlay}>
                  <div className={styles.loadingSpinner}></div>
                </div>
              )}
              {!uploading && ( // Show change icon only when not uploading
                <div className={styles.avatarOverlay}>
                  <span className={styles.changePhotoText}>Cambiar Foto</span>
                  {/* You could also use an icon here, e.g., a camera icon */}
                </div>
              )}
              <Image
                src={userAvatarUrl}
                alt="Avatar de Usuario"
                width={60}
                height={60}
                priority
                className={styles.avatarImage}
              />
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg,image/png,image/gif"
                onChange={handleFileChange}
              />
            </div>
            {/* End of enhanced user avatar section */}

            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownAvatar}>
                    <Image
                      src={userAvatarUrl}
                      alt="Avatar"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className={styles.dropdownInfo}>
                    <p className={styles.dropdownName}>{nombreCompleto || 'Usuario'}</p>
                    <p className={styles.dropdownEmail}>{correoUsuario || 'correo@ejemplo.com'}</p>
                  </div>
                </div>

                <div className={styles.dropdownDivider}></div>

                <div className={styles.dropdownItem}>
                  <a href="/miperfil" className={styles.dropdownLink}>
                    Ver perfil
                  </a>
                </div>

                <div className={styles.dropdownItem}>
                  <button onClick={handleLogout} className={styles.dropdownLink}>
                    Cerrar sesión
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;