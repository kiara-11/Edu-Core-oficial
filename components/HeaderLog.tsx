'use client';

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import "./headerySide.css";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
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
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo">
              <Image
                src="/logoBackground.png"
                alt="EduCore Logo"
                width={100}
                height={100}
                className="logo-image"
              />
            </div>
          </div>

          <div className="user-section" ref={dropdownRef}>
            <div className="user-info" onClick={toggleDropdown}>
              <p className="user-name">WARA HUAMAPACO</p>
              <p className="user-profile">Mi Perfil</p>
            </div>
            <div className="user-avatar" onClick={toggleDropdown}>
              <Image
                src="/Imagen de WhatsApp 2024-11-13 a las 19.33.07_84c43483.png"
                alt="Avatar"
                width={60}
                height={60}
              />
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    <Image
                      src="/Imagen de WhatsApp 2024-11-13 a las 19.33.07_84c43483.png"
                      alt="Avatar"
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="dropdown-info">
                    <p className="dropdown-name">WARA HUAMAPACO</p>
                    <p className="dropdown-email">wara.huamapaco@email.com</p>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-item">
                  <a href="/perfil" className="dropdown-link">
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