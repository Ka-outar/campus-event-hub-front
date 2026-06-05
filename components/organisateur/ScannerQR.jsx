
import { useState } from "react";
import axios from "axios";

const ScannerQR = () => {
    const [scanResult, setScanResult] = useState(null);
    const [scanning, setScanning] = useState(false);
    const token = localStorage.getItem("token");

    const simulateScan = async () => {
        const mockInscriptionId = prompt("Entrez l'ID d'inscription pour tester (ex: 1):", "1");
        if (!mockInscriptionId) return;
        
        setScanning(true);
        
        try {
            await axios.put(`http://localhost:5000/api/inscriptions/${mockInscriptionId}/presence`, 
                { presence: true },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setScanResult({ success: true, message: "✅ Présence enregistrée avec succès!", inscriptionId: mockInscriptionId });
        } catch (error) {
            setScanResult({ success: false, message: "❌ Erreur: Ticket invalide", inscriptionId: mockInscriptionId });
        } finally {
            setScanning(false);
            setTimeout(() => setScanResult(null), 3000);
        }
    };

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "24px", background: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "24px", textAlign: "center" }}>📷 Scanner QR Code</h2>
            
            <div style={{ textAlign: "center", marginBottom: "16px", color: "#6b7280" }}>
                <p>Scannez le QR code du billet pour valider la présence</p>
            </div>
            
            <div style={{ backgroundColor: "#1f2937", borderRadius: "12px", padding: "60px", textAlign: "center", marginBottom: "16px", border: "2px dashed #4b5563" }}>
                <div style={{ color: "white" }}>
                    <p style={{ fontSize: "48px", marginBottom: "16px" }}>📷</p>
                    <p>Zone de caméra</p>
                    <button
                        onClick={simulateScan}
                        disabled={scanning}
                        style={{ marginTop: "16px", backgroundColor: "#3b82f6", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}
                    >
                        {scanning ? "Scan en cours..." : "Simuler un scan"}
                    </button>
                </div>
            </div>
            
            {scanResult && (
                <div style={{ marginTop: "16px", padding: "16px", borderRadius: "8px", textAlign: "center", backgroundColor: scanResult.success ? "#d1fae5" : "#fee2e2", color: scanResult.success ? "#065f46" : "#991b1b", border: `1px solid ${scanResult.success ? "#10b981" : "#ef4444"}` }}>
                    <p style={{ fontWeight: "bold" }}>{scanResult.message}</p>
                    <p style={{ fontSize: "12px", marginTop: "4px" }}>ID: {scanResult.inscriptionId}</p>
                </div>
            )}
            
            <div style={{ marginTop: "24px", padding: "16px", backgroundColor: "#fef3c7", borderRadius: "8px", textAlign: "center", fontSize: "14px", color: "#92400e" }}>
                💡 Astuce: Cliquez sur "Simuler un scan" pour tester la validation de présence
            </div>
        </div>
    );
};

export default ScannerQR;