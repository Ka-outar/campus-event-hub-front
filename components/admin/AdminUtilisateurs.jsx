import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUtilisateurs = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/utilisateurs', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/utilisateurs/${userId}/role`, 
                { role: newRole },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: '✅ Rôle modifié avec succès' });
            fetchUsers();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || '❌ Erreur' });
        }
    };

    const handleToggleActif = async (userId, currentActif) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/utilisateurs/${userId}/activer`,
                { actif: !currentActif },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage({ type: 'success', text: currentActif ? '⚠️ Compte désactivé' : '✅ Compte activé' });
            fetchUsers();
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || '❌ Erreur' });
        }
    };

    const getRoleBadge = (role) => {
        switch(role) {
            case 'ADMIN': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">👑 Admin</span>;
            case 'ORGANISATEUR': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">📋 Organisateur</span>;
            default: return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">🎓 Étudiant</span>;
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-right">👥 Gestion des utilisateurs</h2>
            
            {message && (
                <div className={`mb-4 p-3 rounded text-center ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message.text}
                </div>
            )}
            
            {loading ? (
                <p className="text-center text-gray-500">Chargement...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-right">Nom</th>
                                <th className="p-3 text-right">Email</th>
                                <th className="p-3 text-right">Rôle</th>
                                <th className="p-3 text-right">Statut</th>
                                <th className="p-3 text-right">Date inscription</th>
                                <th className="p-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3 font-medium">{user.nom}</td>
                                    <td className="p-3">{user.email}</td>
                                    <td className="p-3">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="border rounded p-1 text-sm"
                                        >
                                            <option value="ETUDIANT">🎓 Étudiant</option>
                                            <option value="ORGANISATEUR">📋 Organisateur</option>
                                            <option value="ADMIN">👑 Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-sm ${user.actif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.actif ? 'Actif' : 'Désactivé'}
                                        </span>
                                    </td>
                                    <td className="p-3">{new Date(user.created_at).toLocaleDateString('fr-FR')}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => handleToggleActif(user.id, user.actif)}
                                            className={`px-3 py-1 rounded text-white transition ${
                                                user.actif ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                                            }`}
                                        >
                                            {user.actif ? '🔒 Désactiver' : '✅ Activer'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUtilisateurs;