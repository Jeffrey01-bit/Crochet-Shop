import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';
import './Navbar.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (searchQuery.trim().length > 0) {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(lowerQuery) ||
                product.description.toLowerCase().includes(lowerQuery) ||
                (product.category && product.category.toLowerCase().includes(lowerQuery))
            ).slice(0, 5); // Max 5 suggestions
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (isSearchOpen) {
            document.body.style.overflow = 'hidden';
            // Slight delay to allow focus if needed
        } else {
            document.body.style.overflow = 'unset';
            setTimeout(() => setSearchQuery(''), 300); // Clear after animation
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isSearchOpen]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleHomeClick = () => {
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleScrollToSection = (e, sectionId) => {
        setIsMobileMenuOpen(false); // Close mobile menu if open
        if (location.pathname === '/') {
            e.preventDefault();
            document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    // Close settings dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isSettingsOpen && !e.target.closest('.settings-menu-container')) {
                setIsSettingsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isSettingsOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const { cartCount } = useCart();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsSettingsOpen(false);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="container nav-container" style={{ position: 'relative' }}>

                    <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''} nav-item-fade ${isSearchOpen ? 'fade-out' : ''}`}>
                        <li><Link to="/" onClick={() => { handleHomeClick(); handleLinkClick(); }}>Home</Link></li>
                        <li><Link to="/#latest" onClick={(e) => handleScrollToSection(e, 'latest')}>Shop</Link></li>
                        <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
                        <li><a href="/#contact" onClick={(e) => handleScrollToSection(e, 'contact')}>Contact</a></li>

                        {/* Mobile Only Auth/Settings Links */}
                        {user ? (
                            <>
                                <li className="mobile-only-link"><Link to="/settings" onClick={handleLinkClick}>Profile</Link></li>
                                <li className="mobile-only-link"><Link to="/orders" onClick={handleLinkClick}>Orders</Link></li>
                                <li className="mobile-only-link"><button onClick={() => { handleLogout(); handleLinkClick(); }} style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '500', color: 'var(--text-primary)' }}>Logout</button></li>
                            </>
                        ) : (
                            <li className="mobile-only-link"><Link to="/login" onClick={handleLinkClick}>Sign In</Link></li>
                        )}
                    </ul>

                    <Link to="/" className={`logo nav-item-fade ${isSearchOpen ? 'fade-out' : ''}`}>
                        Crochet Shop.
                    </Link>

                    <div className={`nav-actions nav-item-fade ${isSearchOpen ? 'fade-out' : ''}`}>
                        <button type="button" className="icon-btn search-btn" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>

                        {user ? (
                            <div className="settings-menu-container desktop-only-setting" style={{ position: 'relative' }}>
                                <button className="icon-btn" aria-label="Settings" title="Settings" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                                </button>

                                {isSettingsOpen && (
                                    <div className="navbar-settings-dropdown">
                                        <div className="dropdown-header">
                                            <p className="dropdown-name">{user.displayName || 'User'}</p>
                                            <p className="dropdown-email">{user.email}</p>
                                        </div>
                                        <hr />
                                        <Link to="/settings" onClick={() => setIsSettingsOpen(false)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                            Profile Details
                                        </Link>
                                        <Link to="/orders" onClick={() => setIsSettingsOpen(false)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                                            My Orders
                                        </Link>
                                        <hr />
                                        <button onClick={handleLogout} className="dropdown-logout">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="icon-btn" aria-label="Sign In" title="Sign In">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </Link>
                        )}

                        <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart" title="Cart">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                        </Link>

                        <button className="mobile-menu-btn icon-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle Menu">
                            {isMobileMenuOpen ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                            )}
                        </button>
                    </div>

                    {/* Integrated Navbar Search */}
                    <div className={`navbar-search-inline ${isSearchOpen ? 'active' : ''}`}>
                        <form className="navbar-search-form" onSubmit={handleSearchSubmit}>
                            <svg className="navbar-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="navbar-search-input"
                                autoFocus={isSearchOpen}
                            />
                            <button type="button" className="navbar-search-close" onClick={() => setIsSearchOpen(false)} aria-label="Close search">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </form>

                        {suggestions.length > 0 && (
                            <div className="navbar-search-suggestions">
                                <h4 className="suggestions-title">Quick Results</h4>
                                {suggestions.map(product => (
                                    <Link
                                        key={product.id}
                                        to={`/product/${product.id}`}
                                        className="suggestion-item"
                                        onClick={() => setIsSearchOpen(false)}
                                    >
                                        <div className="suggestion-image">
                                            <img src={product.image || product.images[0]} alt={product.name} />
                                        </div>
                                        <div className="suggestion-info">
                                            <h4>{product.name}</h4>
                                            <p>₹{product.price}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </nav>

            {/* Background Blur Overlay (closes search when clicked) */}
            <div className={`page-blur-overlay ${isSearchOpen ? 'active' : ''}`} onClick={() => setIsSearchOpen(false)}></div>
        </>
    );
};

export default Navbar;
