import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(null); // كيعقل على الكارت المفتوحة (registration_id)
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchRegistrations = () => {
    if (!user) return;
    const currentUserId = user.id || user.user_id;
    fetch(`http://localhost:5000/api/registrations/user/${currentUserId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setRegistrations(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        loading(false);
      });
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchRegistrations();
  }, [navigate]);

  // دالة إلغاء التسجيل
  const handleCancel = (registrationId) => {
    if (window.confirm("Voulez-vous vraiment vous désinscrire de cet événement ?")) {
      fetch(`http://localhost:5000/api/registrations/${registrationId}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        fetchRegistrations(); // إعادة تحديث القائمة
      })
      .catch(err => console.error(err));
    }
  };

  // 🔥 دالة إرسال التقييم الجديدة والمصححة بـ async/await
  const handleFeedbackSubmit = async (e, eventId) => {
    e.preventDefault();
    const currentUserId = user.id || user.user_id; // جلب الـ user_id من الـ localStorage اللي ديجا كاين الفوق
    
    try {
      const response = await fetch('http://localhost:5000/api/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUserId,
          event_id: eventId, // الـ event_id كيجيبو نيشان من الكليك ديال الفورم
          rating: parseInt(rating, 10),
          comment: comment
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message); // غاتطلع الرسالة بنجاح
        setShowFeedbackForm(null); // سد الفورم
        setComment(''); // خوي التيكست اريا
      } else {
        alert("Erreur: " + (data.error || "Une erreur est survenue"));
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Erreur de connexion au serveur");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) return <div style={{ padding: '20px' }}>Chargement...</div>;

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '25px', color: '#1e293b' }}>📋 Mes Inscriptions Officielles</h2>
      
      {registrations.length === 0 ? (
        <p>Aucune inscription trouvée.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px' }}>
          {registrations.map((reg) => (
            <div key={reg.registration_id} style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ padding: '4px 8px', background: '#e0f2fe', color: '#0369a1', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>{reg.category || 'CONFÉRENCE'}</span>
                <h3 style={{ margin: '10px 0', fontSize: '18px', color: '#1e293b' }}>{reg.title}</h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0' }}>📅 {formatDate(reg.date_event)} à {reg.time_event}</p>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0' }}>📍 {reg.location}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                  <span style={{ fontSize: '14px', color: '#94a3b8' }}>Statut:</span>
                  <span style={{ padding: '4px 12px', background: reg.registration_status === 'confirmed' ? '#dcfce7' : '#fef3c7', color: reg.registration_status === 'confirmed' ? '#15803d' : '#b45309', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                    {reg.registration_status === 'confirmed' ? '🟢 Confirmé' : '🟡 En attente'}
                  </span>
                </div>
              </div>

              {/* 🛠️ أزرار التحكم (Annuler & Avis) */}
              <div style={{ marginTop: '20px', paddingTo: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => handleCancel(reg.registration_id)}
                  style={{ flex: 1, padding: '8px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                >
                  ❌ Annuler
                </button>
                
                {reg.registration_status === 'confirmed' && (
                  <button 
                    onClick={() => setShowFeedbackForm(showFeedbackForm === reg.registration_id ? null : reg.registration_id)}
                    style={{ flex: 1, padding: '8px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                  >
                    ⭐ Avis
                  </button>
                )}
              </div>

              {/* ⭐ فورم إضافة التقييم */}
              {showFeedbackForm === reg.registration_id && (
                <form onSubmit={(e) => handleFeedbackSubmit(e, reg.event_id || reg.id)} style={{ marginTop: '15px', padding: '15px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>Note (1 à 5):</label>
                  <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ width: '100%', padding: '6px', margin: '5px 0 10px 0', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <option value="5">⭐⭐⭐⭐⭐ (Excellent)</option>
                    <option value="4">⭐⭐⭐⭐ (Très bien)</option>
                    <option value="3">⭐⭐⭐ (Bien)</option>
                    <option value="2">⭐⭐ (Moyen)</option>
                    <option value="1">⭐ (Mauvais)</option>
                  </select>

                  <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569' }}>Commentaire :</label>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Votre avis..." rows="2" style={{ width: '100%', padding: '6px', marginTop: '5px', borderRadius: '6px', border: '1px solid #cbd5e1', resize: 'none' }} required />
                  
                  <button type="submit" style={{ width: '100%', marginTop: '10px', padding: '6px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Envoyer l'avis
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;