'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import "./headerySide.css";

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Inicio', href: '/Inicio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Sobre nosotros', href: '/sobre-nosotros' },
    { name: 'Explorar cursos', href: '/cursos' }
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="menu-list">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`menu-item ${isActive ? 'active' : ''}`}
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