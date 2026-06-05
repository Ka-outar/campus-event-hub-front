
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ListeParticipants = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchParticipants();
    }, []);

    const fetchParticipants = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/evenements/${eventId}/participants`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setParticipants(response.data);
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    const updatePresence = async (registrationId, currentPresence) => {
        try {
            await axios.put(`http://localhost:5000/api/inscriptions/${registrationId}/presence`, 
                { presence: !currentPresence },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchParticipants();
        } catch (error) {
            console.error("Erreur:", error);
            alert("Erreur lors de la mise à jour de la présence");
        }
    };

    if (loading) return <div style={{ padding: "20px", textAlign: "center" }}>⏳ Chargement...</div>;

    return (
        <div style={{ padding: "24px", background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
                <button onClick={() => navigate("/organisateur/dashboard")} style={{ background: "#6b7280", color: "white", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer" }}>← Retour</button>
                <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>📋 Participants</h2>
                <div style={{ width: "80px" }}></div>
            </div>
            
            {participants.length === 0 ? (
                <p style={{ textAlign: "center", color: "#6b7280" }}>Aucun participant inscrit pour le moment</p>
            ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ backgroundColor: "#f9fafb" }}>
                        <tr>
                            <th style={{ padding: "12px", textAlign: "right" }}>Nom</th>
                            <th style={{ padding: "12px", textAlign: "right" }}>Email</th>
                            <th style={{ padding: "12px", textAlign: "right" }}>Statut</th>
                            <th style={{ padding: "12px", textAlign: "right" }}>Présence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {participants.map(p => (
                            <tr key={p.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                <td style={{ padding: "12px", fontWeight: "500" }}>{p.nom}</td>
                                <td style={{ padding: "12px" }}>{p.email}</td>
                                <td style={{ padding: "12px" }}>
                                    <span style={{ padding: "4px 8px", borderRadius: "4px", backgroundColor: p.statut === "confirmed" ? "#d1fae5" : "#fef3c7" }}>
                                        {p.statut === "confirmed" ? "Confirmé" : "En attente"}
                                    </span>
                                </td>
                                <td style={{ padding: "12px" }}>
                                    <button
                                        onClick={() => updatePresence(p.registration_id, p.presence)}
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: "6px",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "white",
                                            backgroundColor: p.presence ? "#10b981" : "#6b7280"
                                        }}
                                    >
                                        {p.presence ? "✅ Présent" : "❌ Absent"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ListeParticipants;