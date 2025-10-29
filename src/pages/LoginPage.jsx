import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    const storedUserData = localStorage.getItem('userData');
    
    if (!storedUserData) {
      toast.error('No account found. Please sign up first.');
      return;
    }

    const userData = JSON.parse(storedUserData);
    
    if (formData.email === userData.email && formData.password === userData.password) {
      toast.success('Login successful! Redirecting...');
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      setTimeout(() => navigate('/editor'), 2000);
    } else {
      toast.error('Invalid email or password!');
    }
  };

  return (
    <div className="auth-page">
      <ToastContainer />
      
      <div className="auth-container">
        <div className="auth-card">
          <header className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Sign in to your account to continue
            </p>
          </header>
          
          <form onSubmit={handleLogin} className="auth-form">
            <div className="form-fields">
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
                  placeholder="Enter your password" 
                  className="form-input" 
                />
              </div>
              
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox-input" />
                  <span className="checkbox-text">Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
              
              <button type="submit" className="auth-button">
                Sign In
              </button>
            </div>
          </form>
          
          <div className="auth-divider">
            <span className="divider-text">Or continue with</span>
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
              Don't have an account?{' '}
              <Link to="/signup" className="footer-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;