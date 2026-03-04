import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import './ProductGrid.css';

const ProductGrid = () => {
    return (
        <section className="product-section" id="latest">
            <div className="container">
                <h2 className="section-title">Latest Creations</h2>
                <div className="product-grid">
                    {products.slice(0, 3).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                {products.length > 3 && (
                    <div className="view-all-container">
                        <Link to="/shop" className="btn-secondary view-all-btn" style={{ textDecoration: 'none' }}>View All Products</Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ProductGrid;
