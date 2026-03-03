import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero" id="home">
            <div className="hero-background">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>
            <div className="container hero-container">
                <div className="hero-content">
                    <span className="hero-subtitle">Handmade with love</span>
                    <h1 className="hero-title">
                        Wear poetry,<br />
                        woven in <span className="highlight">crochet</span>.
                    </h1>
                    <p className="hero-description">
                        Discover our collection of unique, aesthetic, and fully handmade crochet clothing designed for the modern woman.
                    </p>
                    <div className="hero-cta">
                        <a href="#shop" className="btn-primary" style={{ textDecoration: 'none' }}>Explore Collection</a>
                        <a href="#about" className="btn-secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>Learn Our Story</a>
                    </div>
                </div>
                <div className="hero-image-wrapper">
                    <div className="glass-panel image-card">
                        <img src="/hero-image.png" alt="Aesthetic Crochet Fashion" className="hero-product-image" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
