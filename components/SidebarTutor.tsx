'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './headerySide.module.css';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Inicio', href: '/Iniciotutor' },
    { name: 'Novedades', href: '/novedadestutor' },
    { name: 'Notificaciones', href: '/notificacionestutor' },
    { name: 'Mis cursos', href: '/miscursostutor' },//cambiar links por el correspondiente page
    { name: 'Explorar cursos', href: '/explorartutor' },
    { name: 'Publicar un curso', href: '/publicarcurso' }
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