import React, { useState } from 'react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                <header className="contact-header">
                    <h1 className="contact-title">
                        Contact Us
                    </h1>
                    <p className="contact-subtitle">
                        Get in touch with any questions or feedback
                    </p>
                </header>
                <div className="contact-layout">
                    <div className="contact-info">
                        <div className="info-card">
                            <h2 className="info-title">
                                We'd Love to Hear From You
                            </h2>
                            <p className="info-description">
                                Whether you have questions about our document editor, need technical support,
                                or want to provide feedback, we're here to help.
                            </p>
                            <div className="contact-details">
                                <div className="contact-detail">
                                    <div className="detail-icon">📧</div>
                                    <div>
                                        <h3 className="detail-title">Email Us</h3>
                                        <p className="detail-text">support@documenteditor.com</p>
                                    </div>
                                </div>
                                <div className="contact-detail">
                                    <div className="detail-icon">🕒</div>
                                    <div>
                                        <h3 className="detail-title">Response Time</h3>
                                        <p className="detail-text">Typically within 24 hours</p>
                                    </div>
                                </div>
                                <div className="contact-detail">
                                    <div className="detail-icon">💬</div>
                                    <div>
                                        <h3 className="detail-title">Feedback</h3>
                                        <p className="detail-text">We value your suggestions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-fields">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    Full Name *
                                </label>
                                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your full name"
                                    className="form-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email Address *
                                </label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email address"
                                    className="form-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject" className="form-label">
                                    Subject *
                                </label>
                                <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required placeholder="What is this regarding?"
                                    className="form-input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message" className="form-label">
                                    Message *
                                </label>
                                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows="6" placeholder="Tell us more about your inquiry..."
                                    className="form-textarea">
                                </textarea>
                            </div>
                            <button type="submit" className="submit-button">
                                Send Message
                            </button>
                        </div>
                    </form>
                </div>
                <div className="faq-section">
                    <h2 className="faq-title">
                        Frequently Asked Questions
                    </h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3 className="faq-question">
                                Is the document editor free to use?
                            </h3>
                            <p className="faq-answer">
                                Yes, our document editor is completely free to use with no hidden costs or limitations.
                            </p>
                        </div>
                        <div className="faq-item">
                            <h3 className="faq-question">
                                Where are my documents stored?
                            </h3>
                            <p className="faq-answer">
                                Your documents are stored locally in your browser's storage. For cloud storage, you can export and save them to your preferred cloud service.
                            </p>
                        </div>
                        <div className="faq-item">
                            <h3 className="faq-question">
                                Can I use this on mobile devices?
                            </h3>
                            <p className="faq-answer">
                                Absolutely! Our editor is fully responsive and works great on desktop, tablet, and mobile devices.
                            </p>
                        </div>
                        <div className="faq-item">
                            <h3 className="faq-question">
                                What file formats can I export to?
                            </h3>
                            <p className="faq-answer">
                                You can export your documents as HTML, Microsoft Word (.doc), PDF, and plain text files.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;