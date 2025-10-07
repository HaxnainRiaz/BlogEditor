import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFaceAuth } from '../contexts/FaceAuthContext';
import FaceVerification from '../components/FaceVerification';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'face'
  
  const navigate = useNavigate();
  const { hasFaceData, isModelLoaded } = useFaceAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordLogin = (e) => {
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

  const handleFaceLogin = (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }

    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      toast.error('No account found. Please sign up first.');
      return;
    }

    const userData = JSON.parse(storedUserData);
    if (formData.email !== userData.email) {
      toast.error('No face data found for this email. Please use password login.');
      return;
    }

    if (!hasFaceData(formData.email)) {
      toast.error('No face data enrolled for this account. Please use password login.');
      return;
    }

    if (!isModelLoaded) {
      toast.error('Face recognition system is loading. Please wait or use password login.');
      return;
    }

    setShowFaceVerification(true);
  };

  const handleFaceVerificationSuccess = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    toast.success('Face verification successful! Redirecting...');
    setTimeout(() => navigate('/editor'), 1000);
  };

  const handleUsePasswordInstead = () => {
    setShowFaceVerification(false);
    setLoginMethod('password');
  };

  const canUseFaceLogin = formData.email && hasFaceData(formData.email) && isModelLoaded;

  return (
    <div className="auth-page">
      <ToastContainer />
      
      {showFaceVerification && (
        <FaceVerification
          email={formData.email}
          onSuccess={handleFaceVerificationSuccess}
          onCancel={() => setShowFaceVerification(false)}
          onUsePassword={handleUsePasswordInstead}
        />
      )}
      
      <div className="auth-container">
        <div className="auth-card">
          <header className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Sign in to your account to continue
            </p>
          </header>
          
          <form onSubmit={loginMethod === 'password' ? handlePasswordLogin : handleFaceLogin} className="auth-form">
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
              
              {loginMethod === 'password' && (
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
              )}
              
              <div className="login-method-toggle">
                <button
                  type="button"
                  className={`method-toggle-btn ${loginMethod === 'password' ? 'active' : ''}`}
                  onClick={() => setLoginMethod('password')}
                >
                  🔐 Password
                </button>
                <button
                  type="button"
                  className={`method-toggle-btn ${loginMethod === 'face' ? 'active' : ''} ${!canUseFaceLogin ? 'disabled' : ''}`}
                  onClick={() => canUseFaceLogin && setLoginMethod('face')}
                  disabled={!canUseFaceLogin}
                >
                  👤 Face {!canUseFaceLogin && '🔒'}
                </button>
              </div>
              
              {loginMethod === 'face' && !canUseFaceLogin && formData.email && (
                <div className="face-login-unavailable">
                  <p>Face login not available for this email.</p>
                  <p className="hint">You need to enroll your face first during signup.</p>
                </div>
              )}
              
              <div className="form-options">
                <label className="checkbox-label">
                  <input type="checkbox" className="checkbox-input" />
                  <span className="checkbox-text">Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>
              
              <button 
                type="submit" 
                className="auth-button"
                disabled={loginMethod === 'face' && !canUseFaceLogin}
              >
                {loginMethod === 'password' ? 'Sign In with Password' : 'Sign In with Face'}
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