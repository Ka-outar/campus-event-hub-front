import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EventsCatalogue = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === '' || event.category === category)
  );

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2>📅 Catalogue des Événements</h2>
      
      {/* الفلاتر والبحث */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Rechercher un événement..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        >
          <option value="">Toutes les catégories</option>
          <option value="Conférence">Conférence</option>
          <option value="Atelier">Atelier</option>
          <option value="Sport">Sport</option>
          <option value="Culture">Culture</option>
        </select>
      </div>

      {/* شبكة الأحداث */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredEvents.map(event => (
          <div key={event.id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <img src={event.image_url || 'https://via.placeholder.com/150'} alt={event.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
            <h3 style={{ margin: '10px 0 5px 0' }}>{event.title}</h3>
            <p style={{ color: '#777', fontSize: '14px' }}>📍 {event.location}</p>
            <p style={{ fontWeight: 'bold', color: event.available_seats > 0 ? '#059669' : '#dc2626' }}>
              {event.available_seats} places restantes
            </p>
            <button 
              onClick={() => navigate(`/events/${event.id}`)}
              style={{ width: '100%', padding: '10px', background: '#0056b3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
            >
              Voir Détails
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsCatalogue;