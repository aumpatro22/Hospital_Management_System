import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, UserRound, Stethoscope, Calendar,
  Building2, ClipboardList, UserPlus,
  LogOut, ChevronLeft, ChevronRight, Heart
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/doctors', icon: Stethoscope, label: 'Doctors' },
    { to: '/admin/patients', icon: Users, label: 'Patients' },
    { to: '/admin/appointments', icon: Calendar, label: 'Appointments' },
    { to: '/admin/departments', icon: Building2, label: 'Departments' },
  ];
  const doctorLinks = [
    { to: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/doctor/appointments', icon: Calendar, label: 'My Appointments' },
    { to: '/doctor/patients', icon: ClipboardList, label: 'Patient Records' },
  ];
  const patientLinks = [
    { to: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/patient/book', icon: UserPlus, label: 'Book Appointment' },
    { to: '/patient/appointments', icon: Calendar, label: 'My Appointments' },
    { to: '/patient/profile', icon: UserRound, label: 'My Profile' },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'doctor' ? doctorLinks : patientLinks;
  const roleLabel = user?.role === 'admin' ? 'Administrator' : user?.role === 'doctor' ? 'Doctor Portal' : 'Patient Portal';

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon gradient-primary"><Heart size={22} color="white" /></div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>MedCare</h1>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{roleLabel}</p>
          </div>
        )}
      </div>
      <nav className="sidebar-nav">
        {!collapsed && <div className="sidebar-nav-label">Main Menu</div>}
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} title={link.label}>
            <link.icon size={20} />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border)' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, marginBottom: 8, borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white', flexShrink: 0 }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="sidebar-link" style={{ color: 'var(--danger)' }}>
          <LogOut size={20} />{!collapsed && <span>Logout</span>}
        </button>
      </div>
      <button onClick={() => setCollapsed(!collapsed)} style={{ position: 'absolute', top: 80, right: -14, width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', zIndex: 51 }}>
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};

export default Sidebar;
