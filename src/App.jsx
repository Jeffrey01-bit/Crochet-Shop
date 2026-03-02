import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import AestheticFlowers from './components/AestheticFlowers';
import ProductDetails from './components/ProductDetails';

function App() {
  return (
    <div className="app">
      <AestheticFlowers />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <ProductGrid />
            </>
          } />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
