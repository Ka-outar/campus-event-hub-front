
import { useEffect, useState } from "react";
import axios from "axios";

const AdminUtilisateurs = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newUser, setNewUser] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        role: "STUDENT",
        telephone: ""
    });
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Erreur:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/admin/users", newUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: "success", text: "✅ Utilisateur ajouté avec succès!" });
            setShowAddForm(false);
            setNewUser({ nom: "", prenom: "", email: "", password: "", role: "STUDENT", telephone: "" });
            fetchUsers();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: "error", text: "❌ Erreur lors de l'ajout" });
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${id}/role`, 
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: "success", text: "✅ Rôle modifié!" });
            fetchUsers();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: "error", text: "❌ Erreur" });
        }
    };

    const handleDelete = async (id, username) => {
        if (window.confirm(`Supprimer "${username}" ?`)) {
            try {
                await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ type: "success", text: "✅ Utilisateur supprimé!" });
                fetchUsers();
            } catch (error) {
                setMessage({ type: "error", text: "❌ Erreur" });
            }
        }
    };

    const getRoleBadge = (role) => {
        switch(role) {
            case 'admin': return <span style={{ background: "#fee2e2", color: "#991b1b", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>👑 Administrateur</span>;
            case 'organizer': return <span style={{ background: "#dbeafe", color: "#1e40af", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>📋 Organisateur</span>;
            default: return <span style={{ background: "#d1fae5", color: "#065f46", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>🎓 Étudiant</span>;
        }
    };

    if (loading) return <div style={{ padding: "20px", textAlign: "center" }}>⏳ Chargement...</div>;

    return (
        <div style={{ padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#1e40af" }}>👥 Gestion des utilisateurs</h2>
                <button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    style={{ background: "#10b981", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}
                >
                    ➕ Ajouter un utilisateur
                </button>
            </div>
            
            {message && (
                <div style={{ padding: "12px", borderRadius: "8px", marginBottom: "16px", background: message.type === "success" ? "#d1fae5" : "#fee2e2", color: message.type === "success" ? "#065f46" : "#991b1b", fontWeight: "bold" }}>
                    {message.text}
                </div>
            )}

            {/* Formulaire d'ajout */}
            {showAddForm && (
                <div style={{ background: "white", borderRadius: "12px", padding: "24px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>📝 Nouvel utilisateur</h3>
                    <form onSubmit={handleAddUser} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <input type="text" placeholder="Nom" value={newUser.nom} onChange={(e) => setNewUser({...newUser, nom: e.target.value})} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }} />
                        <input type="text" placeholder="Prénom" value={newUser.prenom} onChange={(e) => setNewUser({...newUser, prenom: e.target.value})} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }} />
                        <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }} />
                        <input type="password" placeholder="Mot de passe" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} required style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }} />
                        <input type="tel" placeholder="Téléphone" value={newUser.telephone} onChange={(e) => setNewUser({...newUser, telephone: e.target.value})} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }} />
                        <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})} style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "8px" }}>
                            <option value="STUDENT">Étudiant</option>
                            <option value="ORGANIZER">Organisateur</option>
                            <option value="ADMIN">Administrateur</option>
                        </select>
                        <button type="submit" style={{ background: "#2563eb", color: "white", padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}>✅ Créer</button>
                        <button type="button" onClick={() => setShowAddForm(false)} style={{ background: "#6b7280", color: "white", padding: "10px", borderRadius: "8px", border: "none", cursor: "pointer" }}>Annuler</button>
                    </form>
                </div>
            )}

            {/* Tableau des utilisateurs */}
            <div style={{ background: "white", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                            <tr>
                                <th style={{ padding: "15px", textAlign: "right" }}>Nom</th>
                                <th style={{ padding: "15px", textAlign: "right" }}>Email</th>
                                <th style={{ padding: "15px", textAlign: "right" }}>Rôle</th>
                                <th style={{ padding: "15px", textAlign: "right" }}>Date inscription</th>
                                <th style={{ padding: "15px", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                    <td style={{ padding: "15px", fontWeight: "500" }}>{user.username}</td>
                                    <td style={{ padding: "15px", color: "#4b5563" }}>{user.email}</td>
                                    <td style={{ padding: "15px" }}>{getRoleBadge(user.role)}</td>
                                    <td style={{ padding: "15px", color: "#6b7280", fontSize: "14px" }}>{new Date(user.created_at).toLocaleDateString("fr-FR")}</td>
                                    <td style={{ padding: "15px" }}>
                                        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                style={{ border: "1px solid #d1d5db", borderRadius: "6px", padding: "6px 10px", fontSize: "13px", cursor: "pointer" }}
                                            >
                                                <option value="student">🎓 Étudiant</option>
                                                <option value="organizer">📋 Organisateur</option>
                                                <option value="admin">👑 Admin</option>
                                            </select>
                                            <button onClick={() => handleDelete(user.id, user.username)} style={{ background: "#ef4444", color: "white", padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}>🗑️ Supprimer</button>
                                        </div>
                                    </td>
                                 </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUtilisateurs;