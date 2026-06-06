import { useState } from 'react';

const Navbar = ({ onLogout }) => {
  // جلب المستخدم مباشرة بدون useEffect لتفادي Loop الـ Render
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));

  const avatarColor = localStorage.getItem(`theme_${user?.email}`) || '#0056b3';
  const profileImage = user?.profile_image || localStorage.getItem(`profile_img_${user?.email}`) || null;

  return (
    <div style={styles.navbar}>
      <div style={styles.welcomeSection}>
        <span style={styles.roleBadge}>
          ROLE: {user?.role ? user.role.toUpperCase() : 'STUDENT'}
        </span>
      </div>

      <div style={styles.userSection}>
        <span style={styles.username}>{user?.username || 'Utilisateur'}</span>
        
        <div style={{ ...styles.avatar, backgroundColor: profileImage ? 'transparent' : avatarColor }}>
          {profileImage ? (
            <img src={profileImage} alt="Profile" style={styles.avatarImg} />
          ) : (
            user?.username?.charAt(0).toUpperCase() || 'U'
          )}
        </div>

        <button onClick={onLogout} style={styles.btnLogout}>
          🚪 Déconnexion
        </button>
      </div>
    </div>
  );
};

const styles = {
  navbar: {
    height: '65px', position: 'fixed', top: 0, left: '260px', right: 0,
    backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 30px', boxSizing: 'border-box', zIndex: 99, fontFamily: '"Segoe UI", Roboto, sans-serif'
  },
  welcomeSection: { display: 'flex', alignItems: 'center' },
  roleBadge: { fontSize: '11px', fontWeight: '700', color: '#0056b3', background: '#e6f0fa', padding: '4px 12px', borderRadius: '100px' },
  userSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  username: { fontSize: '14px', fontWeight: '600', color: '#334155' },
  avatar: { width: '35px', height: '35px', borderRadius: '50%', color: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', fontWeight: '700', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  btnLogout: { backgroundColor: '#fff1f2', color: '#e11d48', border: '1px solid #ffe4e6', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }
};

export default Navbar;