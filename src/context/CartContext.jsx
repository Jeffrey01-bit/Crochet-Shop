import React, { createContext, useState, useEffect, useContext } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        let unsubscribeCart = () => { };

        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                const cartRef = collection(db, 'users', user.uid, 'cart');
                unsubscribeCart();
                unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
                    const items = [];
                    let count = 0;
                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        items.push({ id: doc.id, ...data });
                        count += data.quantity;
                    });
                    setCartItems(items);
                    setCartCount(count);
                });
            } else {
                unsubscribeCart();
                setCartItems([]);
                setCartCount(0);
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeCart();
        };
    }, []);

    const isInCart = (productId) => {
        return cartItems.some(item => item.id === productId.toString());
    };

    return (
        <CartContext.Provider value={{ cartItems, cartCount, isInCart }}>
            {children}
        </CartContext.Provider>
    );
};
