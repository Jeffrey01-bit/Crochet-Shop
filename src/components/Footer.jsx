import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h2 className="footer-logo">Crochet Shop.</h2>
                        <p className="footer-tagline">
                            Handmade crochet clothing,<br /> crafted with love and patience.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h3>Shop</h3>
                        <ul>
                            <li><a href="#">All Products</a></li>
                            <li><a href="#">Tops</a></li>
                            <li><a href="#">Cardigans</a></li>
                            <li><a href="#">Accessories</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h3>Brand</h3>
                        <ul>
                            <li><a href="#">Our Story</a></li>
                            <li><a href="#">Sustainability</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">FAQ</a></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h3>Social</h3>
                        <ul>
                            <li><a href="#">Instagram</a></li>
                            <li><a href="#">TikTok</a></li>
                            <li><a href="#">Pinterest</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Crochet Shop. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
