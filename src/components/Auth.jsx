import { useState } from 'react';

const Auth = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [username, setUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting login with:", { loginEmail, loginPassword });

    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ loginEmail, loginPassword }),
        });

        const data = await response.json();
        console.log("Server login response:", data);
        
        alert(data.message);

        if (data.success) {
            // Sauvegarde des données utilisateur dans le localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Notification au composant App.jsx du succès de la connexion
            onLoginSuccess();
        }

    } catch (error) {
        console.error("Login connection error:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    console.log("Attempting user registration with:", { username, registerEmail, registerPassword, role });

    const userData = {
        fullName: username,      
        email: registerEmail,     
        password: registerPassword, 
        role: role
    };

    try {
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        
        console.log("Server response:", data);
        alert(data.message); 

    } catch (error) {
        console.error("Connection error:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.authBox}>
        
        {/* ----------------- SIGN IN ----------------- */}
        <div style={{ ...styles.formContainer, ...styles.signInContainer, opacity: isSignUp ? 0 : 1, zIndex: isSignUp ? 1 : 2 }}>
          <form onSubmit={handleLoginSubmit} style={styles.form}>
            <h1 style={styles.title}>Sign In</h1>
            <p style={styles.subtitle}>Campus Event Hub - ENSET</p>
            <input 
              type="email" 
              placeholder="Email" 
              value={loginEmail} 
              onChange={(e) => setLoginEmail(e.target.value)} 
              style={styles.input} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={loginPassword} 
              onChange={(e) => setLoginPassword(e.target.value)} 
              style={styles.input} 
              required 
            />
            <button type="submit" style={styles.button}>Sign In</button>
          </form>
        </div>

        {/* ----------------- SIGN UP ----------------- */}
        <div style={{ ...styles.formContainer, ...styles.signUpContainer, opacity: isSignUp ? 1 : 0, zIndex: isSignUp ? 2 : 1 }}>
          <form onSubmit={handleRegister} style={styles.form}>
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>Join your campus community</p>
            <input 
              type="text" 
              placeholder="Full Name" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={styles.input} 
              required 
            />
            <input 
              type="email" 
              placeholder="University Email" 
              value={registerEmail} 
              onChange={(e) => setRegisterEmail(e.target.value)} 
              style={styles.input} 
              required 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={registerPassword} 
              onChange={(e) => setRegisterPassword(e.target.value)} 
              style={styles.input} 
              required 
            />
            <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
              <option value="student">Student</option>
              <option value="organizer">Organizer</option>
            </select>
            <button type="submit" style={styles.button}>Sign Up</button>
          </form>
        </div>

        {/* ----------------- OVERLAY---------------- */}
        <div style={{
          ...styles.overlayContainer,
          transform: isSignUp ? 'translateX(-100%)' : 'translateX(0%)',
        }}>
          <div style={styles.overlay}>
            { !isSignUp ? (
              <div style={styles.overlayPanel}>
                <h1 style={styles.overlayTitle}>Welcome Back!</h1>
                <p style={styles.overlayText}>To keep connected with us please login with your ENSET account</p>
                <button style={styles.ghostButton} onClick={() => setIsSignUp(true)}>SIGN UP</button>
              </div>
            ) : (
              <div style={styles.overlayPanel}>
                <h1 style={styles.overlayTitle}>Hello Student!</h1>
                <p style={styles.overlayText}>Enter your personal details and start your journey in campus events</p>
                <button style={styles.ghostButton} onClick={() => setIsSignUp(false)}>SIGN IN</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f0f2f5',
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box'
  },
  authBox: {
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: '0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.1)',
    position: 'relative',
    width: '850px',
    maxWidth: '100%',
    minHeight: '520px',
    overflow: 'hidden',
    display: 'flex'
  },
  formContainer: {
    position: 'absolute',
    top: 0,
    height: '100%',
    transition: 'all 0.6s ease-in-out',
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    boxSizing: 'border-box'
  },
  signInContainer: {
    left: 0,
    width: '50%'
  },
  signUpContainer: {
    left: 0,
    width: '50%',
    transform: 'translateX(100%)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    padding: '0 45px',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    boxSizing: 'border-box'
  },
  title: {
    fontWeight: '700',
    fontSize: '28px',
    margin: '0',
    color: '#1a1a1a',
    lineHeight: '1.2'
  },
  subtitle: {
    fontSize: '13px',
    color: '#777',
    marginTop: '5px',
    marginBottom: '20px'
  },
  input: {
    backgroundColor: '#f4f6f9',
    border: '1px solid #e1e5eb',
    padding: '12px 15px',
    margin: '7px 0',
    width: '100%',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  select: {
    backgroundColor: '#f4f6f9',
    border: '1px solid #e1e5eb',
    padding: '12px 15px',
    margin: '7px 0',
    width: '100%',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  button: {
    borderRadius: '25px',
    border: 'none',
    backgroundColor: '#0056b3', // Bleu ENSET
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '13px 50px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.2s ease',
    boxShadow: '0 4px 6px rgba(0,86,179,0.2)'
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: '50%',
    height: '100%',
    overflow: 'hidden',
    transition: 'transform 0.6s ease-in-out',
    zIndex: 100
  },
  overlay: {
    background: 'linear-gradient(135deg, #0056b3, #003d82)', // Gradient bleu ENSET
    color: '#ffffff',
    position: 'relative',
    left: '-100%',
    height: '100%',
    width: '200%',
    transform: 'translateX(0)',
    transition: 'transform 0.6s ease-in-out'
  },
  overlayPanel: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '0 40px',
    textAlign: 'center',
    top: 0,
    right: 0,
    height: '100%',
    width: '50%',
    boxSizing: 'border-box'
  },
  overlayTitle: {
    fontWeight: '700',
    fontSize: '28px',
    color: '#fff',
    margin: '0 0 15px 0'
  },
  overlayText: {
    fontSize: '14px',
    fontWeight: '300',
    lineHeight: '22px',
    margin: '0 0 30px 0',
    color: '#e6f0fa'
  },
  ghostButton: {
    borderRadius: '25px',
    border: '2px solid #ffffff',
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '11px 45px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

export default Auth;