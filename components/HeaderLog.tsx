'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './headerySide.module.css';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [correoUsuario, setCorreoUsuario] = useState('');
  const [rolUsuario, setRolUsuario] = useState('');
  const [loadingRole, setLoadingRole] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const nombre = localStorage.getItem('nombreCompleto');
    const correo = localStorage.getItem('email');
    if (nombre) setNombreCompleto(nombre);
    if (correo) setCorreoUsuario(correo);
  }, []);

  // Función para obtener el rol del usuario
  useEffect(() => {
    const fetchUserRole = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
        setRolUsuario('Estudiante'); // Asignar "Estudiante" por defecto
        setLoadingRole(false);
        return;
      }

      try {
        const response = await fetch(`/api/usuario/rol?email=${encodeURIComponent(email)}`);
        if (!response.ok) throw new Error('No se pudo obtener el rol');
        const data = await response.json();
        // Si no hay rol, es null o es una cadena vacía, asignar "Estudiante" por defecto
        setRolUsuario(data.rol && data.rol.trim() !== '' ? data.rol : 'Estudiante');
      } catch (err) {
        console.error('Error obteniendo el rol:', err);
        setRolUsuario('Estudiante'); // Asignar "Estudiante" por defecto en caso de error
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
            <div className={styles.userAvatar} onClick={toggleDropdown}>
              <Image
                src="/Imagen de WhatsApp 2024-11-13 a las 19.33.07_84c43483.png"
                alt="Avatar"
                width={60}
                height={60}
              />
            </div>

            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <div className={styles.dropdownAvatar}>
                    <Image
                      src="/Imagen de WhatsApp 2024-11-13 a las 19.33.07_84c43483.png"
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