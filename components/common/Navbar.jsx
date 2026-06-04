import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const nom = localStorage.getItem('nom');

    return (
        <nav style={{ backgroundColor: '#1e40af', color: 'white', padding: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>🏫 Campus Events Hub - Organisateur</h1>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <button 
                        onClick={() => navigate('/organisateur/dashboard')} 
                        style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#1e3a8a'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        📊 Dashboard
                    </button>
                    <button 
                        onClick={() => navigate('/organisateur/ajouter')} 
                        style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#1e3a8a'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        ➕ Nouvel événement
                    </button>
                    <button 
                        onClick={() => navigate('/organisateur/scanner')} 
                        style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#1e3a8a'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        📷 Scanner QR
                    </button>
                    
                    <div style={{ borderLeft: '1px solid white', height: '24px', margin: '0 8px' }}></div>
                    
                    <span>👋 Bonjour, {nom}</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;