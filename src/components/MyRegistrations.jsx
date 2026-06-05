import { useState, useEffect } from 'react';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchMyRegistrations = async () => {
      if (!user || !user.id) return;
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/registrations/user/${user.id}`);
        const data = await response.json();
        setRegistrations(data);
      } catch (error) {
        console.error("Erreur fetching registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyRegistrations();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎟️ Mes Inscriptions</h2>
      <p style={styles.subtitle}>Retrouvez ici tous les événements auxquels vous êtes inscrit.</p>

      {loading ? (
        <div style={styles.loading}>Chargement de vos billets...</div>
      ) : registrations.length === 0 ? (
        <div style={styles.noData}>Vous ne vous êtes inscrit à aucun événement pour le moment.</div>
      ) : (
        <div style={styles.grid}>
          {registrations.map((event) => (
            <div key={event.id} style={styles.ticketCard}>
              <div style={styles.ticketHeader}>
                <span style={styles.badge}>{event.category}</span>
                <span style={styles.confirmedBadge}>✓ Confirmé</span>
              </div>
              <h3 style={styles.eventTitle}>{event.title}</h3>
              <p style={styles.details}>📍 {event.location}</p>
              <p style={styles.details}>📆 {new Date(event.date_event).toLocaleDateString()} à {event.time_event}</p>
              <div style={styles.ticketFooter}>
                <span style={styles.ticketId}>Ticket ID: #00{event.id}{user.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { fontFamily: '"Segoe UI", Roboto, sans-serif' },
  title: { color: '#1e293b', marginBottom: '6px', fontWeight: '700' },
  subtitle: { color: '#64748b', fontSize: '14px', marginBottom: '30px' },
  loading: { textAlign: 'center', fontSize: '16px', color: '#64748b', marginTop: '40px' },
  noData: { textAlign: 'center', fontSize: '16px', color: '#64748b', marginTop: '40px', padding: '30px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' },
  ticketCard: { backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px dashed #cbd5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' },
  ticketHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  badge: { backgroundColor: '#e6f0fa', color: '#0056b3', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px' },
  confirmedBadge: { color: '#059669', fontSize: '13px', fontWeight: '700' },
  eventTitle: { fontSize: '18px', fontWeight: '700', color: '#0f172a', margin: '0 0 12px 0' },
  details: { fontSize: '14px', color: '#475569', margin: '0 0 8px 0', fontWeight: '500' },
  ticketFooter: { marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  ticketId: { fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', fontWeight: '600' }
};

export default MyRegistrations;