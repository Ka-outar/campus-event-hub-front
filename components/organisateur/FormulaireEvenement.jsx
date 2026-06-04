import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormulaireEvenement = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        titre: "", 
        description: "", 
        date: "", 
        capacite: "", 
        location: "" 
    });
    const [salles, setSalles] = useState([]);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchSalles = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/salles");
                setSalles(response.data);
            } catch (error) {
                setSalles([
                    { id: 1, nom: "Amphithéâtre A", capacite: 200 }, 
                    { id: 2, nom: "Salle B101", capacite: 50 },
                    { id: 3, nom: "Salle C202", capacite: 30 },
                    { id: 4, nom: "Espace Sportif", capacite: 100 },
                    { id: 5, nom: "Salle de Conférence", capacite: 80 },
                    { id: 6, nom: "Bibliothèque", capacite: 40 },
                    { id: 7, nom: "Labo Informatique", capacite: 25 },
                    { id: 8, nom: "Terrain de Football", capacite: 150 },
                    { id: 9, nom: "Salle Polyvalente", capacite: 120 }
                ]);
            }
        };
        fetchSalles();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await axios.post("http://localhost:5000/api/evenements", formData, {
                headers: { 
                    Authorization: `Bearer ${token}`, 
                    "Content-Type": "application/json" 
                }
            });

            setMessage({ type: "success", text: "✅ Événement enregistré avec succès dans la base de données !" });
            
            setFormData({ titre: "", description: "", date: "", capacite: "", location: "" });

            setTimeout(() => {
                navigate("/organisateur/dashboard");
            }, 1500);

        } catch (error) {
            console.error("Erreur lors de la création :", error);
            setMessage({ 
                type: "error", 
                text: error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement." 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "24px", background: "white", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <h2 style={{ marginBottom: "20px", color: "#1e3a8a" }}>➕ Créer un nouvel événement</h2>
            
            {message && (
                <div style={{ 
                    padding: "12px", 
                    borderRadius: "8px", 
                    marginBottom: "16px", 
                    background: message.type === "success" ? "#d1fae5" : "#fee2e2", 
                    color: message.type === "success" ? "#065f46" : "#991b1b",
                    fontWeight: "bold"
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Titre de l'événement</label>
                    <input 
                        type="text" 
                        name="titre" 
                        value={formData.titre} 
                        onChange={handleChange} 
                        required 
                        placeholder="Ex: Hackathon Campus 2026" 
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} 
                    />
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        rows="4" 
                        placeholder="Décrivez le programme de l'événement..." 
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", resize: "none" }} 
                        required
                    />
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Date et Heure</label>
                    <input 
                        type="datetime-local" 
                        name="date" 
                        value={formData.date} 
                        onChange={handleChange} 
                        required 
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} 
                    />
                </div>

                <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Nombre de places maximum</label>
                    <input 
                        type="number" 
                        name="capacite" 
                        value={formData.capacite} 
                        onChange={handleChange} 
                        required 
                        min="1" 
                        placeholder="Ex: 100" 
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }} 
                    />
                </div>

                <div style={{ marginBottom: "24px" }}>
                    <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>Lieu / Salle</label>
                    <select 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        required 
                        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" }}
                    >
                        <option value="">-- Choisir un emplacement --</option>
                        
                        {/* Salles principales */}
                        <optgroup label="🏛️ Salles principales">
                            {salles.slice(0, 5).map(salle => (
                                <option key={salle.id} value={salle.nom}>
                                    {salle.nom} ({salle.capacite} places)
                                </option>
                            ))}
                        </optgroup>
                        
                        {/* Salles spécialisées */}
                        <optgroup label="🔧 Salles spécialisées">
                            {salles.slice(5, 8).map(salle => (
                                <option key={salle.id} value={salle.nom}>
                                    {salle.nom} ({salle.capacite} places)
                                </option>
                            ))}
                        </optgroup>
                        
                        {/* Espaces extérieurs */}
                        <optgroup label="🌳 Espaces extérieurs">
                            <option value="Terrain de Sport Extérieur">Terrain de Sport Extérieur (200 places)</option>
                            <option value="Jardin du Campus">Jardin du Campus (100 places)</option>
                            <option value="Parking Sud">Parking Sud (300 places)</option>
                        </optgroup>
                        
                        {/* Options en ligne */}
                        <optgroup label="💻 En ligne">
                            <option value="Zoom Meeting">Zoom Meeting (Illimité)</option>
                            <option value="Google Meet">Google Meet (500 places)</option>
                            <option value="Microsoft Teams">Microsoft Teams (300 places)</option>
                        </optgroup>
                        
                        {/* Autre */}
                        <optgroup label="➕ Autres">
                            <option value="Autre (à préciser)">📝 Autre (à préciser dans la description)</option>
                        </optgroup>
                    </select>
                    <small style={{ color: "#6b7280", fontSize: "12px" }}>
                        💡 Si vous choisissez "Autre", veuillez préciser le lieu dans la description
                    </small>
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    style={{ 
                        width: "100%", 
                        background: loading ? "#9ca3af" : "#2563eb", 
                        color: "white", 
                        padding: "12px", 
                        borderRadius: "8px", 
                        border: "none", 
                        fontWeight: "bold", 
                        cursor: loading ? "not-allowed" : "pointer", 
                        fontSize: "16px" 
                    }}
                >
                    {loading ? "Enregistrement en cours..." : "Enregistrer et Publier"}
                </button>
            </form>
        </div>
    );
};

export default FormulaireEvenement;