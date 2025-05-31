import Header from '@/components/HeaderLog';
import SidebarTutor from '@/components/SidebarTutor';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout-container">
      <Header />
      <div className="main-layout">
        <SidebarTutor />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;