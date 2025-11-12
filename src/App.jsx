import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Editor from './components/Editor';
import TermsPage from './pages/TermsPage';
import BlogPage from './pages/BlogPage';
import PrivacyPage from './pages/PrivacyPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import './styles/website.css';

// Simple session hook using cookie-based auth
const useSession = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    let active = true;
    const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:4025';

    const fetchSession = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiBase}/api/auth/me`, { credentials: 'include' });
        if (!res.ok) {
          if (!active) return;
          setUser(null);
          return;
        }
        const data = await res.json();
        if (!active) return;
        setUser(data.user);
      } catch (error) {
        console.error('Failed to fetch session', error);
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchSession();

    const handleRefresh = () => {
      if (!active) return;
      fetchSession();
    };

    window.addEventListener('auth:refresh', handleRefresh);

    return () => {
      active = false;
      window.removeEventListener('auth:refresh', handleRefresh);
    };
  }, []);
  return { loading, user };
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { loading, user } = useSession();
  if (loading) return null; // or a loader component
  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to editor if already logged in)
const PublicRoute = ({ children }) => {
  const { loading, user } = useSession();
  if (loading) return null; // or a loader component
  return !user ? children : <Navigate to="/editor" />;
};

function App() {
  const { loading, user } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const apiBase = process.env.REACT_APP_API_URL || 'http://localhost:4025';
    try {
      await fetch(`${apiBase}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } finally {
      window.location.href = '/';
    }
  };

  return (
    <div className="website-page">
      <nav className="nav-fixed">
        <div className="nav-container">
          <div className="nav-glass">
            <button
              className="nav-toggle"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen(v => !v)}
            >
              ☰
            </button>
            <div className={`nav-links ${mobileOpen ? 'is-open' : ''}`}>
              <Link to="/" className="nav-link" onClick={() => setMobileOpen(false)}>Home</Link>
              <Link to="/about" className="nav-link" onClick={() => setMobileOpen(false)}>About</Link>
              <Link to="/blog" className="nav-link" onClick={() => setMobileOpen(false)}>Blog</Link>
              <Link to="/contact" className="nav-link" onClick={() => setMobileOpen(false)}>Contact</Link>
              {user ? (
                <>
                  <Link to="/editor" className="nav-link" onClick={() => setMobileOpen(false)}>Editor</Link>
                  <div className="nav-user-section">
                    <span className="nav-welcome">
                      Welcome, {user.username || user.email || 'User'}!
                    </span>
                    <button 
                      onClick={() => { setMobileOpen(false); handleLogout(); }}
                      className="nav-logout-btn"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/signup" className="nav-link" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="page-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          
          {/* Auth Routes (only accessible when logged out) */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes (only accessible when logged in) */}
          <Route 
            path="/editor" 
            element={
              <ProtectedRoute>
                <Editor />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;