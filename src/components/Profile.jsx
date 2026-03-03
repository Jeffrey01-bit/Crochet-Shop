import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import './Auth.css'; // Reusing auth styles for consistency

const Profile = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    // Ensure user is loaded
    const user = auth.currentUser;

    useEffect(() => {
        // Redirect to login if not authenticated
        if (!user) {
            navigate('/login');
            return;
        }

        // Initialize form with current display name
        if (user.displayName) {
            setName(user.displayName);
        }
    }, [user, navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await updateProfile(user, { displayName: name });
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null; // Prevent flash before redirect

    return (
        <section className="auth-section">
            <div className="auth-container glass-panel">
                <div className="auth-header">
                    <h2>Edit Profile</h2>
                    <p>Manage your account details below.</p>
                </div>

                {message.text && (
                    <div className={message.type === 'success' ? 'auth-status success' : 'auth-error'}>
                        {message.text}
                    </div>
                )}

                <div className="profile-info" style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.5)', borderRadius: '8px' }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Address:</p>
                    <p style={{ margin: 0, fontWeight: 500, color: 'var(--text-primary)' }}>{user.email}</p>
                    {user.emailVerified ? (
                        <span style={{ fontSize: '0.8rem', color: '#2e7d32', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '0.5rem' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                            Verified
                        </span>
                    ) : (
                        <span style={{ fontSize: '0.8rem', color: '#d32f2f', display: 'inline-block', marginTop: '0.5rem' }}>
                            Unverified
                        </span>
                    )}
                </div>

                <form onSubmit={handleUpdateProfile} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Display Name</label>
                        <input
                            type="text"
                            id="name"
                            required
                            placeholder="Your Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary auth-submit" disabled={loading || name === user.displayName}>
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Profile;
