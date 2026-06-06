import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormulaireEvenement = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        titre: "",           // ← changé: title → titre
        description: "", 
        date: "",            // ← ajouté: combinaison date + time
        capacite: "",        // ← changé: available_seats → capacite
        location: "" 
    });
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        // Validation des champs
        if (!formData.titre || !formData.description || !formData.date || !formData.capacite || !formData.location) {
            setMessage({ type: "error", text: "❌ Tous les champs sont obligatoires!" });
            setLoading(false);
            return;
        }

        try {
            // Préparer les données pour le backend
            const dataToSend = {
                titre: formData.titre,
                description: formData.description,
                date: formData.date,        // ← format "YYYY-MM-DDTHH:MM"
                capacite: parseInt(formData.capacite),
                location: formData.location
            };

            console.log("📤 Envoi des données:", dataToSend);

            const response = await axios.post("http://localhost:5000/api/evenements", dataToSend, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            
            setMessage({ type: "success", text: "✅ Événement créé avec succès! En attente de validation." });
            
            // Réinitialiser le formulaire
            setFormData({ titre: "", description: "", date: "", capacite: "", location: "" });
            
            setTimeout(() => navigate("/organisateur/dashboard"), 2000);
        } catch (error) {
            console.error("❌ Erreur détaillée:", error.response?.data || error.message);
            setMessage({ type: "error", text: `❌ Erreur: ${error.response?.data?.message || "Vérifiez le serveur"}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto", padding: "24px", background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px" }}>➕ Créer un événement</h2>
            
            {message && (
                <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "16px", textAlign: "center", background: message.type === "success" ? "#d1fae5" : "#fee2e2", color: message.type === "success" ? "#065f46" : "#991b1b" }}>
                    {message.text}
                </div>
            )}
            
            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Titre *</label>
                <input type="text" name="titre" value={formData.titre} onChange={handleChange} required style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }} />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" required style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Lieu / Salle *</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="Ex: Amphithéâtre A" style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }} />
                </div>
                <div>
                    <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Date et heure *</label>
                    <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} required style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }} />
                </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Capacité (places) *</label>
                <input type="number" name="capacite" value={formData.capacite} onChange={handleChange} required min="1" style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }} />
            </div>

            <button type="submit" disabled={loading} style={{ width: "100%", background: "#2563eb", color: "white", padding: "12px", borderRadius: "8px", border: "none", fontSize: "16px", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Création en cours..." : "➕ Créer l'événement"}
            </button>
        </form>
    );
};

export default FormulaireEvenement;