import React, { useEffect } from 'react';
import { products } from '../data/products';
import ProductCard from './ProductCard';
import './Shop.css';

const Shop = () => {
    // Scroll to top when mounting the Shop page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="shop-page page-transition">
            <section className="shop-header">
                <div className="container">
                    <h1 className="page-title">Shop Collection</h1>
                    <p className="page-subtitle">Handcrafted with love, just for you.</p>
                </div>
            </section>

            <section className="shop-content">
                <div className="container">
                    <div className="shop-grid">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} showActions={true} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Shop;
