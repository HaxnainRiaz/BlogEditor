import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="about-page">
            <div className="about-container">
                <header className="about-header">
                    <h1 className="about-title">
                        About Our{' '}
                        <span className="gradient-text">
                            Document Editor
                        </span>
                    </h1>
                    <p className="about-subtitle">
                        Learn more about our mission and features
                    </p>
                </header>
                <div className="about-content">
                    <section className="about-section">
                        <h2 className="section-title">Our Mission</h2>
                        <p className="section-text">
                            We believe that everyone should have access to powerful, easy-to-use document
                            editing tools. Our mission is to provide a seamless writing experience that
                            combines the familiarity of traditional word processors with the flexibility
                            of modern web applications.
                        </p>
                    </section>
                    <section className="about-section">
                        <h2 className="section-title">What We Offer</h2>
                        <div className="features-grid-about">
                            <div className="feature-item">
                                <h3 className="feature-item-title">
                                    <span className="feature-icon">🖊️</span>
                                    Rich Editing Experience
                                </h3>
                                <p className="feature-item-description">
                                    Full-featured text editor with formatting options, lists, tables, and media support.
                                </p>
                            </div>
                            <div className="feature-item">
                                <h3 className="feature-item-title">
                                    <span className="feature-icon">📑</span>
                                    Multi-Page Management
                                </h3>
                                <p className="feature-item-description">
                                    Organize your content across multiple pages with intuitive navigation.
                                </p>
                            </div>
                            <div className="feature-item">
                                <h3 className="feature-item-title">
                                    <span className="feature-icon">💾</span>
                                    Flexible Export
                                </h3>
                                <p className="feature-item-description">
                                    Export your work in multiple formats including HTML, Word, PDF, and plain text.
                                </p>
                            </div>
                            <div className="feature-item">
                                <h3 className="feature-item-title">
                                    <span className="feature-icon">🎨</span>
                                    Customizable Interface
                                </h3>
                                <p className="feature-item-description">
                                    Adjust the editor to match your workflow with customizable tools and layouts.
                                </p>
                            </div>
                            <div className="feature-item">
                                <h3 className="feature-item-title">
                                    <span className="feature-icon">📱</span>
                                    Responsive Design
                                </h3>
                                <p className="feature-item-description">
                                    Work seamlessly across all devices - desktop, tablet, and mobile.
                                </p>
                            </div>
                            <div className="feature-item">
                                <h3 className="feature-item-title">
                                    <span className="feature-icon">🔒</span>
                                    Privacy Focused
                                </h3>
                                <p className="feature-item-description">
                                    Your documents stay on your device - no cloud storage required unless you choose to save them.
                                </p>
                            </div>
                        </div>
                    </section>
                    <section className="about-section">
                        <h2 className="section-title">Technology Stack</h2>
                        <p className="section-text">
                            Built with modern web technologies including React, TipTap Editor, and CSS3.
                            We prioritize performance, accessibility, and user experience in every aspect
                            of our application.
                        </p>
                        <div className="tech-stack">
                            <span className="tech-badge blue-purple">React</span>
                            <span className="tech-badge green-teal">TipTap</span>
                            <span className="tech-badge orange-red">JavaScript</span>
                            <span className="tech-badge purple-pink">CSS3</span>
                            <span className="tech-badge indigo-blue">HTML5</span>
                        </div>
                    </section>
                    <section className="cta-section-about">
                        <h2 className="cta-title-about">Get Started</h2>
                        <p className="cta-text-about">
                            Ready to create your first document? Our editor is free to use and requires
                            no registration. Simply start typing and let your creativity flow.
                        </p>
                        <div className="cta-buttons-about">
                            <Link to="/login" className="btn-primary">Start Editing Now</Link>
                            <Link to="/contact" className="btn-secondary">Have Questions?</Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;