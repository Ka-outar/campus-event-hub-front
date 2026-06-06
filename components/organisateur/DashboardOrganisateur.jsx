import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardOrganisateur = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalEvents: 0, totalInscriptions: 0, upcomingEvents: 0 });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchStats();
        fetchEvents();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/organisateur/stats", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Stats reçues:", response.data);
            setStats(response.data);
        } catch (error) {
            console.error("Erreur stats:", error);
            setError("Impossible de charger les statistiques");
        }
    };

    const fetchEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/organisateur/evenements", {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Événements reçus:", response.data);
            setEvents(response.data);
        } catch (error) {
            console.error("Erreur events:", error);
            setError("Impossible de charger les événements");
        } finally {
            setLoading(false);
        }
    };

    const getStatusLabel = (statut) => {
        switch(statut) {
            case 'approved': return '✅ Validé';
            case 'VALIDEE': return '✅ Validé';
            case 'rejected': return '❌ Rejeté';
            case 'REJETEE': return '❌ Rejeté';
            default: return '⏳ En attente';
        }
    };

    const getStatusColor = (statut) => {
        switch(statut) {
            case 'approved': return { backgroundColor: '#d1fae5', color: '#065f46' };
            case 'VALIDEE': return { backgroundColor: '#d1fae5', color: '#065f46' };
            case 'rejected': return { backgroundColor: '#fee2e2', color: '#991b1b' };
            case 'REJETEE': return { backgroundColor: '#fee2e2', color: '#991b1b' };
            default: return { backgroundColor: '#fef3c7', color: '#92400e' };
        }
    };

    if (loading) return <div style={{ padding: "20px", textAlign: "center" }}>⏳ Chargement des données...</div>;
    if (error) return <div style={{ padding: "20px", textAlign: "center", color: "red" }}>❌ {error}</div>;

    return (
        <div style={{ padding: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>📊 Tableau de bord - Organisateur</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "32px" }}>
                <div style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "white", padding: "20px", borderRadius: "12px" }}>
                    <h3>Total événements</h3>
                    <p style={{ fontSize: "36px", fontWeight: "bold" }}>{stats.totalEvents || 0}</p>
                </div>
                <div style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "white", padding: "20px", borderRadius: "12px" }}>
                    <h3>Total inscriptions</h3>
                    <p style={{ fontSize: "36px", fontWeight: "bold" }}>{stats.totalInscriptions || 0}</p>
                </div>
                <div style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", padding: "20px", borderRadius: "12px" }}>
                    <h3>Événements à venir</h3>
                    <p style={{ fontSize: "36px", fontWeight: "bold" }}>{stats.upcomingEvents || 0}</p>
                </div>
            </div>

            <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>📋 Mes événements</h3>
                {events.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#6b7280" }}>Aucun événement créé pour le moment</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead style={{ backgroundColor: "#f9fafb" }}>
                                <tr>
                                    <th style={{ padding: "12px", textAlign: "right" }}>Titre</th>
                                    <th style={{ padding: "12px", textAlign: "right" }}>Date</th>
                                    <th style={{ padding: "12px", textAlign: "right" }}>Participants</th>
                                    <th style={{ padding: "12px", textAlign: "right" }}>Statut</th>
                                    <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event, index) => (
                                    <tr key={event.id || index} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                        {/* Utilise "titre" car le backend envoie "titre" (alias de title) */}
                                        <td style={{ padding: "12px", fontWeight: "500" }}>{event.titre || event.title}</td>
                                        {/* Utilise "date" car le backend envoie "date" (concaténation date_event + time_event) */}
                                        <td style={{ padding: "12px" }}>
                                            {event.date ? new Date(event.date).toLocaleDateString("fr-FR") : "Date non définie"}
                                        </td>
                                        <td style={{ padding: "12px" }}>{event.participants_count || 0}</td>
                                        <td style={{ padding: "12px" }}>
                                            <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "12px", ...getStatusColor(event.statut || event.status) }}>
                                                {getStatusLabel(event.statut || event.status)}
                                            </span>
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                            <button 
                                                onClick={() => navigate(`/organisateur/evenements/${event.id}/participants`)}
                                                style={{ background: "#3b82f6", color: "white", padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}
                                            >
                                                Voir participants
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardOrganisateur;