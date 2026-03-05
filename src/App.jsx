import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Footer from './components/Footer';
import AestheticFlowers from './components/AestheticFlowers';
import ProductDetails from './components/ProductDetails';
import Contact from './components/Contact';
import Login from './components/Login';
import Signup from './components/Signup';
import Settings from './components/Settings';
import Orders from './components/Orders';
import About from './components/About';
import Shop from './components/Shop';
import Cart from './components/Cart';
import SearchResults from './components/SearchResults';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <div className="app">
      <ScrollToTop />
      <AestheticFlowers />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <ProductGrid />
              <Contact />
            </>
          } />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
