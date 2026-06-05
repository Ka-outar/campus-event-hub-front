import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EventsCatalogue = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error(err));
  }, []);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(search.toLowerCase()) &&
    (category === '' || event.category === category)
  );

  // 🎨 دالة ذكية كتحسب كود فريد لكل حدث وتعطيه صورة مختلفة أوتوماتيكياً بلا ما تسوق للـ Category
  const getFallbackImage = (title, id) => {
    const imagesPool = [
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop', // ورشة عمل كمبيوتر
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&auto=format&fit=crop', // مؤتمر وجمهور
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&auto=format&fit=crop', // عمل جماعي وتواصل
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&auto=format&fit=crop', // عرض وتقديم على خشبة
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop', // طلاب في الجامعة
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=500&auto=format&fit=crop', // حرم جامعي
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop', // مايكروفون وإضاءة حدث
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format&fit=crop', // برمجة ولاب توب
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop', // مناقشة وابتكار
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=500&auto=format&fit=crop'  // عرض تقني تفاعلي
    ];

    // حساب رقم فريد بناءً على الـ ID وحروف العنوان
    let score = id ? parseInt(id, 10) : 0;
    if (title) {
      for (let i = 0; i < title.length; i++) {
        score += title.charCodeAt(i); // تحويل كل حرف فالعنوان لرقم وجمعه
      }
    }

    // اختيار الصورة المناسبة باستعمال باقي القسمة على طول المصفوفة
    return imagesPool[score % imagesPool.length];
  };

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <h2>📅 Catalogue des Événements</h2>
      
      {/* الفلاتر والبحث */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <input 
          type="text" 
          placeholder="Rechercher un événement..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        >
          <option value="">Toutes les catégories</option>
          <option value="Conférence">Conférence</option>
          <option value="Atelier">Atelier</option>
          <option value="Sport">Sport</option>
          <option value="Culture">Culture</option>
        </select>
      </div>

      {/* شبكة الأحداث */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredEvents.map(event => (
          <div key={event.id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            
            {/* 📸 الـ تاق السحري: كيمرر العنوان والـ id دابا */}
            <img 
              src={event.image_url && event.image_url.trim() !== "" && !event.image_url.includes('undefined') ? event.image_url : getFallbackImage(event.title, event.id)} 
              alt={event.title} 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = getFallbackImage(event.title, event.id);
              }}
              style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} 
            />

            <h3 style={{ margin: '10px 0 5px 0' }}>{event.title}</h3>
            <p style={{ color: '#777', fontSize: '14px' }}>📍 {event.location}</p>
            <p style={{ fontWeight: 'bold', color: event.available_seats > 0 ? '#059669' : '#dc2626' }}>
              {event.available_seats} places restantes
            </p>
            <button 
              onClick={() => navigate(`/events/${event.id}`)}
              style={{ width: '100%', padding: '10px', background: '#0056b3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}
            >
              Voir Détails
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsCatalogue;