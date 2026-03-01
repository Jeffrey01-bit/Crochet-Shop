import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const products = [
    { id: 1, name: 'Daisy Dream Cardigan', price: 85.00 },
    { id: 2, name: 'Sunset Gradient Top', price: 45.00 },
    { id: 3, name: 'Ocean Breeze Vest', price: 65.00 },
    { id: 4, name: 'Cozy Cloud Sweater', price: 95.00 },
    { id: 5, name: 'Lavender Lace Skirt', price: 75.00 },
    { id: 6, name: 'Bloom Bucket Hat', price: 35.00 },
];

const ProductGrid = () => {
    return (
        <section className="product-section" id="shop">
            <div className="container">
                <h2 className="section-title">Latest Creations</h2>
                <div className="product-grid">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="view-all-container">
                    <button className="btn-secondary view-all-btn">View All Products</button>
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
