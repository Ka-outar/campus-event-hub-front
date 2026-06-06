import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardOrganisateur from "/components/organisateur/DashboardOrganisateur.jsx";
import FormulaireEvenement from "/components/organisateur/FormulaireEvenement.jsx";
import ListeParticipants from "/components/organisateur/ListeParticipants.jsx";
import ScannerQR from "/components/organisateur/ScannerQR.jsx";
import Navbar from "/components/common/Navbar.jsx";
import "./App.css";

localStorage.setItem("token", "fake-token-for-test");
localStorage.setItem("role", "organizer");
localStorage.setItem("nom", "Karim Organisateur");
localStorage.setItem("userId", "1");

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <div style={{ padding: "20px" }}>
                <Routes>
                    <Route path="/organisateur/dashboard" element={<DashboardOrganisateur />} />
                    <Route path="/organisateur/ajouter" element={<FormulaireEvenement />} />
                    <Route path="/organisateur/evenements/:eventId/participants" element={<ListeParticipants />} />
                    <Route path="/organisateur/scanner" element={<ScannerQR />} />
                    <Route path="/" element={<Navigate to="/organisateur/dashboard" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth'; 
import Profile from './components/Profile'; 
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import EventsCatalogue from './components/EventsCatalogue';
import MyRegistrations from './components/MyRegistrations';
import EventDetails from './components/EventDetails';

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
        {/* Si l'utilisateur n'est pas connecté, il va sur /auth */}
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
                      {/* Page de profil par défaut */}
                      <Route path="/profile" element={<Profile onLogout={handleLogout} />} />
                      
                      {/* Catalogue des événements */}
                      <Route path="/events" element={<EventsCatalogue />} />
                      
                      {/* Vrai composant des inscriptions réelles (sans doublon) */}
                      <Route path="/my-registrations" element={<MyRegistrations />} />
                      
                      {/* Détails d'un événement */}
                      <Route path="/events/:id" element={<EventDetails />} />
                      
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