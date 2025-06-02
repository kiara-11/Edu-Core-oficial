'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './headerySide.module.css';

const HeaderAdmin = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
              <p className={styles.adminLabel}>Administración</p>
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

export default HeaderAdmin;