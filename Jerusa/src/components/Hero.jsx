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
                        <button className="btn-primary">Explore Collection</button>
                        <button className="btn-secondary">Learn Our Story</button>
                    </div>
                </div>
                <div className="hero-image-wrapper">
                    <div className="glass-panel image-card">
                        {/* We will use a placeholder colored div with glassmorphism or an actual image if we had one */}
                        <div className="image-placeholder">
                            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="placeholder-icon"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="6.5"></line></svg>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
