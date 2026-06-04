import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth'; 
import Profile from './components/Profile'; 
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import EventsCatalogue from './components/EventsCatalogue';
import MyRegistrations from './components/MyRegistrations';


function App() {
  // Vérifier si un utilisateur est déjà enregistré dans le localStorage du navigateur
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Fonction pour gérer la déconnexion (suppression des données)
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null); // Met à jour l'état pour réafficher automatiquement le composant Auth
  };

  // Fonction appelée après une connexion réussie pour mettre à jour l'état de l'application
  const handleLoginSuccess = () => {
    const storedUser = localStorage.getItem('user');
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  return (
    <Router>
      <Routes>
        {/* Si l'utilisateur n'est pas connecté, il va sur /auth (qui affiche le composant Auth) */}
        <Route 
          path="/auth" 
          element={!user ? <Auth onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/profile" />} 
        />

        {/* Si l'utilisateur est connecté, toutes les routes bénéficient de la Navbar et Sidebar */}
        <Route
          path="/*"
          element={
            user ? (
              <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
                {/* 1. Sidebar fixe à gauche */}
                <Sidebar />

                {/* 2. Conteneur principal à droite (Navbar + Contenu de la page) */}
                <div style={{ flex: 1, marginLeft: '260px', paddingTop: '65px', position: 'relative' }}>
                  <Navbar onLogout={handleLogout} />
                  
                  {/* Zone dynamique où les pages vont s'afficher */}
                  <div style={{ padding: '30px', boxSizing: 'border-box' }}>
                    <Routes>
                      {/* Tâche 4 : Page de profil par défaut */}
                      <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
                      
                      <Route path="/events" element={<EventsCatalogue />} />
                      {/* Espaces réservés pour les prochaines étapes (Tâches 5, 6, 7) */}
                      <Route path="/events" element={<div><h2>Catalogue des événements (Tâche 5 - En cours)</h2></div>} />
                      <Route path="/my-registrations" element={<div><h2>Mes Inscriptions (Tâche 7 - En cours)</h2></div>} />
                      <Route path="/my-registrations" element={<MyRegistrations />} />
                      {/* Redirection automatique si la route n'existe pas */}
                      <Route path="*" element={<Navigate to="/profile" />} />
                    </Routes>
                  </div>
                </div>
              </div>
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;