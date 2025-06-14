'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './headerySide.module.css';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Gestión de Estudiantes/Tutores', href: '/adminrol' },
    { name: 'Aprobación de tutores', href: '/admintutor' },
    { name: 'Aprobación de certificados', href: '/Certificado' },
    { name: 'Publicar Curso', href: '/publicarcursoadmi' },
    { name: 'Administrar Curso', href: '/cursoadmi' },
    { name: 'Explorar Cursos', href: '/explorarAdmi' },
    { name: 'Control de pagos', href: '/miscursos' }//cambiar links por el correspondiente page
  ];

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarNav}>
        <ul className={styles.menuList}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`${styles.menuItem} ${isActive ? 'active' : ''}`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;