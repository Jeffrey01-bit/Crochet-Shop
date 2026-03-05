import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const Orders = () => {
    const navigate = useNavigate();
    const user = auth.currentUser;

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    if (!user) return null;

    return (
        <section className="section-padding" style={{ minHeight: 'calc(100vh - 80px)', background: 'var(--bg-primary)', paddingTop: '120px' }}>
            <div className="container glass-panel" style={{ padding: '3rem' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '10px', color: 'var(--text-primary)' }}>My Orders</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>View and track your previous handcrafted purchases.</p>

                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#faf8f5', borderRadius: 'var(--border-radius-main)', border: '1px dashed rgba(0,0,0,0.1)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1.5" style={{ opacity: 0.5, marginBottom: '20px' }}>
                        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', marginBottom: '8px', color: 'var(--text-primary)' }}>No Orders Yet</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>You haven't placed any orders yet. Start exploring the shop!</p>
                </div>
            </div>
        </section>
    );
};

export default Orders;
