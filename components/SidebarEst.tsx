'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './headerySide.module.css';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Inicio', href: '/Inicio' },
    { name: 'Mis cursos', href: '/miscursos' },
    { name: 'Novedades', href: '/novedades' },
    { name: 'Notificaciones', href: '/notificaciones' },//cambiar links por el correspondiente page
    { name: 'Explorar cursos', href: '/explorarcurso' },
    { name: 'Convertirme en Tutor', href: '/formulario' },
    { name: 'Control de pagos', href: '/pagosest'},
    { name: 'Informes y reportes', href: '/informesest' }     
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