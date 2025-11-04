import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="home-page">
            <div className="home-container">
                <header className="home-header">
                    <h1 className='home-title'>
                        Welcome to Our{' '}
                        <span className="gradient-text" >
                            Document Editor
                        </span>
                    </h1>
                    <p className="home-subtitle">
                        Create, edit, and manage your documents with ease using
                    </p>
                </header>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <div className="icon-blue-purple">
                                📝
                            </div>
                        </div>
                        <h3 className='feature-title'>Rich Text Editor</h3>
                        <p className="feature-description">
                            Powerful WYSIWYG editor with formatting tools, tables, images, and more.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <div className="icon-green-teal">
                                📑
                            </div>
                        </div>
                        <h3 className='feature-title'>Multi-Page Support</h3>
                        <p className="feature-description">
                            Create and manage multiple pages in a single document with easy navigation.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <div className="icon-orange-red">
                                💾
                            </div>
                        </div>
                        <h3 className='feature-title'>Export Options</h3>
                        <p className="feature-description">
                            Export your documents as HTML, Word, PDF, or plain text formats.
                        </p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <div className="icon-purple-pink">
                                🎨
                            </div>
                        </div>
                        <h3 className='feature-title'>Customizable</h3>
                        <p className="feature-description">
                            Adjust fonts, colors, spacing, and layout to match your preferences.
                        </p>
                    </div>
                </div>
                <div className="cta-section">
                    <h2 className="cta-title">
                        Ready to Get Started...
                    </h2>
                    <p className="cta-subtitle">
                        Jump right into creating your first document or learn more about our features.
                    </p>
                    <div className="cta-buttons">
                        <Link to="/login" className="btn-primary">
                            Start Editing
                        </Link>
                        <Link to="/about" className="btn-secondary">
                            Learn More
                        </Link>
                    </div>
                </div>
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-number green-teal-gradient">10K+</div>
                        <div className="stat-label">Documents Created</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number blue-purple-gradient">5K+</div>
                        <div className="stat-label">Active Users</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-number orange-red-gradient">99%</div>
                        <div className="stat-label">Satisfaction Rate</div>
                    </div>
                </div>
                <div className="additional-features">
                    <div className="feature-highlight">
                        <h3 className="highlight-title">
                            <span className="highlight-icon">🚀</span>
                            Lightning Fast
                        </h3>
                        <p className="highlight-description">
                            Experience blazing-fast performance with our optimized editor that loads instantly and responds without delay.
                        </p>
                    </div>
                    <div className="feature-highlight">
                        <h3 className="highlight-title">
                            <span className="highlight-icon">🔒</span>
                            Privacy First
                        </h3>
                        <p className="highlight-description">
                            Your documents stay private and secure. We don't store your data on our servers - everything happens locally.
                        </p>
                    </div>
                </div>
                <div className="footer-note">
                    <p className="footer-text">
                        No registration required • Free forever • Works offline
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;