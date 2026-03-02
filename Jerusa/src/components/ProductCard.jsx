import React, { useState, useEffect } from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        let interval;
        if (isHovering && product.images && product.images.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) =>
                    (prevIndex + 1) % product.images.length
                );
            }, 1500); // Change image every 1.5 seconds
        } else {
            setCurrentImageIndex(0); // Reset to first image when not hovering
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isHovering, product.images]);

    const displayImage = product.images && product.images.length > 0
        ? product.images[currentImageIndex]
        : product.image;

    return (
        <div
            className="product-card glass-panel"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div className="product-image-container">
                {displayImage ? (
                    <img src={displayImage} alt={product.name} className="product-image" />
                ) : (
                    <div className="product-image-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path><path d="M7 7h.01"></path></svg>
                    </div>
                )}
                <div className="product-overlay">
                    <p className="product-description">{product.description}</p>
                    <button className="btn-quick-add">Quick Add</button>
                </div>
            </div>
            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.price}</p>
            </div>
        </div>
    );
};

export default ProductCard;
