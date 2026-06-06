import { QRCodeSVG } from 'qrcode.react';

const TicketModal = ({ isOpen, onClose, ticketData }) => {
  if (!isOpen || !ticketData) return null;

  // غادي نجمعو بيانات التذكرة ف نص واحد فريد باش يلا تسكانات بالهاتف تقرا هاد البيانات
  const qrValue = JSON.stringify({
    inscriptionId: ticketData.inscription_id || ticketData.id,
    studentName: ticketData.student_name || 'Étudiant',
    eventTitle: ticketData.event_title || ticketData.title,
    date: ticketData.date
  });

  return (
    <div style={styles.overlay}>
      <div style={styles.modalContainer}>
        {/* زر الإغلاق */}
        <button onClick={onClose} style={styles.closeButton}>✕</button>

        <h3 style={{ textAlign: 'center', marginBottom: '15px', color: '#333' }}>🎟️ Votre Billet Numérique</h3>

        {/* كارت التذكرة */}
        <div style={styles.ticketCard}>
          {/* الجزء العلوي: معلومات الحدث */}
          <div style={styles.ticketHeader}>
            <span style={styles.badge}>CAMPUS EVENT</span>
            <h4 style={styles.eventTitle}>{ticketData.event_title || ticketData.title}</h4>
            <p style={styles.ticketText}>👤 <strong>Nom:</strong> {ticketData.student_name || 'Test User'}</p>
            <p style={styles.ticketText}>📍 <strong>Lieu:</strong> {ticketData.location || 'Amphi A, ENSET'}</p>
            <p style={styles.ticketText}>📅 <strong>Date:</strong> {ticketData.date || 'Non spécifiée'}</p>
          </div>

          {/* خط التقطيع الوهمي للتذكرة */}
          <div style={styles.ticketDivider}></div>

          {/* الجزء السفلي: الـ QR Code الفريد */}
          <div style={styles.ticketFooter}>
            <div style={styles.qrContainer}>
              <QRCodeSVG 
                value={qrValue} 
                size={140} 
                level="H" // درجة حماية عالية للخطأ باش يتقرا بسهولة
                includeMargin={true}
              />
            </div>
            <p style={styles.scanNotice}>Présentez ce QR Code à l'entrée de l'événement</p>
            <span style={styles.ticketId}>ID: #{ticketData.inscription_id || ticketData.id || '0000'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🎨 ستايل أنيق للتذكرة الرقمية
const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
  },
  modalContainer: {
    backgroundColor: '#f4f4f6', padding: '25px', borderRadius: '16px',
    position: 'relative', width: '340px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
  },
  closeButton: {
    position: 'absolute', top: '12px', right: '15px',
    background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666'
  },
  ticketCard: {
    backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column'
  },
  ticketHeader: {
    padding: '20px', backgroundColor: '#0056b3', color: '#fff', position: 'relative'
  },
  badge: {
    fontSize: '10px', background: 'rgba(255,255,255,0.2)', padding: '3px 8px',
    borderRadius: '20px', fontWeight: 'bold', display: 'inline-block', marginBottom: '8px'
  },
  eventTitle: { margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' },
  ticketText: { margin: '4px 0', fontSize: '13px', opacity: 0.9 },
  ticketDivider: {
    borderTop: '2px dashed #e0e0e0', height: '1px', backgroundColor: '#fff', position: 'relative'
  },
  ticketFooter: {
    padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#fff'
  },
  qrContainer: {
    padding: '10px', background: '#f9f9f9', borderRadius: '8px',
    border: '1px solid #eee', marginBottom: '10px'
  },
  scanNotice: { fontSize: '11px', color: '#777', textAlign: 'center', margin: '5px 0' },
  ticketId: { fontSize: '10px', color: '#aaa', fontWeight: 'bold', marginTop: '5px' }
};

export default TicketModal;