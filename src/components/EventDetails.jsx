import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetch(`http://localhost:5000/api/events`)
      .then(res => res.json())
      .then(data => {
        // تأكدي واش المقارنة بـ e.id أو e.event_id على حساب الباكيند ديالك
        const found = data.find(e => e.id === parseInt(id) || e.event_id === parseInt(id));
        setEvent(found);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleRegister = async () => {
    if (!user) return navigate('/auth');
    
    const currentUserId = user.id || user.user_id; 
    const currentEventId = parseInt(id); 

    try {
      const response = await fetch('http://localhost:5000/api/registrations/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: currentUserId, 
          event_id: currentEventId 
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('🎉 Inscription réussie !');
        setTimeout(() => navigate('/my-registrations'), 1500);
      } else {
        setMessage(`❌ ${data.error || 'Erreur lors de l\'inscription'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('Erreur réseau lors de l\'inscription');
    }
  };

  if (!event) return <div style={{ padding: '20px' }}>Chargement des détails...</div>;

  return (
    <div style={{ maxWidth: '800px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'sans-serif', margin: '20px auto' }}>
      <button onClick={() => navigate('/events')} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#0056b3', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>← Retour au catalogue</button>
      <img src={event.image_url || 'https://via.placeholder.com/800x350'} alt={event.title} style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '8px' }} />
      <h2 style={{ marginTop: '20px', color: '#333' }}>{event.title}</h2>
      <p style={{ color: '#555', lineHeight: '1.6', fontSize: '16px' }}>{event.description}</p>
      <hr style={{ border: '0.5px solid #eee', margin: '20px 0' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#444' }}>
        <p><strong>📅 Date & Heure :</strong> {new Date(event.date_event).toLocaleDateString()} à {event.time_event}</p>
        <p><strong>📍 Lieu :</strong> {event.location}</p>
        <p><strong>🏷️ Catégorie :</strong> {event.category}</p>
        <p><strong>🎟️ Places Disponibles :</strong> <span style={{ color: event.available_seats > 0 ? '#059669' : '#dc2626', fontWeight: 'bold' }}>{event.available_seats}</span></p>
      </div>
      
      {message && <p style={{ padding: '12px', background: message.includes('🎉') ? '#f0fdf4' : '#fef2f2', color: message.includes('🎉') ? '#15803d' : '#b91c1c', borderRadius: '6px', fontWeight: 'bold', marginTop: '20px' }}>{message}</p>}
      
      <button 
        onClick={handleRegister}
        disabled={event.available_seats <= 0}
        style={{ padding: '12px 25px', background: event.available_seats > 0 ? '#059669' : '#cbd5e1', color: '#fff', border: 'none', borderRadius: '6px', cursor: event.available_seats > 0 ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '16px', marginTop: '20px', width: '100%' }}
      >
        {event.available_seats > 0 ? "S'inscrire à l'événement" : "Complet"}
      </button>
    </div>
  );
};

export default EventDetails;