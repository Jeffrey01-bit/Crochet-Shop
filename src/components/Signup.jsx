import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import AlertWindow from './AlertWindow';
import './Auth.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });

            // Send email verification
            await sendEmailVerification(userCredential.user);

            // Immediately sign them out until they verify
            await signOut(auth);

            // Navigate them to login with a success message
            navigate('/login', { state: { message: 'Account created successfully! Please check your email to verify your account before logging in.' } });

        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists.');
            } else if (err.code === 'auth/api-key-not-valid-for-project' || err.code === 'auth/invalid-api-key') {
                setError('Firebase API keys missing or invalid in firebase.js config.');
            } else {
                setError('Failed to create an account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-section">
            <div className="auth-container">
                <div className="auth-header">
                    <h2>Create an Account</h2>
                    <p>Join us to track orders and save favorites.</p>
                </div>

                <AlertWindow message={error} type="error" onClose={() => setError('')} />

                <form onSubmit={handleSignup} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            autoComplete="name"
                            required
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
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
                            autoComplete="new-password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            required
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Log in here</Link></p>
                </div>
            </div>
        </section>
    );
};

export default Signup;
