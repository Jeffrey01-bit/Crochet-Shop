import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero" id="home">
            <div className="hero-background" style={{ backgroundImage: 'url("/Lander page wallpaper.jpg")' }}>
                <div className="hero-overlay"></div>
            </div>
            <div className="container hero-container">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Handcrafted knitwear,<br />
                        made mindfully.
                    </h1>
                    <div className="hero-cta">
                        <Link to="/shop" className="btn-primary" style={{ textDecoration: 'none' }}>Shop The Collection</Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
