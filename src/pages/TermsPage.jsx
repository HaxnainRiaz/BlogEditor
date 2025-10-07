import React from 'react';

const TermsPage = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <header className="about-header">
          <h1 className="about-title">Terms of Service</h1>
          <p className="about-subtitle">Please review the terms governing your use of the app.</p>
        </header>
        <div className="about-content">
          <section className="about-section">
            <h2 className="section-title">Use of Service</h2>
            <p className="section-text">This app is provided as-is for personal use. Do not misuse the service.</p>
          </section>
          <section className="about-section">
            <h2 className="section-title">Privacy & Data</h2>
            <p className="section-text">No server storage is used; data like authentication is stored locally in your browser.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;


