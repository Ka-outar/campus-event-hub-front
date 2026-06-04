import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ListeParticipants = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([
        { id: 1, nom: "Ahmed Benali", email: "ahmed@test.com", statut: "CONFIRMEE", presence: false },
        { id: 2, nom: "Fatima Zahra", email: "fatima@test.com", statut: "CONFIRMEE", presence: true },
    ]);

    const updatePresence = (id) => {
        setParticipants(participants.map(p => p.id === id ? { ...p, presence: !p.presence } : p));
    };

    return (
        <div style={{ padding: '24px', background: 'white', borderRadius: '12px' }}>
            <button onClick={() => navigate('/organisateur/dashboard')}>← Retour</button>
            <h2>📋 Participants - Événement #{eventId}</h2>
            <table style={{ width: '100%' }}>
                <thead><tr><th>Nom</th><th>Email</th><th>Statut</th><th>Présence</th></tr></thead>
                <tbody>
                    {participants.map(p => (
                        <tr key={p.id}>
                            <td>{p.nom}</td>
                            <td>{p.email}</td>
                            <td>{p.statut}</td>
                            <td><button onClick={() => updatePresence(p.id)} style={{ background: p.presence ? '#10b981' : '#6b7280', color: 'white', padding: '6px 12px', borderRadius: '6px' }}>{p.presence ? 'Présent' : 'Absent'}</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListeParticipants;