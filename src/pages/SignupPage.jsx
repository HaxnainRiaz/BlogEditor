import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });  
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };
    
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        if (!formData.agreeTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }

        if (formData.password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }

        try {
            const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:4025';
            const res = await fetch(`${apiBase}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    username: formData.fullName,
                    email: formData.email,
                    password: formData.password
                })
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || 'Signup failed');
            }
            toast.success('Account created successfully! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="auth-page">
            <ToastContainer />          
            <div className="auth-container">
                <div className="auth-card">
                    <header className="auth-header">
                        <h1 className="auth-title">
                            Create Account
                        </h1>
                        <p className="auth-subtitle">
                            Join us and start creating amazing documents
                        </p>
                    </header>

                    <form onSubmit={handleFormSubmit} className="auth-form">
                        <div className="form-fields">
                            <div className="form-group">
                                <label htmlFor="fullName" className="form-label">
                                    Full Name
                                </label>
                                <input 
                                    type="text" 
                                    id="fullName" 
                                    name="fullName" 
                                    value={formData.fullName} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Enter your full name" 
                                    className="form-input" 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Enter your email address" 
                                    className="form-input" 
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="form-label">
                                    Password
                                </label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Create a password" 
                                    className="form-input" 
                                />
                                <p className="password-hint">
                                    Must be at least 8 characters with numbers and symbols
                                </p>
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm Password
                                </label>
                                <input 
                                    type="password" 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    value={formData.confirmPassword} 
                                    onChange={handleChange} 
                                    required 
                                    placeholder="Confirm your password" 
                                    className="form-input" 
                                />
                            </div>

                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="agreeTerms"
                                        checked={formData.agreeTerms}
                                        onChange={handleChange}
                                        className="checkbox-input"
                                    />
                                    <span className="checkbox-text">
                                        I agree to the{' '}
                                        <Link to="/terms" className="terms-link">
                                            Terms of Service
                                        </Link>{' '}
                                        and{' '}
                                        <Link to="/privacy" className="terms-link">
                                            Privacy Policy
                                        </Link>
                                    </span>
                                </label>
                            </div>
                            
                            <button type="submit" className="auth-button">
                                Create Account
                            </button>
                        </div>
                    </form>

                    <div className="auth-divider">
                        <span className="divider-text">Or sign up with</span>
                    </div>

                    <div className="social-buttons">
                        <button type="button" className="social-button google-button">
                            <span className="social-icon">🔍</span>
                            Google
                        </button>
                        <button type="button" className="social-button github-button">
                            <span className="social-icon">💻</span>
                            GitHub
                        </button>
                    </div>

                    <div className="auth-footer">
                        <p className="footer-text">
                            Already have an account?{' '}
                            <Link to="/login" className="footer-link">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;