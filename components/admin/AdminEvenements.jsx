import { useEffect, useState } from "react";
import axios from "axios";

const AdminEvenements = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchAllEvents();
    }, []);

    const fetchAllEvents = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/evenements/all", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(response.data);
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (event) => {
        try {
            await axios.put("http://localhost:5000/api/admin/evenements/approve", 
                { title: event.title },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: "success", text: `✅ "${event.title}" a été approuvé!` });
            fetchAllEvents();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: "error", text: "❌ Erreur lors de l'approbation" });
        }
    };

    const openRejectModal = (event) => {
        setSelectedEvent(event);
        setShowRejectModal(true);
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            setMessage({ type: "error", text: "❌ Veuillez saisir une justification" });
            return;
        }
        
        try {
            await axios.put("http://localhost:5000/api/admin/evenements/reject", 
                { title: selectedEvent.title, reason: rejectReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: "success", text: `❌ "${selectedEvent.title}" a été rejeté!` });
            setShowRejectModal(false);
            setRejectReason("");
            setSelectedEvent(null);
            fetchAllEvents();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: "error", text: "❌ Erreur lors du rejet" });
        }
    };

    const handleDelete = async (event) => {
        if (window.confirm(`Supprimer l'événement "${event.title}" ? Cette action est irréversible.`)) {
            try {
                await axios.delete("http://localhost:5000/api/admin/evenements/delete", {
                    headers: { Authorization: `Bearer ${token}` },
                    data: { title: event.title }
                });
                setMessage({ type: "success", text: `🗑️ "${event.title}" a été supprimé!` });
                fetchAllEvents();
                setTimeout(() => setMessage(null), 3000);
            } catch (error) {
                setMessage({ type: "error", text: "❌ Erreur lors de la suppression" });
            }
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'approved': 
                return <span style={{ background: "#d1fae5", color: "#065f46", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>✅ Approuvé</span>;
            case 'rejected': 
                return <span style={{ background: "#fee2e2", color: "#991b1b", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>❌ Rejeté</span>;
            default: 
                return <span style={{ background: "#fef3c7", color: "#92400e", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>⏳ En attente</span>;
        }
    };

    if (loading) return <div style={{ padding: "40px", textAlign: "center", fontSize: "18px" }}>⏳ Chargement des événements...</div>;

    const pendingEvents = events.filter(e => e.status === 'pending');
    const approvedEvents = events.filter(e => e.status === 'approved');
    const rejectedEvents = events.filter(e => e.status === 'rejected');

    return (
        <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ marginBottom: "24px" }}>
                <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#1e40af" }}>📋 Gestion des événements</h2>
                <p style={{ color: "#6b7280", marginTop: "8px" }}>Gérez tous les événements du campus (Approbation, Rejet, Suppression)</p>
            </div>
            
            {message && (
                <div style={{ 
                    padding: "12px 20px", 
                    borderRadius: "8px", 
                    marginBottom: "20px", 
                    background: message.type === "success" ? "#d1fae5" : "#fee2e2", 
                    color: message.type === "success" ? "#065f46" : "#991b1b", 
                    fontWeight: "bold",
                    border: `1px solid ${message.type === "success" ? "#10b981" : "#ef4444"}`
                }}>
                    {message.text}
                </div>
            )}

            {/* Modal de rejet */}
            {showRejectModal && selectedEvent && (
                <div style={{ 
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
                    background: "rgba(0,0,0,0.5)", display: "flex", 
                    alignItems: "center", justifyContent: "center", zIndex: 1000 
                }}>
                    <div style={{ background: "white", borderRadius: "16px", padding: "28px", width: "500px", maxWidth: "90%" }}>
                        <h3 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px", color: "#991b1b" }}>❌ Rejet de l'événement</h3>
                        <p style={{ marginBottom: "16px", color: "#4b5563" }}>
                            Événement: <strong style={{ color: "#1f2937" }}>{selectedEvent.title}</strong>
                        </p>
                        <textarea 
                            value={rejectReason} 
                            onChange={(e) => setRejectReason(e.target.value)} 
                            placeholder="Raison du rejet (obligatoire)..." 
                            rows="4" 
                            style={{ width: "100%", padding: "12px", border: "1px solid #ccc", borderRadius: "8px", marginBottom: "20px", fontSize: "14px", resize: "vertical" }} 
                        />
                        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                            <button 
                                onClick={() => { setShowRejectModal(false); setRejectReason(""); setSelectedEvent(null); }} 
                                style={{ background: "#6b7280", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}
                            >
                                Annuler
                            </button>
                            <button 
                                onClick={handleRejectSubmit} 
                                style={{ background: "#ef4444", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}
                            >
                                Confirmer le rejet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Section: En attente */}
            <div style={{ marginBottom: "40px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", borderBottom: "2px solid #fef3c7", paddingBottom: "8px" }}>
                    <span style={{ fontSize: "24px" }}>⏳</span>
                    <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#92400e" }}>En attente de validation</h3>
                    <span style={{ background: "#fef3c7", color: "#92400e", padding: "2px 10px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" }}>{pendingEvents.length}</span>
                </div>
                {pendingEvents.length === 0 ? (
                    <div style={{ background: "#fef3c7", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
                        <p style={{ color: "#92400e" }}>🎉 Aucun événement en attente de validation</p>
                        <p style={{ fontSize: "13px", marginTop: "8px" }}>Ajoutez des événements avec status 'pending' pour tester</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {pendingEvents.map((event, index) => (
                            <EventCard 
                                key={index}
                                event={event}
                                onApprove={() => handleApprove(event)}
                                onReject={() => openRejectModal(event)}
                                onDelete={() => handleDelete(event)}
                                getStatusBadge={getStatusBadge}
                                showActions={true}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Section: Approuvés */}
            <div style={{ marginBottom: "40px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", borderBottom: "2px solid #d1fae5", paddingBottom: "8px" }}>
                    <span style={{ fontSize: "24px" }}>✅</span>
                    <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#065f46" }}>Événements approuvés</h3>
                    <span style={{ background: "#d1fae5", color: "#065f46", padding: "2px 10px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" }}>{approvedEvents.length}</span>
                </div>
                {approvedEvents.length === 0 ? (
                    <div style={{ background: "#d1fae5", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
                        <p style={{ color: "#065f46" }}>Aucun événement approuvé pour le moment</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {approvedEvents.map((event, index) => (
                            <EventCard 
                                key={index}
                                event={event}
                                onDelete={() => handleDelete(event)}
                                getStatusBadge={getStatusBadge}
                                showActions={false}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Section: Rejetés */}
            <div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", borderBottom: "2px solid #fee2e2", paddingBottom: "8px" }}>
                    <span style={{ fontSize: "24px" }}>❌</span>
                    <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#991b1b" }}>Événements rejetés</h3>
                    <span style={{ background: "#fee2e2", color: "#991b1b", padding: "2px 10px", borderRadius: "20px", fontSize: "14px", fontWeight: "bold" }}>{rejectedEvents.length}</span>
                </div>
                {rejectedEvents.length === 0 ? (
                    <div style={{ background: "#fee2e2", borderRadius: "12px", padding: "40px", textAlign: "center" }}>
                        <p style={{ color: "#991b1b" }}>Aucun événement rejeté</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {rejectedEvents.map((event, index) => (
                            <EventCard 
                                key={index}
                                event={event}
                                onDelete={() => handleDelete(event)}
                                getStatusBadge={getStatusBadge}
                                showActions={false}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// Composant Carte Événement
const EventCard = ({ event, onApprove, onReject, onDelete, getStatusBadge, showActions }) => {
    return (
        <div style={{ 
            background: "white", 
            borderRadius: "16px", 
            padding: "20px", 
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)", 
            border: "1px solid #e5e7eb",
            transition: "box-shadow 0.2s"
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                {/* Boutons d'action */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {showActions && (
                        <>
                            <button 
                                onClick={onApprove} 
                                style={{ background: "#10b981", color: "white", padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}
                            >
                                ✅ Approuver
                            </button>
                            <button 
                                onClick={onReject} 
                                style={{ background: "#ef4444", color: "white", padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}
                            >
                                ❌ Rejeter
                            </button>
                        </>
                    )}
                    <button 
                        onClick={onDelete} 
                        style={{ background: "#6b7280", color: "white", padding: "8px 18px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "14px" }}
                    >
                        🗑️ Supprimer
                    </button>
                </div>
                
                {/* Informations de l'événement */}
                <div style={{ textAlign: "right", flex: 1 }}>
                    <div style={{ marginBottom: "10px", display: "flex", justifyContent: "flex-end" }}>
                        {getStatusBadge(event.status)}
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937", marginBottom: "6px" }}>
                        {event.title}
                    </h3>
                    <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "8px", lineHeight: "1.5" }}>
                        {event.description}
                    </p>
                    <div style={{ fontSize: "13px", color: "#9ca3af", display: "flex", justifyContent: "flex-end", gap: "16px", flexWrap: "wrap", marginTop: "8px" }}>
                        <span>📅 {event.date_event ? new Date(event.date_event).toLocaleDateString("fr-FR") : "Date non définie"}</span>
                        <span>⏰ {event.time_event || "--:--"}</span>
                        <span>📍 {event.location}</span>
                        <span>🎟️ {event.available_seats} places</span>
                        <span>👤 {event.organisateur_nom}</span>
                    </div>
                    {event.rejection_reason && (
                        <div style={{ marginTop: "12px", padding: "10px", background: "#fee2e2", borderRadius: "10px", fontSize: "12px", color: "#991b1b", textAlign: "right" }}>
                            <strong>📝 Raison du rejet :</strong> {event.rejection_reason}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminEvenements;