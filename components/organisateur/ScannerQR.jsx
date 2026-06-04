import { useState } from 'react';

const ScannerQR = () => {
    const [scanResult, setScanResult] = useState(null);

    const simulateScan = () => {
        setScanResult({ success: true, message: "✅ Présence enregistrée!", inscriptionId: "INS-12345" });
        setTimeout(() => setScanResult(null), 3000);
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '24px', background: 'white', borderRadius: '12px' }}>
            <h2 style={{ textAlign: 'center' }}>📷 Scanner QR Code</h2>
            <div style={{ background: '#1f2937', borderRadius: '12px', padding: '60px', textAlign: 'center', marginBottom: '16px' }}>
                <p style={{ color: 'white', fontSize: '48px' }}>📷</p>
                <button onClick={simulateScan} style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '8px' }}>Simuler scan</button>
            </div>
            {scanResult && <div style={{ padding: '16px', background: '#d1fae5', color: '#065f46', textAlign: 'center', borderRadius: '8px' }}>{scanResult.message}</div>}
        </div>
    );
};

export default ScannerQR;