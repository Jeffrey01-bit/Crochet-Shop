import React from 'react';
import './About.css';

const About = () => {
    return (
        <section className="about-page">
            <div className="container about-container">

                <div className="about-content glass-panel">
                    <div className="about-text-section">
                        <h1 className="about-title">Our Story</h1>
                        <div className="about-divider"></div>

                        <p className="about-paragraph primary">
                            Welcome to <strong>Crochet Shop</strong>. We believe in the magic of handmade artistry and the timeless elegance of slow fashion.
                        </p>

                        <p className="about-paragraph">
                            Every loop, stitch, and pattern is carefully crafted by hand, pouring hours of dedication and love into creating unique, wearable art. From cozy cardigans to delicate accessories, our focus is always on bringing high-quality, sustainable crochet directly to your wardrobe.
                        </p>

                        <p className="about-paragraph">
                            We source only the softest, most vibrant yarns to ensure that every piece doesn't just look beautiful, but feels incredibly comfortable to wear. Whether you are looking for a statement piece for a special occasion or everyday comfort, our collection is designed to make you feel as unique as the creations themselves.
                        </p>

                        <div className="about-values">
                            <div className="value-item">
                                <span className="value-icon">✨</span>
                                <span className="value-text">100% Handmade</span>
                            </div>
                            <div className="value-item">
                                <span className="value-icon">🧶</span>
                                <span className="value-text">Premium Yarn</span>
                            </div>
                            <div className="value-item">
                                <span className="value-icon">🌿</span>
                                <span className="value-text">Sustainable</span>
                            </div>
                        </div>
                    </div>

                    <div className="about-image-section">
                        <div className="about-image-wrapper">
                            <img src="/Lander page wallpaper.jpg" alt="Beautiful handmade crochet craftsmanship" className="about-hero-image" />
                            <div className="about-image-decoration decoration-1"></div>
                            <div className="about-image-decoration decoration-2"></div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default About;
