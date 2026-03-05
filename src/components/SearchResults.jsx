import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from './ProductCard';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (query) {
            const lowerQuery = query.toLowerCase();
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(lowerQuery) ||
                product.description.toLowerCase().includes(lowerQuery) ||
                (product.category && product.category.toLowerCase().includes(lowerQuery))
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <div className="search-results-page" style={{ paddingTop: 'calc(var(--nav-height, 80px) + 40px)', paddingBottom: '80px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <div className="container">
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--text-primary)' }}>Search Results</h1>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.1rem' }}>
                    {query ? `Showing results for "${query}"` : 'Please enter a search term'}
                </p>

                {results.length === 0 && query && (
                    <div className="empty-results" style={{ textAlign: 'center', padding: '60px 0', background: 'var(--bg-secondary)', borderRadius: 'var(--border-radius-main)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px' }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '15px' }}>No products found</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>We couldn't find any items matching your search. Try using different keywords or browsing our collections.</p>
                        <Link to="/shop" className="btn-primary" style={{ display: 'inline-block', marginTop: '30px' }}>Browse All Products</Link>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="product-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {results.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
