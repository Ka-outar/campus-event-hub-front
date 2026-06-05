import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  // جلب الدور مباشرة عند أول Render بلا ما نحتاجو useEffect
  const [role] = useState(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.role ? user.role.toLowerCase() : 'student';
  });

  const menuItems = {
    student: [
      { path: '/profile', label: 'Mon Profil', icon: '👤' },
      { path: '/events', label: 'Catalogue Événements', icon: '📅' },
      { path: '/my-registrations', label: 'Mes Inscriptions', icon: '🎟️' },
    ],
    organizer: [
      { path: '/profile', label: 'Mon Profil', icon: '👤' },
      { path: '/events', label: 'Catalogue Événements', icon: '📅' },
      { path: '/manage-events', label: 'Gérer mes Événements', icon: '🛠️' },
      { path: '/create-event', label: 'Créer un Événement', icon: '➕' },
    ],
    admin: [
      { path: '/profile', label: 'Mon Profil', icon: '👤' },
      { path: '/events', label: 'Catalogue Événements', icon: '📅' },
      { path: '/admin/dashboard', label: 'Dashboard Admin', icon: '📊' },
      { path: '/admin/users', label: 'Gestion Utilisateurs', icon: '👥' },
    ]
  };

  const currentMenu = menuItems[role] || menuItems['student'];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logoContainer}>
        <h3 style={styles.logoText}>Campus Event Hub</h3>
      </div>
      <nav style={styles.nav}>
        {currentMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              style={{
                ...styles.navLink,
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                fontWeight: isActive ? '700' : '500'
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '260px',
    height: '100vh',
    backgroundColor: '#0056b3',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0, left: 0,
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
    fontFamily: '"Segoe UI", Roboto, sans-serif',
    zIndex: 100
  },
  logoContainer: { padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' },
  logoText: { margin: 0, fontSize: '20px', fontWeight: '700' },
  nav: { flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '8px' },
  navLink: { display: 'flex', alignItems: 'center', padding: '12px 16px', color: '#ffffff', textDecoration: 'none', borderRadius: '8px', fontSize: '14px' },
  icon: { marginRight: '12px', fontSize: '16px' }
};

export default Sidebar;