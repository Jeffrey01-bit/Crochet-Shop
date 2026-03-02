import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id));
    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top on page load
        if (product && product.images && product.images.length > 0) {
            setMainImage(product.images[0]);
        }
    }, [product]);

    if (!product) {
        return (
            <div className="product-details-container empty-state">
                <h2>Product not found</h2>
                <Link to="/" className="btn-secondary">Return Home</Link>
            </div>
        );
    }

    // A simple 5-star rating SVG component
    const StarRating = ({ rating = 0 }) => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20" height="20"
                        viewBox="0 0 24 24"
                        fill={star <= rating ? "var(--accent-color)" : "none"}
                        stroke={star <= rating ? "var(--accent-color)" : "#ccc"}
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="star-icon"
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                ))}
                <span className="rating-text">({rating > 0 ? `${rating}.0` : '0 Reviews'})</span>
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
                        <div className="main-image-container glass-panel">
                            {mainImage ? (
                                <img src={mainImage} alt={product.name} className="main-image" />
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
                                        onClick={() => setMainImage(img)}
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
                            <StarRating rating={0} /> {/* Display zero rating if none provided yet */}
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
                            <button className="btn-add-to-cart btn-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
                                Add to Cart
                            </button>
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
            </div>
        </section>
    );
};

export default ProductDetails;
