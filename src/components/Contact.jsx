import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import './Contact.css';

const Contact = () => {
    const form = useRef();
    const [status, setStatus] = useState('');

    const sendEmail = (e) => {
        e.preventDefault();
        setStatus('sending');

        // Note: Missing Template ID and Public API Key from user
        emailjs
            .sendForm(
                'service_9umcsq9', // User provided Service ID
                'YOUR_TEMPLATE_ID', // TODO: Get Template ID from user
                form.current,
                { publicKey: 'YOUR_PUBLIC_KEY' } // TODO: Get Public Key from user
            )
            .then(
                () => {
                    setStatus('success');
                    form.current.reset();
                    setTimeout(() => setStatus(''), 5000);
                },
                (error) => {
                    setStatus('error');
                    console.log('FAILED...', error.text);
                }
            );
    };

    return (
        <section className="contact-section" id="contact">
            <div className="container contact-container">
                <div className="contact-info">
                    <h2 className="section-title" style={{ textAlign: 'left' }}>Get in Touch.</h2>
                    <p className="contact-description">
                        Have a question about a custom order, sizing, or just want to say hello?
                        We'd love to hear from you. Fill out the form, and we'll get back to you as soon as possible.
                    </p>
                    <div className="contact-methods">
                        <div className="contact-method">
                            <div className="method-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            </div>
                            <div>
                                <h4>Email Us</h4>
                                <p>augustinecrochet@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-form-wrapper glass-panel">
                    <form ref={form} onSubmit={sendEmail} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="user_name">Name</label>
                            <input type="text" name="user_name" id="user_name" required placeholder="Your name" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="user_email">Email</label>
                            <input type="email" name="user_email" id="user_email" required placeholder="your.email@example.com" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea name="message" id="message" rows="5" required placeholder="How can we help you?"></textarea>
                        </div>
                        <button type="submit" className="btn-primary submit-btn" disabled={status === 'sending'}>
                            {status === 'sending' ? 'Sending...' : 'Send Message'}
                        </button>

                        {status === 'success' && (
                            <div className="form-status success">
                                Message sent successfully! We will get back to you soon.
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="form-status error">
                                Failed to send message. Please ensure API keys are configured correctly or email augustinecrochet@gmail.com directly.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;
