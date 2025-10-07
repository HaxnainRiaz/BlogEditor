import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <header className="about-header">
          <h1 className="about-title">Privacy Policy</h1>
          <p className="about-subtitle">How we handle your information.</p>
        </header>
        <div className="about-content">
          <section className="about-section">
            <h2 className="section-title">Local Storage</h2>
            <p className="section-text">User details and optional face embeddings are stored in your browser's localStorage.</p>
          </section>
          <section className="about-section">
            <h2 className="section-title">Camera Access</h2>
            <p className="section-text">Camera is used only during enrollment and verification and never sent to a server.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;


