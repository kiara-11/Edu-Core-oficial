'use client';

import React from 'react';
import Header from '@/components/HeaderLog';
import SidebarWrapper from '@/components/SidebarWrapper';

const HeaderySidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <div className="main-layout">
        <SidebarWrapper />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default HeaderySidebar;