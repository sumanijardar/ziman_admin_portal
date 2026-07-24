import React from 'react';
import { Link } from 'react-router-dom';
import './Auth.css';

const Signup = () => {
    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="text-center">
                    <Link to="/" style={{ textDecoration: 'none' }}> 
                        <img src={`${import.meta.env.BASE_URL}images/ziman.jpeg`} alt="Ziman Admin" style={{ maxWidth: '150px' }} className="mb-4" />
                    </Link>
                </div>
                
                <form className="mt-4">
                    <div className="form-group mb-3">
                        <input type="text" className="form-control auth-input" placeholder="Full Name" required />
                    </div>
                    <div className="form-group mb-3">
                        <input type="email" className="form-control auth-input" placeholder="Email Address" required />
                    </div>
                    <div className="form-group mb-4">
                        <input type="password" className="form-control auth-input" placeholder="Password" required />
                    </div>
                    <button type="submit" className="btn w-100 auth-btn mt-2">Sign Up</button>
                </form>
                
                <p className="text-center auth-footer-text">
                    Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
