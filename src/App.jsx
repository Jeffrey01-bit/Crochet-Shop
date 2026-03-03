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
import Profile from './components/Profile';

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
              <Contact />
            </>
          } />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
