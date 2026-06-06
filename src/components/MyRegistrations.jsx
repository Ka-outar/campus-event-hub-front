import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; // 🔥 استيراد مكتبة الـ QR Code

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackForm, setShowFeedbackForm] = useState(null); 
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  
  // 💡 حالات (States) التحكم ف الـ Ticket Modal الجديد
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

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

  const handleCancel = (registrationId) => {
    if (window.confirm("Voulez-vous vraiment vous désinscrire de cet événement ?")) {
      fetch(`http://localhost:5000/api/registrations/${registrationId}`, {
        method: 'DELETE'
      })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        fetchRegistrations(); 
      })
      .catch(err => console.error(err));
    }
  };

  const handleFeedbackSubmit = async (e, eventId) => {
    e.preventDefault();
    const currentUserId = user.id || user.user_id; 
    
    try {
      const response = await fetch('http://localhost:5000/api/feedbacks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: currentUserId,
          event_id: eventId, 
          rating: parseInt(rating, 10),
          comment: comment
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert(data.message); 
        setShowFeedbackForm(null); 
        setComment(''); 
      } else {
        alert("Erreur: " + (data.error || "Une erreur est survenue"));
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      alert("Erreur de connexion au serveur");
    }
  };

  // 💡 دالة لتجهيز بيانات التذكرة وفتح النافذة المنبثقة
  const handleViewTicket = (reg) => {
    setSelectedTicket({
      inscription_id: reg.registration_id,
      student_name: user?.name || user?.nom || user?.username || 'Étudiant',
      event_title: reg.title,
      date: formatDate(reg.date_event),
      time: reg.time_event,
      location: reg.location
    });
    setIsModalOpen(true);
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

              {/* 🛠️ أزرار التحكم (التعديل هنا: بقاو كاملين وتزاد معاهم الـ Billet) */}
              <div style={{ marginTop: '20px', paddingTo: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleCancel(reg.registration_id)}
                  style={{ flex: 1, padding: '8px 4px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                >
                  ❌ Annuler
                </button>
                
                {reg.registration_status === 'confirmed' && (
                  <>
                    {/* 🔥 هادا هو الزر الجديد ديال التذكرة كيبان غير يلا كانت confirmed */}
                    <button 
                      onClick={() => handleViewTicket(reg)}
                      style={{ flex: 1, padding: '8px 4px', background: '#dcfce7', color: '#16a34a', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                    >
                      🎟️ Billet
                    </button>

                    <button 
                      onClick={() => setShowFeedbackForm(showFeedbackForm === reg.registration_id ? null : reg.registration_id)}
                      style={{ flex: 1, padding: '8px 4px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                    >
                      ⭐ Avis
                    </button>
                  </>
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

      {/* 💡 استدعاء النافذة المنبثقة للتذكرة هنا */}
      <TicketModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        ticketData={selectedTicket} 
      />
    </div>
  );
};


// ==========================================
// 🎟️ مكون التذكرة الرقمية المتكامل (Modal Component)
// ==========================================
const TicketModal = ({ isOpen, onClose, ticketData }) => {
  if (!isOpen || !ticketData) return null;

  // تشفير البيانات داخل الـ QR Code لضمان الحماية والفرادة
  const qrValue = JSON.stringify({
    ticket_id: ticketData.inscription_id,
    holder: ticketData.student_name,
    event: ticketData.event_title,
    date: `${ticketData.date} à ${ticketData.time || ''}`
  });

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modalContainer}>
        <button onClick={onClose} style={modalStyles.closeButton}>✕</button>
        <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#1e293b', fontSize: '16px' }}>🎟️ Votre Billet Numérique</h3>

        <div style={modalStyles.ticketCard}>
          <div style={modalStyles.ticketHeader}>
            <span style={modalStyles.badge}>ACCÈS OFFICIEL</span>
            <h4 style={modalStyles.eventTitle}>{ticketData.event_title}</h4>
            <p style={modalStyles.ticketText}>👤 <strong>Nom:</strong> {ticketData.student_name}</p>
            <p style={modalStyles.ticketText}>📍 <strong>Lieu:</strong> {ticketData.location}</p>
            <p style={modalStyles.ticketText}>📅 <strong>Date:</strong> {ticketData.date} {ticketData.time ? `à ${ticketData.time}` : ''}</p>
          </div>

          <div style={modalStyles.ticketDivider}></div>

          <div style={modalStyles.ticketFooter}>
            <div style={modalStyles.qrContainer}>
              <QRCodeSVG value={qrValue} size={130} level="H" includeMargin={true} />
            </div>
            <p style={modalStyles.scanNotice}>Scannez ce code à l'entrée du campus</p>
            <span style={modalStyles.ticketId}>N° Inscription: #{ticketData.inscription_id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🎨 ستايلات التذكرة
const modalStyles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(3px)'
  },
  modalContainer: {
    backgroundColor: '#f8fafc', padding: '20px', borderRadius: '20px', position: 'relative', width: '320px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
  },
  closeButton: {
    position: 'absolute', top: '12px', right: '15px', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#64748b'
  },
  ticketCard: {
    backgroundColor: '#fff', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0'
  },
  ticketHeader: {
    padding: '15px', backgroundColor: '#2563eb', color: '#fff'
  },
  badge: {
    fontSize: '9px', background: 'rgba(255,255,255,0.25)', padding: '2px 6px', borderRadius: '20px', fontWeight: 'bold', display: 'inline-block', marginBottom: '6px'
  },
  eventTitle: { margin: '0 0 10px 0', fontSize: '15px', fontWeight: 'bold', lineHeight: '1.3' },
  ticketText: { margin: '3px 0', fontSize: '12px', opacity: 0.95 },
  ticketDivider: {
    borderTop: '2px dashed #cbd5e1', height: '1px', backgroundColor: '#fff'
  },
  ticketFooter: {
    padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff'
  },
  qrContainer: {
    padding: '6px', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '8px'
  },
  scanNotice: { fontSize: '11px', color: '#64748b', textAlign: 'center', margin: '4px 0', fontWeight: '500' },
  ticketId: { fontSize: '10px', color: '#94a3b8', marginTop: '4px', fontFamily: 'monospace' }
};

export default MyRegistrations;