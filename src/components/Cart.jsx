import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        let unsubscribeCart = () => { };

        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                const cartRef = collection(db, 'users', user.uid, 'cart');
                unsubscribeCart(); // clean up previous listener if it exists
                unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
                    const items = [];
                    snapshot.forEach((doc) => {
                        items.push({ id: doc.id, ...doc.data() });
                    });
                    setCartItems(items);
                    setLoading(false);
                }, (error) => {
                    console.error("Firestore error: ", error);
                    setLoading(false);
                });
            } else {
                unsubscribeCart();
                setCartItems([]);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeCart();
        };
    }, []);

    const handleRemoveItem = async (itemId) => {
        if (!auth.currentUser) return;
        try {
            const itemRef = doc(db, 'users', auth.currentUser.uid, 'cart', itemId);
            await deleteDoc(itemRef);
        } catch (error) {
            console.error("Error removing item: ", error);
        }
    };

    const handleUpdateQuantity = async (itemId, currentQuantity, change) => {
        if (!auth.currentUser) return;
        const newQuantity = currentQuantity + change;
        if (newQuantity < 1) return; // Don't allow 0 quantity here, use remove instead

        try {
            const itemRef = doc(db, 'users', auth.currentUser.uid, 'cart', itemId);
            await updateDoc(itemRef, { quantity: newQuantity });
        } catch (error) {
            console.error("Error updating quantity: ", error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    if (loading) {
        return <div className="cart-page page-transition"><div className="container" style={{ paddingTop: '100px', textAlign: 'center' }}>Loading cart...</div></div>;
    }

    if (!auth.currentUser) {
        return (
            <div className="cart-page page-transition">
                <div className="container cart-empty-container">
                    <h2>Please Log In</h2>
                    <p>You must be signed in to view and save items to your cart.</p>
                    <a href="/login" className="btn-primary">Sign In</a>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page page-transition">
            <div className="container">
                <h1 className="page-title" style={{ marginTop: '40px', marginBottom: '30px' }}>Your Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="cart-empty-container glass-panel">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag" style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                        <h2>Your cart is empty</h2>
                        <p>Looks like you haven't added any beautiful handmade items yet.</p>
                        <a href="/shop" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>Continue Shopping</a>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items-section">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item glass-panel">
                                    <div className="cart-item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="cart-item-details">
                                        <h3>{item.name}</h3>
                                        <p className="cart-item-price">₹{item.price}</p>
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} disabled={item.quantity <= 1}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}>+</button>
                                        </div>
                                        <div className="cart-item-total">
                                            ₹{item.price * item.quantity}
                                        </div>
                                        <button className="remove-btn" onClick={() => handleRemoveItem(item.id)} aria-label="Remove item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary-section glass-panel">
                            <h2>Order Summary</h2>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{calculateTotal()}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>Calculated at checkout</span>
                            </div>
                            <hr className="summary-divider" />
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{calculateTotal()}</span>
                            </div>
                            <button className="btn-primary checkout-btn" style={{ width: '100%', marginTop: '20px' }}>Proceed to Checkout</button>
                            <a href="/shop" className="continue-shopping">Continue Shopping</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
