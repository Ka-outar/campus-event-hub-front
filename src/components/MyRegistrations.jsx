import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const currentUserId = user.id || user.user_id;

    fetch(`http://localhost:5000/api/registrations/user/${currentUserId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRegistrations(data);
        } else {
          setRegistrations([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setLoading(false);
      });
  }, [navigate]);

  // دالة صغيرة باش ترجع التاريخ مقروء ومغربي وزوين
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) return <div style={{ padding: '20px' }}>Chargement de vos inscriptions...</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '25px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
        📋 Mes Inscriptions Officielles
      </h2>
      
      {registrations.length === 0 ? (
        <div style={{ padding: '40px', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px', textAlign: 'center', color: '#64748b' }}>
          Aucune inscription trouvée pour le moment.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {registrations.map((registration) => (
            /* 💡 السر هنا: استعملنا registration.registration_id باش يتفادى الخطأ ديال Key المتكرر */
            <div key={registration.registration_id || `${registration.id}-${registration.registration_status}`} style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}>
              <div style={{ padding: '25px' }}>
                <span style={{ padding: '4px 10px', background: '#e0f2fe', color: '#0369a1', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                  {registration.category || "Événement"}
                </span>
                <h3 style={{ margin: '15px 0 10px 0', fontSize: '20px', color: '#1e293b', fontWeight: '700' }}>
                  {registration.title}
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📅 {formatDate(registration.date_event)} {registration.time_event ? `à ${registration.time_event}` : ''}
                  </p>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📍 {registration.location}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '14px', color: '#94a3b8' }}>Statut:</span>
                  <span style={{ 
                    padding: '6px 14px', 
                    background: registration.registration_status === 'confirmed' ? '#dcfce7' : '#fef3c7', 
                    color: registration.registration_status === 'confirmed' ? '#15803d' : '#b45309', 
                    borderRadius: '20px', 
                    fontSize: '13px', 
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    {registration.registration_status === 'confirmed' ? '🟢 Confirmé' : '🟡 En attente'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;