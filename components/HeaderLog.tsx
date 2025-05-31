'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import styles from './headerySide.module.css';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
              <p className={styles.userName}>WARA HUAÑAPACO</p>
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
                    <p className={styles.dropdownName}>WARA HUAMAPACO</p>
                    <p className={styles.dropdownEmail}>wara.huamapaco@email.com</p>
                  </div>
                </div>
                <div className={styles.dropdownDivider}></div>
                <div className={styles.dropdownItem}>
                  <a href="/miperfil" className={styles.dropdownLink}>
                    Ver perfil
                  </a>
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