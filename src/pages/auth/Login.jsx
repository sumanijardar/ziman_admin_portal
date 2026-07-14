import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';
import './Auth.css'; // Import our new premium styles

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);
            
            const response = await api.post('/login/processLogin/', formData);
            
            const resData = response.data;
            if (resData && resData.status === 'success' && resData.code === 200) {
                const sessionData = resData.data;
                if (sessionData && sessionData.session_id) {
                    localStorage.setItem('token', sessionData.session_id);
                    localStorage.setItem('session_id', sessionData.session_id);
                    localStorage.setItem('user_id', sessionData.user_id);
                    localStorage.setItem('user_name', sessionData.user_name);
                    localStorage.setItem('user_type', sessionData.user_type);
                    localStorage.setItem('login_timestamp', Date.now());
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Login Successful',
                        text: 'Welcome back!',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        navigate('/');
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Invalid response format from server.',
                        confirmButtonColor: '#d33'
                    });
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: resData?.message || 'Invalid username or password.',
                    confirmButtonColor: '#d33'
                });
            }
        } catch (err) {
            console.error("API Error caught:", err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.message || 'Something went wrong. Please try again.',
                confirmButtonColor: '#d33'
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="auth-container">
            <div className="auth-card">
                <Link to="" style={{ textDecoration: 'none' }}>
                    <h4 className="auth-title">Ziman Admin</h4>
                </Link>

                <form className="mt-4" onSubmit={handleLogin}>

                    <div className="form-group mb-4">
                        <input
                            type="text"
                            className="form-control auth-input"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-4">
                        <input
                            type="password"
                            className="form-control auth-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn w-100 auth-btn mt-3" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                {/* <p className="text-center auth-footer-text">
                    Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link>
                </p> */}
            </div>
        </div>
    );
};

export default Login;
