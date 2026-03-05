import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product, showActions = false }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [isManual, setIsManual] = useState(false);
    const [addStatus, setAddStatus] = useState('idle'); // 'idle' | 'loading' | 'added'
    const { isInCart } = useCart();

    const isProductInCart = isInCart(product.id);

    useEffect(() => {
        let interval;
        if (isHovering && !isManual && product.images && product.images.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) =>
                    (prevIndex + 1) % product.images.length
                );
            }, 1500); // Change image every 1.5 seconds
        } else if (!isHovering) {
            setCurrentImageIndex(0); // Reset to first image when not hovering
            setIsManual(false); // Reset manual override
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isHovering, isManual, product.images]);

    const handleNextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!product.images || product.images.length <= 1) return;
        setIsManual(true);
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    };

    const handlePrevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!product.images || product.images.length <= 1) return;
        setIsManual(true);
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    };

    const handleDotClick = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        setIsManual(true);
        setCurrentImageIndex(index);
    };

    const displayImage = product.images && product.images.length > 0
        ? product.images[currentImageIndex]
        : product.image;

    const navigate = useNavigate();

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!auth.currentUser) {
            alert('Please sign in to add items to your cart.');
            navigate('/login');
            return;
        }

        if (addStatus === 'loading' || addStatus === 'added') return;
        setAddStatus('loading');

        try {
            const itemRef = doc(db, 'users', auth.currentUser.uid, 'cart', product.id.toString());
            const docSnap = await getDoc(itemRef);

            if (docSnap.exists()) {
                await updateDoc(itemRef, {
                    quantity: docSnap.data().quantity + 1
                });
            } else {
                await setDoc(itemRef, {
                    name: product.name,
                    price: product.price,
                    image: product.image || (product.images && product.images.length > 0 ? product.images[0] : ''),
                    quantity: 1
                });
            }

            setAddStatus('added');
            setTimeout(() => {
                setAddStatus('idle');
            }, 2000);

        } catch (error) {
            console.error("Error adding to cart: ", error);
            setAddStatus('idle');
            alert("Error adding item: " + error.message);
        }
    };

    return (
        <Link to={`/product/${product.id}`} className="product-card-link">
            <div
                className="product-card glass-panel"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <div className="product-image-container">
                    {displayImage ? (
                        <>
                            <img src={displayImage} alt={product.name} className="product-image" />
                            {isHovering && product.images && product.images.length > 1 && (
                                <>
                                    <div className="image-slider-controls">
                                        <button className="slider-btn prev-btn" onClick={handlePrevImage}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                        </button>
                                        <button className="slider-btn next-btn" onClick={handleNextImage}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                        </button>
                                    </div>
                                    <div className="image-slider-dots">
                                        {product.images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                className={`slider-dot ${idx === currentImageIndex ? 'active' : ''}`}
                                                onClick={(e) => handleDotClick(e, idx)}
                                                aria-label={`Go to slide ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="product-image-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><path d="M7 7h.01"></path></svg>
                        </div>
                    )}

                    {showActions && (
                        <div className="product-hover-actions">
                            <button
                                className={`quick-add-btn ${addStatus}`}
                                onClick={handleAddToCart}
                                disabled={isProductInCart || addStatus !== 'idle'}
                            >
                                {isProductInCart ? 'In Cart' : addStatus === 'loading' ? 'Adding...' : addStatus === 'added' ? 'Added' : 'Add to Cart'}
                            </button>
                        </div>
                    )}
                </div>

                <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">₹{product.price}</p>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
