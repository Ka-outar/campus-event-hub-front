
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const nom = localStorage.getItem("nom");

    return (
        <nav style={{ backgroundColor: "#1e40af", color: "white", padding: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1200px", margin: "0 auto" }}>
                <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>🏫 Campus Events Hub</h1>
                <div>
                    {/* Menu Organisateur */}
                    {role === "organizer" && (
                        <>
                            <button onClick={() => navigate("/organisateur/dashboard")} style={{ margin: "0 8px", background: "transparent", color: "white", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: "8px" }}>📊 Dashboard</button>
                            <button onClick={() => navigate("/organisateur/ajouter")} style={{ margin: "0 8px", background: "transparent", color: "white", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: "8px" }}>➕ Ajouter</button>
                            <button onClick={() => navigate("/organisateur/scanner")} style={{ margin: "0 8px", background: "transparent", color: "white", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: "8px" }}>📷 Scanner</button>
                        </>
                    )}
                    <span style={{ marginLeft: "16px", padding: "8px 16px", background: "#1e3a8a", borderRadius: "20px" }}>👋 {nom}</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;