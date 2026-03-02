import React from 'react';
import ProductCard from './ProductCard';
import { products } from '../data/products';
import './ProductGrid.css';

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
