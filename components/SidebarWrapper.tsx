'use client';

import React, { useEffect, useState } from 'react';
import SidebarEst from '@/components/SidebarEst';
import SidebarTutor from '@/components/SidebarTutor';

const SidebarWrapper: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const email = localStorage.getItem('email');
      if (!email) {
        setRole('Estudiante'); // Asignar "Estudiante" por defecto
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/usuario/rol?email=${encodeURIComponent(email)}`);
        if (!response.ok) throw new Error('No se pudo obtener el rol');
        const data = await response.json();
        // Si no hay rol, es null o es una cadena vacía, asignar "Estudiante" por defecto
        setRole(data.rol && data.rol.trim() !== '' ? data.rol : 'Estudiante');
      } catch (err) {
        console.error('Error obteniendo el rol:', err);
        setRole('Estudiante'); // Asignar "Estudiante" por defecto en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) return null; // o un spinner

  if (role === 'Tutor' || role === 'Ambos') return <SidebarTutor />;

  // Por defecto mostrar SidebarEst para "Estudiante" y cualquier otro caso
  return <SidebarEst />;
};

export default SidebarWrapper;