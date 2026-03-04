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
    const [mainImage, setMainImage] = useState('');
    const [addStatus, setAddStatus] = useState('idle'); // 'idle' | 'loading' | 'added'
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);
    const [totalRatings, setTotalRatings] = useState(0);
    const [userRating, setUserRating] = useState(null);
    const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);
    const navigate = useNavigate();
    const { isInCart } = useCart();

    const isProductInCart = product ? isInCart(product.id) : false;

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on page load
        if (product && product.images && product.images.length > 0) {
            setMainImage(product.images[0]);
            setLightboxIndex(0);
        }
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

    const openLightbox = (index = 0) => {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
        document.body.style.overflow = 'hidden'; // prevent scrolling when modal is open
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const handleLightboxNext = (e) => {
        e.stopPropagation();
        if (product && product.images) {
            setLightboxIndex((prev) => (prev + 1) % product.images.length);
        }
    };

    const handleLightboxPrev = (e) => {
        e.stopPropagation();
        if (product && product.images) {
            setLightboxIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
        }
    };

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
                    image: mainImage || product.image || '',
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
                    {displayAvg} <span style={{ color: 'var(--accent-color)' }}>★</span>
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
                                fill={isFilled ? "var(--accent-color)" : "none"}
                                stroke={isFilled ? "var(--accent-color)" : "#ccc"}
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
                    {/* Image Gallery Column */}
                    <div className="product-gallery">
                        <div className="main-image-container glass-panel" onClick={() => openLightbox(product.images ? product.images.indexOf(mainImage) : 0)}>
                            {mainImage ? (
                                <>
                                    <img src={mainImage} alt={product.name} className="main-image" />
                                    <div className="expand-hint">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>
                                    </div>
                                </>
                            ) : (
                                <div className="placeholder-image">Image not available</div>
                            )}
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="thumbnail-list">
                                {product.images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail glass-panel ${mainImage === img ? 'active' : ''}`}
                                        onClick={() => {
                                            setMainImage(img);
                                            setLightboxIndex(index);
                                        }}
                                    >
                                        <img src={img} alt={`${product.name} view ${index + 1}`} />
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

                        <div className="details-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className="details-features">
                            <ul>
                                <li>✨ 100% Handmade with premium yarn</li>
                                <li>🌿 Aesthetic, breathable and comfortable</li>
                                <li>🎨 Unique artisanal design</li>
                            </ul>
                        </div>

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

                        <div className="shipping-info">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2" /><path d="M8 8h.01" /><path d="M8 12h.01" /><path d="M8 16h.01" /><path d="M12 16h.01" /><path d="M16 16h.01" /><path d="M16 12h.01" /><path d="M16 8h.01" /><path d="M12 8h.01" /><path d="M12 12h.01" /></svg>
                            <p>Ships within 3-5 business days.</p>
                        </div>
                    </div>
                </div>

                {/* Social Comments Section */}
                <ProductComments productId={product.id} />

            </div>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>

                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <div className="lightbox-image-wrapper">
                            <img
                                src={product.images ? product.images[lightboxIndex] : product.image}
                                alt={`${product.name} full view`}
                                className="lightbox-image"
                            />

                            {product.images && product.images.length > 1 && (
                                <>
                                    <button className="lightbox-btn prev" onClick={handleLightboxPrev}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                    </button>
                                    <button className="lightbox-btn next" onClick={handleLightboxNext}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                                    </button>
                                </>
                            )}
                        </div>

                        {product.images && product.images.length > 1 && (
                            <div className="lightbox-thumbnails">
                                {product.images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`lightbox-thumbnail ${lightboxIndex === index ? 'active' : ''}`}
                                        onClick={() => setLightboxIndex(index)}
                                    >
                                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default ProductDetails;
