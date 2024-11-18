 
import React, {useState} from 'react';
import './FirstScreen.css';
import { useNavigate } from 'react-router-dom';

function FirstScreen() {
  const navigate = useNavigate();

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };
  const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (response.status === 200) {
                localStorage.setItem('token', data.token);  // Save token to local storage
                alert('Login successful');
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

  
  return (
    <form onSubmit={handleLogin}>
    <div className="login-container">
      <header className="app-header">
        <h1>Company Name</h1>
      </header>
      <main className="login-form">
      <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
        <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
        <div className="actions">
          <button type="submit">LOGIN</button>
          <button type="button" onClick={() => navigate('/create-account')}>CREATE ACCOUNT</button>
        </div>
        <div className="links">
          <span className="forgot-password" onClick={handleForgotPassword}>Forgot password?</span>
        </div>
      </main>
    </div>
    </form>
  );
}

export default FirstScreen;
