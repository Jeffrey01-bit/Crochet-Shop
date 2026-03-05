import React, { useEffect, useState } from 'react';
import './AlertWindow.css';

const AlertWindow = ({ message, type = 'error', onClose, duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);

            if (duration > 0) {
                const timer = setTimeout(() => {
                    handleClose();
                }, duration);
                return () => clearTimeout(timer);
            }
        } else {
            setIsVisible(false);
        }
    }, [message, duration]);

    const handleClose = () => {
        setIsVisible(false);
        if (onClose) {
            setTimeout(onClose, 300); // Allow fade out animation to finish before removing from DOM
        }
    };

    if (!message && !isVisible) return null;

    return (
        <div className={`alert-window-overlay ${isVisible ? 'visible' : ''}`}>
            <div className={`alert-window ${type}`}>
                <div className="alert-content">
                    {type === 'error' && (
                        <svg className="alert-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                    )}
                    {type === 'success' && (
                        <svg className="alert-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    )}
                    <span className="alert-text">{message}</span>
                </div>
                <button type="button" className="alert-close-btn" onClick={handleClose} aria-label="Close alert">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
    );
};

export default AlertWindow;
