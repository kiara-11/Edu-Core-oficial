'use client';

import React, { useEffect, useState } from 'react';
import SidebarEst from '@/components/SidebarEst';
import SidebarTutor from '@/components/SidebarTutor';

const SidebarWrapper: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const rolesJson = localStorage.getItem('rolesUsuarios');
    const email = localStorage.getItem('email'); // Asegúrate que este dato se guarde al iniciar sesión
    if (rolesJson && email) {
      try {
        const roles = JSON.parse(rolesJson) as Record<string, string>;
        setRole(roles[email] || null);
      } catch {
        setRole(null);
      }
    } else {
      setRole(null);
    }
  }, []);

  if (role === 'Tutor' || role === 'Ambos') {
    return <SidebarTutor />;
  }

  return <SidebarEst />;
};

export default SidebarWrapper;