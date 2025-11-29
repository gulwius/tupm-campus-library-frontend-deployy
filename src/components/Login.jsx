import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import campusBg from '../assets/tup-manila.jpeg'; 
import tupLogo from '../assets/Technological_University_of_the_Philippines_Seal.svg.png';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
        axios.post(`${API_URL}/books/api/login/`, {
            username: username,
            password: password
        })
        .then(res => {
            sessionStorage.setItem('user', JSON.stringify(res.data));
            navigate('/dashboard');
        })
        .catch(err => {
            setError("Invalid username or password. Please try again.");
        });
    };

    return (
        <div className="login-container">

            <div className="login-image-section" style={{
                backgroundImage: `linear-gradient(to bottom, rgba(139, 0, 0, 0.6), rgba(60, 0, 0, 0.8)), url(${campusBg})`
            }}>
                <div className="login-overlay-content">
                    <h1>Technological University of the Philippines</h1>
                    <p>Library Management System</p>
                </div>
            </div>

            <div className="login-form-section">
                <Link to="/" className="back-home-link">← Back to Home</Link>
                <div className="login-box">
                    <div className="login-header">
                        <img src={tupLogo} alt="Logo" className="login-logo" />
                        <h2>Welcome</h2>
                        <p>Please enter your details.</p>
                    </div>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Username</label>
                            <input 
                                type="text" 
                                placeholder="Enter your username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button type="submit" className="signin-btn">Sign in</button>
                    </form>
                    
                    <div className="auth-only-footer">
                        <span className="lock-icon">🔒</span> Authorized Personnel Only
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;