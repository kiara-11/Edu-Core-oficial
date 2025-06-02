import Header from '@/components/HeaderAd';
import SidebarAdmin from '@/components/SidebarAdmin';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout-container">
      <Header />
      <div className="main-layout">
        <SidebarAdmin />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;