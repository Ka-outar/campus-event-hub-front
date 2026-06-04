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
}

export default App;