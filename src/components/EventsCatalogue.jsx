import { useState, useEffect } from 'react';

const EventsCatalogue = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  const categories = ['Tous', 'Conférence', 'Atelier', 'Sport', 'Culture', 'Formation'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/events?search=${search}&category=${category}`);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Erreur fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [search, category]); // user n'est pas utilisé dans fetchEvents donc pas besoin

  const handleRegister = async (eventId) => {
    if (!user || !user.id) {
      alert("Veuillez vous reconnecter.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/registrations/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, event_id: eventId })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erreur lors de l'inscription");
      } else {
        alert(data.message || "Inscrit avec succès !");
        const refreshResponse = await fetch(`http://localhost:5000/api/events?search=${search}&category=${category}`);
        const refreshData = await refreshResponse.json();
        setEvents(refreshData);
      }
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📅 Catalogue des Événements</h2>
      
      <div style={styles.filterSection}>
        <input 
          type="text" 
          placeholder="Rechercher un événement..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.selectInput}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={styles.loading}>Chargement des événements...</div>
      ) : events.length === 0 ? (
        <div style={styles.noEvents}>Aucun événement trouvé.</div>
      ) : (
        <div style={styles.grid}>
          {events.map((event) => (
            <div key={event.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.badge}>{event.category}</span>
                <span style={styles.places}>{event.available_seats} places restantes</span>
              </div>
              <h3 style={styles.eventTitle}>{event.title}</h3>
              <p style={styles.eventDescription}>{event.description?.substring(0, 120)}...</p>
              <p style={styles.locationInfo}>📍 {event.location}</p>
              <div style={styles.cardFooter}>
                <span style={styles.date}>📆 {new Date(event.date_event).toLocaleDateString()}</span>
                <button 
                  onClick={() => handleRegister(event.id)}
                  disabled={event.available_seats <= 0}
                  style={{
                    ...styles.btnRegister,
                    backgroundColor: event.available_seats <= 0 ? '#cbd5e1' : '#0056b3',
                    cursor: event.available_seats <= 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  {event.available_seats <= 0 ? 'Complet' : "S'inscrire"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { fontFamily: '"Segoe UI", Roboto, sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' },
  title: { color: '#1e293b', marginBottom: '24px', fontWeight: '700' },
  filterSection: { display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' },
  searchInput: { flex: 1, minWidth: '250px', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' },
  selectInput: { padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#ffffff', outline: 'none' },
  loading: { textAlign: 'center', fontSize: '16px', color: '#64748b', marginTop: '40px' },
  noEvents: { textAlign: 'center', fontSize: '16px', color: '#64748b', marginTop: '40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' },
  card: { backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  badge: { backgroundColor: '#e6f0fa', color: '#0056b3', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px' },
  places: { fontSize: '12px', color: '#059669', fontWeight: '600' },
  eventTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' },
  eventDescription: { fontSize: '14px', color: '#475569', margin: '0 0 10px 0', lineHeight: '1.5' },
  locationInfo: { fontSize: '13px', color: '#64748b', fontWeight: '500', marginBottom: '15px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px' },
  date: { fontSize: '12px', color: '#64748b', fontWeight: '500' },
  btnRegister: { color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', transition: 'background-color 0.2s' }
};

export default EventsCatalogue;