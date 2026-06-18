import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Sidebar />
      <Navbar />
      <main className="main-content"><Outlet /></main>
    </div>
  );
};

export default DashboardLayout;
