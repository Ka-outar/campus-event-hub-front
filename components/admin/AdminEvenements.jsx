import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminEvenements = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/evenements/en-attente', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(response.data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprouver = async (eventId) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/evenements/${eventId}/approuver`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: '✅ Événement approuvé !' });
            fetchEvents();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: '❌ Erreur lors de l\'approbation' });
        }
    };

    const handleRejeter = async (eventId) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/evenements/${eventId}/rejeter`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: '❌ Événement rejeté' });
            fetchEvents();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: '❌ Erreur lors du rejet' });
        }
    };

    const getCategorieIcon = (categorie) => {
        switch(categorie) {
            case 'CONFERENCE': return '📢';
            case 'ATELIER': return '🔧';
            case 'SPORT': return '⚽';
            case 'CULTUREL': return '🎭';
            default: return '📌';
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-right">✅ Validation des événements</h2>
            
            {message && (
                <div className={`mb-4 p-3 rounded text-center ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message.text}
                </div>
            )}
            
            {loading ? (
                <p className="text-center text-gray-500">Chargement...</p>
            ) : events.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">🎉 Aucun événement en attente de validation</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {events.map(event => (
                        <div key={event.id} className="border rounded-lg p-4 hover:shadow-lg transition">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleApprouver(event.id)}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                    >
                                        ✅ Approuver
                                    </button>
                                    <button
                                        onClick={() => handleRejeter(event.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                                    >
                                        ❌ Rejeter
                                    </button>
                                </div>
                                <div className="text-right flex-1 mr-4">
                                    <h3 className="text-lg font-bold">
                                        {getCategorieIcon(event.categorie)} {event.titre}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                                    <div className="mt-2 text-sm text-gray-500">
                                        <span>📅 {new Date(event.date).toLocaleDateString('fr-FR')}</span>
                                        <span className="mx-2">•</span>
                                        <span>👤 Organisateur: {event.organisateur_nom}</span>
                                        <span className="mx-2">•</span>
                                        <span>🎟️ Capacité: {event.capacite} places</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminEvenements;