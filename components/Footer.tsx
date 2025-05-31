import React from 'react';
import './Footer.css';
import Image from 'next/image';
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="footer-simple">
      <div className="footer-simple-container">
        <div className="footer-logo-contact">
          <Image src="/logo2.png" alt="Logo EduCore" width={150} height={70} />
          <p className="footer-desc">"Encuentra el tutor ideal o conviértete en uno. Aprende o enseña desde donde estés."</p>
          <div className="footer-contact-info">
            <div>
              <Image src="/Call.png" alt="Teléfono" width={16} height={16} />
              <span>Tel: +591 78994035</span>
            </div>
            <div>
              <Image src="/Time Circle.png" alt="Horario" width={16} height={16} />
              <span>Horarios: Lunes a viernes de 8:00 a 20:00</span>
            </div>
            <div>
              <Image src="/Group2.png" alt="Email" width={16} height={16} />
              <span>Email: whusunapacol@est.emi.edu.bo</span>
            </div>
          </div>
        </div>

        <div className="footer-links-group">
          <div>
            <h5>Explora EduCore</h5>
            <ul>
              <li>
                <Link href={"/novedades"} passHref>
                  Novedades
                </Link>
              </li>
              <li>
                <Link href={"/sobre-nosotros"} passHref>
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href={"/explorar-cursos"} passHref>
                  Explorar Cursos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5>Términos y Privacidad</h5>
            <ul>
              <li>Política de Privacidad</li>
              <li>Términos y Condiciones</li>
            </ul>
          </div>
          <div>
            <h5>Ayuda</h5>
            <ul>
              <li>Guía para Estudiantes</li>
              <li>Guía para Tutores</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;