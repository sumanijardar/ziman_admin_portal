import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Logout = () => {
    useEffect(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('session_id');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_type');
    }, []);

    return (
        <div className="auth-container">
            <div className="auth-card text-center pb-5">
                <Link to="/" style={{ textDecoration: 'none' }}> 
                    <img src={`${import.meta.env.BASE_URL}images/ziman.jpeg`} alt="Ziman Admin" style={{ maxWidth: '150px' }} className="mb-4" />
                </Link>
                
                <div className="mt-4 mb-4">
                    <h5 className="mb-4 text-dark font-weight-bold">You have been successfully logged out.</h5>
                    <p className="text-muted mb-5">Thank you for using Ziman Admin. Have a great day!</p>
                    
                    <Link to="/login" className="btn w-100 auth-btn">
                        Return to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Logout;
