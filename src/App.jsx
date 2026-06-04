import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminEvenements from "/components/admin/AdminEvenements";
import AdminUtilisateurs from "/components/admin/AdminUtilisateurs";
import Navbar from "/components/common/Navbar";
import "./App.css";

// Configuration pour Admin
localStorage.setItem("token", "fake-token-for-test");
localStorage.setItem("role", "admin");
localStorage.setItem("nom", "Admin Principal");
localStorage.setItem("userId", "1");

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <div style={{ padding: "20px" }}>
                <Routes>
                    <Route path="/admin/evenements" element={<AdminEvenements />} />
                    <Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
                    <Route path="/" element={<Navigate to="/admin/evenements" />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;