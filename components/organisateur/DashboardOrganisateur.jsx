import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DashboardOrganisateur = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalEvents: 0, totalInscriptions: 0, upcomingEvents: 0 });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState(null);
    const token = localStorage.getItem("token");

    const fetchData = async () => {
        if (!token) {
            setErreur("Vous n'êtes pas connecté (Aucun token trouvé).");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            
            // Appel simultané des statistiques et des événements avec axios
            const [statsRes, eventsRes] = await Promise.all([
                axios.get("http://localhost:5000/api/organisateur/stats", { 
                    headers: { Authorization: `Bearer ${token}` } 
                }),
                axios.get("http://localhost:5000/api/organisateur/evenements", { 
                    headers: { Authorization: `Bearer ${token}` } 
                })
            ]);

            setStats(statsRes.data);
            setEvents(eventsRes.data);
            setErreur(null);
        } catch (error) {
            console.error("Erreur lors du chargement du Dashboard :", error);
            setErreur("Impossible de charger les données depuis la base de données.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ color: "#1f2937", margin: 0 }}>📊 Tableau de bord Organisateur</h1>
                <button onClick={fetchData} style={{ background: "#10b981", color: "white", padding: "10px 16px", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                    🔄 Actualiser
                </button>
            </div>

            {erreur && (
                <div style={{ padding: "12px", background: "#fee2e2", color: "#991b1b", borderRadius: "8px", marginBottom: "20px", fontWeight: "bold" }}>
                    ⚠️ {erreur}
                </div>
            )}

            {/* Section Statistiques en Flexbox */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 250px", background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", textAlign: "center" }}>
                    <p style={{ margin: "0 0 8px 0", color: "#6b7280", fontWeight: "500" }}>Total Événements</p>
                    <h2 style={{ margin: 0, color: "#2563eb", fontSize: "28px" }}>{stats.totalEvents}</h2>
                </div>
                <div style={{ flex: "1 1 250px", background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", textAlign: "center" }}>
                    <p style={{ margin: "0 0 8px 0", color: "#6b7280", fontWeight: "500" }}>Total Inscriptions</p>
                    <h2 style={{ margin: 0, color: "#10b981", fontSize: "28px" }}>{stats.totalInscriptions}</h2>
                </div>
                <div style={{ flex: "1 1 250px", background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)", textAlign: "center" }}>
                    <p style={{ margin: "0 0 8px 0", color: "#6b7280", fontWeight: "500" }}>Événements à Venir</p>
                    <h2 style={{ margin: 0, color: "#f59e0b", fontSize: "28px" }}>{stats.upcomingEvents}</h2>
                </div>
            </div>

            {/* Liste des Événements */}
            <div style={{ background: "white", padding: "24px", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                <h3 style={{ marginTop: 0, marginBottom: "16px", color: "#374151" }}>📋 Vos Événements en Base de Données</h3>
                
                {loading ? (
                    <p style={{ textAlign: "center", color: "#6b7280" }}>Chargement des données en cours...</p>
                ) : events.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#6b7280", padding: "20px" }}>Aucun événement trouvé. Cliquez sur "Nouvel événement" pour en ajouter un !</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
                                    <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb" }}>Événement</th>
                                    <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb" }}>Date & Heure</th>
                                    <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb" }}>Participants</th>
                                    <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb" }}>Statut</th>
                                    <th style={{ padding: "12px", borderBottom: "2px solid #e5e7eb" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map(e => (
                                    <tr key={e.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                        <td style={{ padding: "12px", fontWeight: "500" }}>{e.titre}</td>
                                        <td style={{ padding: "12px" }}>
                                            {e.date ? new Date(e.date).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "Non définie"}
                                        </td>
                                        <td style={{ padding: "12px" }}>{e.participants_count} inscrits</td>
                                        <td style={{ padding: "12px" }}>
                                            <span style={{ 
                                                padding: "4px 8px", 
                                                borderRadius: "4px", 
                                                fontSize: "12px",
                                                fontWeight: "bold",
                                                background: e.statut === "VALIDEE" ? "#d1fae5" : "#fef3c7", 
                                                color: e.statut === "VALIDEE" ? "#065f46" : "#92400e" 
                                            }}>
                                                {e.statut === "VALIDEE" ? "Validé" : "En attente"}
                                            </span>
                                        </td>
                                        <td style={{ padding: "12px" }}>
                                            <button 
                                                onClick={() => navigate(`/organisateur/evenements/${e.id}/participants`)} 
                                                style={{ background: "#3b82f6", color: "white", padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "500" }}
                                            >
                                                Voir la liste
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