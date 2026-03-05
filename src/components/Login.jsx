import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import AlertWindow from './AlertWindow';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [unverifiedUser, setUnverifiedUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            if (!userCredential.user.emailVerified) {
                setUnverifiedUser(userCredential.user);
                await signOut(auth);
                setError('Please verify your email address before logging in. Check your inbox (or spam folder) for the verification link.');
                return;
            }

            setUnverifiedUser(null);
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password. Please try again or sign up.');
            } else if (err.code === 'auth/api-key-not-valid-for-project' || err.code === 'auth/invalid-api-key') {
                setError('Firebase API keys missing or invalid in firebase.js config.');
            } else {
                setError('Failed to log in. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendEmail = async () => {
        if (!unverifiedUser) return;
        setResendLoading(true);
        setError('');

        try {
            await sendEmailVerification(unverifiedUser);
            setSuccessMessage('Verification email resent successfully! Please check your inbox and spam folder.');
            setResendTimer(60); // 60 second cooldown
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/too-many-requests') {
                setError('Too many requests. Please wait a moment before trying again.');
            } else {
                setError('Failed to resend verification email. Please try again later.');
            }
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <section className="auth-section">
            <div className="auth-container">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Enter your details to access your account.</p>
                </div>

                <AlertWindow message={successMessage} type="success" onClose={() => setSuccessMessage('')} />
                <AlertWindow message={error} type="error" onClose={() => setError('')} />

                {error && unverifiedUser && (
                    <div className="auth-error" style={{ background: 'transparent', border: 'none', padding: 0, marginTop: '-10px', boxShadow: 'none' }}>
                        <div style={{ marginTop: '0', borderTop: 'none', paddingTop: '0' }}>
                            <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                                Link expired or missing?
                            </p>
                            <button
                                onClick={handleResendEmail}
                                className="btn-primary"
                                disabled={resendLoading || resendTimer > 0}
                                style={{ width: '100%', padding: '0.5rem', fontSize: '0.9rem', backgroundColor: resendTimer > 0 ? '#ccc' : '', cursor: resendTimer > 0 ? 'not-allowed' : 'pointer' }}
                            >
                                {resendLoading ? 'Sending...' : resendTimer > 0 ? `Resend available in ${resendTimer}s` : 'Resend Verification Email'}
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            autoComplete="email"
                            required
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
                </div>
            </div>
        </section>
    );
};

export default Login;
