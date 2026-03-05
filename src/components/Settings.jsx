import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { updateProfile, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import AlertWindow from './AlertWindow';
import './Settings.css';

const Settings = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search);
    const initialTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(initialTab);

    // Watch for URL changes when clicking links externally (e.g., from Navbar)
    useEffect(() => {
        const tab = new URLSearchParams(location.search).get('tab');
        if (tab && ['profile', 'account'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/settings?tab=${tab}`, { replace: true });
    };

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const user = auth.currentUser;

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
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

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    if (!user) return null;

    return (
        <section className="settings-section section-padding">
            <div className="container settings-container glass-panel">
                <div className="settings-sidebar">
                    <h3>Settings</h3>
                    <ul className="settings-nav">
                        <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => handleTabChange('profile')}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            Profile details
                        </li>
                        <li className={activeTab === 'account' ? 'active' : ''} onClick={() => handleTabChange('account')}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                            Account Security
                        </li>
                        <li className="logout-btn" onClick={handleLogout}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                            Logout
                        </li>
                    </ul>
                </div>

                <div className="settings-content">
                    {activeTab === 'profile' && (
                        <div className="settings-pane fade-in">
                            <h2>Edit Profile</h2>
                            <p className="pane-subtitle">Manage your account details and public persona.</p>

                            <AlertWindow
                                message={message.text}
                                type={message.type || 'success'}
                                onClose={() => setMessage({ type: '', text: '' })}
                            />

                            <div className="profile-info-box">
                                <div className="info-row">
                                    <span className="info-label">Email Address:</span>
                                    <span className="info-value">{user.email}</span>
                                </div>
                                <div className="info-row">
                                    <span className="info-label">Status:</span>
                                    {user.emailVerified ? (
                                        <span className="status-badge verified">Verified</span>
                                    ) : (
                                        <span className="status-badge unverified">Unverified</span>
                                    )}
                                </div>
                            </div>

                            <form onSubmit={handleUpdateProfile} className="settings-form">
                                <div className="form-group">
                                    <label htmlFor="name">Display Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        placeholder="Your Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="settings-input"
                                    />
                                </div>

                                <button type="submit" className="btn-primary settings-submit" disabled={loading || name === user.displayName}>
                                    {loading ? 'Updating...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="settings-pane fade-in">
                            <h2>Account Security</h2>
                            <p className="pane-subtitle">Update your password and manage account security.</p>

                            <div className="empty-state-box">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                <h4>Security Options</h4>
                                <p>Password resetting and 2FA options will be available soon.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Settings;
