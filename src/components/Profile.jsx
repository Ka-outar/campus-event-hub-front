import { useState, useRef } from 'react';

const Profile = ({ onLogout }) => {
  // جلب بيانات المستخدم من الـ localStorage عند تحميل المكون
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const fileInputRef = useRef(null);

  // States - Initialisation directe avec les données user
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(user?.username || 'User');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [avatarColor, setAvatarColor] = useState(localStorage.getItem(`theme_${user?.email}`) || '#0056b3');
  const [profileImage, setProfileImage] = useState(user?.profile_image || localStorage.getItem(`profile_img_${user?.email}`) || null);

  if (!user) {
    return (
      <div style={styles.errorContainer}>
        <p style={styles.errorText}>Veuillez vous connecter pour accéder à votre profil.</p>
      </div>
    );
  }

  // حفظ لون الثيم فـ الـ localStorage باش ما يتمسحش فاش نديرو Refresh
  const handleColorChange = (color) => {
    setAvatarColor(color);
    localStorage.setItem(`theme_${user.email}`, color);
  };

  // التعامل مع تحميل الصورة وتحويلها لـ Base64 وحفظها محلياً فقط
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // حماية: تأكدي باللي الصورة ماشي كبر من 5MB مثلاً لتفادي ثقل المتصفح
      if (file.size > 5 * 1024 * 1024) {
        alert("La taille de l'image est trop grande (Max 5MB)");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfileImage(base64String);
        localStorage.setItem(`profile_img_${user.email}`, base64String);

        // تحديث الكائن ف الـ localStorage باش تبقا الصورة باينة حتا فاش ديري ريفريش
        const currentUserData = JSON.parse(localStorage.getItem('user')) || {};
        currentUserData.profile_image = base64String;
        localStorage.setItem('user', JSON.stringify(currentUserData));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // دالة حفظ التغييرات وإرسالها للسيرفر (تم حذف حقل الصورة من الإرسال)
  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true); // تفعيل حالة التحميل
    
    const userId = user?.id || user?._id || JSON.parse(localStorage.getItem('user'))?.id;

    if (!userId) {
      alert("Erreur: ID de l'utilisateur introuvable. Veuillez vous reconnecter.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/update', { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId, 
          username: username,
          email: email,
          password: password ? password : ""
        })
      });

      const data = await response.json();

      if (data.success || response.ok) {
        // 1. تحديث الكائن الجديد للـ User (مع الاحتفاظ بالصورة محلياً)
        const updatedUser = { 
          ...user, 
          id: userId, 
          username: username, 
          email: email, 
          profile_image: profileImage
        };
        
        // 2. تحديث الـ LocalStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // 3. تحديث الـ State الرئيسي
        setUser(updatedUser);
        
        setIsEditing(false);
        setPassword('');
        alert("Profil mis à jour avec succès !");
      } else {
        alert(data.message || "Erreur lors de la mise à jour");
      }

    } catch (error) {
      console.error("Erreur Backend:", error);
      
      // حل احتياطي في حالة انقطاع السيرفر
      const updatedUser = { ...user, username, email, profile_image: profileImage };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      alert("Profil mis à jour localement (Erreur connexion serveur)");
    } finally {
      setLoading(false);
    }
  };

  const colors = ['#0056b3', '#0076ff', '#2ec4b6', '#ff9f1c', '#e63946', '#6f42c1'];

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        
        {/* Header */}
        <div style={{ ...styles.cardHeader, backgroundColor: avatarColor }}>
          <span style={styles.userRole}>{user.role ? user.role.toUpperCase() : 'STUDENT'}</span>
        </div>
        
        {/* Dynamic Photo de profil Option */}
        <div style={styles.avatarContainer}>
          <div 
            onClick={triggerFileSelect} 
            style={{ ...styles.avatar, borderColor: '#ffffff', cursor: 'pointer' }}
            title="Changer la photo de profil"
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" style={styles.uploadedImage} />
            ) : (
              <span style={{ color: avatarColor }}>{username.charAt(0).toUpperCase()}</span>
            )}
            
            <div style={{ ...styles.cameraBadge, backgroundColor: avatarColor }}>📷</div>
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>

        {/* Color Theme Picker */}
        <div style={styles.colorPickerContainer}>
          <p style={styles.pickerLabel}>Personnaliser le thème :</p>
          <div style={styles.colorOptions}>
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorChange(color)}
                style={{
                  ...styles.colorCircle,
                  backgroundColor: color,
                  border: avatarColor === color ? '2px solid #333' : '2px solid transparent'
                }}
              />
            ))}
          </div>
        </div>

        {/* Card Body */}
        <div style={styles.cardBody}>
          
          {!isEditing ? (
            <div>
              <h2 style={styles.welcomeTitle}>{username}</h2>
              <p style={styles.subtitle}>ENSET Casablanca Portal</p>
              
              <div style={styles.infoContainer}>
                <div style={styles.infoField}>
                  <span style={styles.fieldLabel}>Full Name</span>
                  <span style={styles.fieldValue}>{username}</span>
                </div>

                <div style={styles.infoField}>
                  <span style={styles.fieldLabel}>Email Address</span>
                  <span style={styles.fieldValue}>{email}</span>
                </div>
              </div>

              <div style={styles.actionButtons}>
                <button 
                  onClick={() => setIsEditing(true)} 
                  style={{ ...styles.btn, ...styles.btnEdit, borderColor: avatarColor, color: avatarColor }}
                >
                  Modifier le profil
                </button>
                <button onClick={onLogout} style={{ ...styles.btn, ...styles.btnLogout }}>
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveChanges} style={styles.form}>
              <h3 style={styles.formTitle}>Modifier les informations</h3>
              
              <div style={styles.inputGroup}>
                <label style={styles.label}>Nom complet</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  style={styles.input}
                  required
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Adresse Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  style={styles.input}
                  required
                  disabled={loading}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Nouveau mot de passe (Optionnel)</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  style={styles.input}
                  disabled={loading}
                />
              </div>

              <div style={styles.formActions}>
                <button 
                  type="submit" 
                  style={{ ...styles.btn, ...styles.btnSave, backgroundColor: avatarColor, opacity: loading ? 0.7 : 1 }}
                  disabled={loading}
                >
                  {loading ? "Enregistrement..." : "Sauvegarder"}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)} 
                  style={{ ...styles.btn, ...styles.btnCancel }}
                  disabled={loading}
                >
                  Annuler
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f8fafc',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
    fontFamily: '"Segoe UI", Roboto, sans-serif'
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    width: '400px',
    maxWidth: '92%',
    overflow: 'hidden',
    border: '1px solid #e2e8f0'
  },
  cardHeader: {
    height: '120px',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '15px',
    boxSizing: 'border-box',
    transition: 'background-color 0.4s ease'
  },
  userRole: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '4px 12px',
    borderRadius: '100px',
    height: 'fit-content'
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '-55px',
    marginBottom: '10px',
    position: 'relative'
  },
  avatar: {
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '44px',
    fontWeight: '700',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    border: '4px solid',
    position: 'relative',
    overflow: 'visible'
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  cameraBadge: {
    position: 'absolute',
    bottom: '2px',
    right: '2px',
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '12px',
    color: '#ffffff',
    border: '2px solid #ffffff',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  colorPickerContainer: {
    textAlign: 'center',
    marginBottom: '15px'
  },
  pickerLabel: {
    fontSize: '11px',
    color: '#64748b',
    margin: '0 0 6px 0'
  },
  colorOptions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px'
  },
  colorCircle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    cursor: 'pointer',
    padding: 0,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease'
  },
  cardBody: {
    padding: '0 30px 30px 30px',
    textAlign: 'center'
  },
  welcomeTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0'
  },
  subtitle: {
    fontSize: '13px',
    color: '#64748b',
    margin: '4px 0 20px 0'
  },
  infoContainer: {
    border: '1px solid #f1f5f9',
    backgroundColor: '#f8fafc',
    padding: '16px',
    borderRadius: '12px',
    textAlign: 'left',
    marginBottom: '20px'
  },
  infoField: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '12px'
  },
  fieldLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '2px'
  },
  fieldValue: {
    fontSize: '14px',
    color: '#334155',
    fontWeight: '600'
  },
  actionButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  btn: {
    width: '100%',
    padding: '12px 0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    border: 'none',
    transition: 'all 0.2s ease'
  },
  btnEdit: {
    backgroundColor: 'transparent',
    border: '1px solid',
  },
  btnLogout: {
    backgroundColor: '#f1f5f9',
    color: '#64748b'
  },
  form: {
    textAlign: 'left'
  },
  formTitle: {
    fontSize: '16px',
    color: '#0f172a',
    margin: '0 0 15px 0',
    textAlign: 'center'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '12px'
  },
  label: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    marginBottom: '4px'
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    color: '#334155'
  },
  formActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  btnSave: {
    color: '#ffffff',
    flex: 2
  },
  btnCancel: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
    flex: 1
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8fafc'
  },
  errorText: {
    color: '#dc3545',
    fontWeight: '600'
  }
};

export default Profile;