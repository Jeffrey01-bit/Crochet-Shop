import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import ProductComments from './ProductComments';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id));
    const [addStatus, setAddStatus] = useState('idle'); // 'idle' | 'loading' | 'added'
    const [averageRating, setAverageRating] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [totalRatings, setTotalRatings] = useState(0);
    const [userRating, setUserRating] = useState(null);
    const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
    const navigate = useNavigate();
    const { isInCart } = useCart();

    const isProductInCart = product ? isInCart(product.id) : false;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [slideDirection, setSlideDirection] = useState('none');

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) handleNextImage();
        if (isRightSwipe) handlePrevImage();
    };

    const handleNextImage = () => {
        if (!product.images) return;
        setSlideDirection('left');
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
        setTimeout(() => setSlideDirection('none'), 300);
    };

    const handlePrevImage = () => {
        if (!product.images) return;
        setSlideDirection('right');
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
        setTimeout(() => setSlideDirection('none'), 300);
    };

    const displayImage = product.images && product.images.length > 0
        ? product.images[currentImageIndex]
        : product.image;

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on page load
    }, [product]);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
        return () => unsubscribeAuth();
    }, []);

    useEffect(() => {
        if (!product) return;

        const ratingsRef = collection(db, 'productRatings', product.id.toString(), 'ratings');

        const unsubscribeRatings = onSnapshot(ratingsRef, (snapshot) => {
            let sum = 0;
            let count = 0;
            let uiRating = null;

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                if (typeof data.rating === 'number') {
                    sum += data.rating;
                    count++;
                    if (currentUser && docSnap.id === currentUser.uid) {
                        uiRating = data.rating;
                    }
                }
            });

            setTotalRatings(count);
            setAverageRating(count > 0 ? (sum / count).toFixed(1) : 0);
            setUserRating(uiRating);
        });

        return () => unsubscribeRatings();
    }, [product, currentUser]);



    const handleAddToCart = async (e) => {
        e.preventDefault();

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

    if (!product) {
        return (
            <div className="product-details-container empty-state">
                <h2>Product not found</h2>
                <Link to="/" className="btn-secondary">Return Home</Link>
            </div>
        );
    }

    const handleRatingClick = async (ratingValue) => {
        if (!auth.currentUser) {
            alert('Please sign in to rate this product.');
            navigate('/login');
            return;
        }

        if (isRatingSubmitting) return; // Removed userRating lock

        setIsRatingSubmitting(true);
        try {
            const ratingDocRef = doc(db, 'productRatings', product.id.toString(), 'ratings', auth.currentUser.uid);

            if (userRating === ratingValue) {
                // If they click the same rating they already gave, remove the rating instead
                await deleteDoc(ratingDocRef);
            } else {
                // Otherwise, set or update the rating
                await setDoc(ratingDocRef, {
                    rating: ratingValue,
                    timestamp: new Date()
                });
            }
            // State will update automatically via onSnapshot
        } catch (error) {
            console.error("Error saving rating: ", error);
            alert("Error saving rating. Please try again.");
        } finally {
            setIsRatingSubmitting(false);
        }
    };

    // A simple 5-star rating SVG component
    const StarRating = ({ interactive = true }) => {
        const [hoverRating, setHoverRating] = useState(0);
        const displayRating = hoverRating || userRating || 0;
        const displayAvg = averageRating > 0 ? averageRating : '0.0';

        return (
            <div className="star-rating" onMouseLeave={() => setHoverRating(0)} style={{ display: 'flex', alignItems: 'center' }}>
                <span className="rating-text" style={{ marginRight: '12px', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {displayAvg} <span style={{ color: '#FFA41C' }}>★</span>
                </span>

                <div style={{ display: 'flex' }}>
                    {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= displayRating;
                        const canRate = interactive && !isRatingSubmitting;

                        return (
                            <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                width="20" height="20"
                                viewBox="0 0 24 24"
                                fill={isFilled ? "#FFA41C" : "none"}
                                stroke={isFilled ? "#FFA41C" : "#ccc"}
                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                className={`star-icon ${canRate ? 'interactive' : ''}`}
                                onClick={() => canRate && handleRatingClick(star)}
                                onMouseEnter={() => canRate && setHoverRating(star)}
                                style={{
                                    cursor: canRate ? 'pointer' : 'default',
                                    transition: 'all 0.2s',
                                    transform: hoverRating === star ? 'scale(1.1)' : 'scale(1)'
                                }}
                            >
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        );
                    })}
                </div>
                <span className="rating-text" style={{ marginLeft: '12px', color: 'var(--text-secondary)' }}>
                    ({totalRatings} reviews)
                </span>
            </div>
        );
    };

    return (
        <section className="product-details-section">
            <div className="container">
                <div className="breadcrumb">
                    <Link to="/" className="back-link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        Back to Shop
                    </Link>
                </div>

                <div className="product-details-grid">
                    {/* Image Gallery Column - Reverted to Carousel/Lightbox */}
                    <div className="product-gallery">
                        <div
                            className="main-image-container"
                            onClick={() => setIsLightboxOpen(true)}
                            onTouchStart={onTouchStart}
                            onTouchMove={onTouchMove}
                            onTouchEnd={onTouchEnd}
                        >
                            {displayImage ? (
                                <img
                                    key={`main-${currentImageIndex}`}
                                    src={displayImage}
                                    alt={product.name}
                                    className={`main-image ${slideDirection !== 'none' ? `slide-${slideDirection}` : ''}`}
                                />
                            ) : (
                                <div className="placeholder-image">Image not available</div>
                            )}
                            {product.images && product.images.length > 1 && (
                                <>
                                    <button className="gallery-nav-btn prev" onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}>❮</button>
                                    <button className="gallery-nav-btn next" onClick={(e) => { e.stopPropagation(); handleNextImage(); }}>❯</button>
                                </>
                            )}
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="thumbnail-container">
                                {product.images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                        onClick={() => setCurrentImageIndex(index)}
                                    >
                                        <img src={img} alt={`${product.name} thumbnail ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info Column */}
                    <div className="product-info-details">
                        <h1 className="details-title">{product.name}</h1>
                        <p className="details-price">₹{product.price}</p>

                        <div className="details-rating-container">
                            <StarRating />
                        </div>

                        <div className="details-divider"></div>

                        <div className="details-actions">
                            {isProductInCart ? (
                                <button className="btn-add-to-cart btn-secondary added" disabled style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M20 6 9 17l-5-5" /></svg>
                                    Carted
                                </button>
                            ) : (
                                <button
                                    className={`btn-add-to-cart btn-secondary ${addStatus}`}
                                    onClick={handleAddToCart}
                                    disabled={addStatus !== 'idle'}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    {addStatus === 'idle' && (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                                            Add to Cart
                                        </>
                                    )}
                                    {addStatus === 'loading' && <span className="spinner-mini"></span>}
                                    {addStatus === 'added' && (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M20 6 9 17l-5-5" /></svg>
                                            Added
                                        </>
                                    )}
                                </button>
                            )}
                            <button className="btn-buy-now btn-primary">
                                Buy Now
                            </button>
                        </div>

                        <div className="details-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className="details-features">
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px', color: 'var(--text-secondary)' }}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                                    100% Handmade with premium yarn
                                </li>
                                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px', color: 'var(--text-secondary)' }}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                                    Aesthetic, breathable and comfortable
                                </li>
                                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '12px', color: 'var(--text-secondary)' }}><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>
                                    Unique artisanal design
                                </li>
                            </ul>
                        </div>

                        <div className="shipping-info">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2" /><path d="M8 8h.01" /><path d="M8 12h.01" /><path d="M8 16h.01" /><path d="M12 16h.01" /><path d="M16 16h.01" /><path d="M16 12h.01" /><path d="M16 8h.01" /><path d="M12 8h.01" /><path d="M12 12h.01" /></svg>
                            <p>For shipment and delivery information, kindly contact us directly.</p>
                        </div>
                    </div>
                </div>

                {/* Social Comments Section */}
                <ProductComments productId={product.id} />

            </div>

            {/* Lightbox */}
            {isLightboxOpen && (
                <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
                    <div
                        className="lightbox-content"
                        onClick={e => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <button className="lightbox-close" onClick={() => setIsLightboxOpen(false)}>✕</button>
                        <img
                            key={`lightbox-${currentImageIndex}`}
                            src={displayImage}
                            alt={product.name}
                            className={`lightbox-image ${slideDirection !== 'none' ? `slide-${slideDirection}` : ''}`}
                        />
                        {product.images && product.images.length > 1 && (
                            <>
                                <button className="lightbox-nav-btn prev" onClick={handlePrevImage}>❮</button>
                                <button className="lightbox-nav-btn next" onClick={handleNextImage}>❯</button>
                            </>
                        )}
                    </div>
                </div>
            )}

        </section>
    );
};

export default ProductDetails;
