import React from 'react';
import './Footer.css';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="footer">
      
      <div className="footer-curve-css"></div>

      
      <div className="footer-top">
        
        <div className="footer-col">
          <Image src="/logo2.png" alt="Logo EduCore" width={180} height={80} />

          <div className="footer-contact">
            <div className="contact-item">
              <Image src="/Call.png" alt="Teléfono" width={20} height={20} />
              <span>Tel: +591 62594327</span>
            </div>
            <div className="contact-item">
              <Image src="/Time Circle.png" alt="Horario" width={20} height={20} />
              <span>Horarios: Lunes a viernes de 8:00 a 20:00</span>
            </div>
            <div className="contact-item">
              <Image src="/Group2.png" alt="Email" width={20} height={20} />
              <span>Email: contacto@educore.bo</span>
            </div>
          </div>
        </div>

        
        <div className="footer-col">
          <h4>Categorías destacadas</h4>
          <ul>
            <li>Programación</li>
            <li>Idiomas</li>
            <li>Refuerzo escolar</li>
            <li>Música</li>
            <li>Ver todas →</li>
          </ul>
        </div>

        
        <div className="footer-col">
          <h4>Enlaces rápidos</h4>
          <ul>
            <li>Sobre nosotros</li>
            <li>Novedades</li>
            <li>Términos y condiciones</li>
          </ul>
        </div>

       
        <div className="footer-col">
          <h4>Suscripción a novedades</h4>
          <p>Mantente al día con los nuevos cursos y promociones</p>
          <div className="newsletter">
            <input type="email" placeholder="Email" />
            <button>Enviar</button>
          </div>
        </div>
      </div>

      
      <div className="footer-bottom">
        <p><strong>EduCore</strong> – Simplifica tu educación. Encuentra, reserva, aprende.</p>
      </div>
    </footer>
  );
};

export default Footer;