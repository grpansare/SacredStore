import React from "react";
import "./App.css";

const App = () => {
  return (
    <div className="homepage-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <span role="img" aria-label="lotus">🪷</span> Sacred Store
        </div>
        <ul className="navbar-links">
          <li><a href="#">Home</a></li>
          <li><a href="#categories">Categories</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><button className="navbar-btn">Login</button></li>
        </ul>
      </nav>
      <header className="hero-section">
        <h1>Welcome to Sacred Store</h1>
        <p>
          Your trusted destination for religious books, artifacts, and spiritual
          essentials.
        </p>
        <button className="shop-now-btn">Shop Now</button>
      </header>
      <section className="featured-categories" id="categories">
        <h2>Featured Categories</h2>
        <div className="categories-grid">
          <div className="category-card">
            <img src="/public/vite.svg" alt="Books" />
            <h3>Books & Scriptures</h3>
          </div>
          <div className="category-card">
            <img src="/src/assets/react.svg" alt="Artifacts" />
            <h3>Religious Artifacts</h3>
          </div>
          <div className="category-card">
            <img src="/public/vite.svg" alt="Puja Items" />
            <h3>Puja Essentials</h3>
          </div>
        </div>
      </section>
      <section className="about-section" id="about">
        <h2>About Sacred Store</h2>
        <p>
          Sacred Store is dedicated to providing authentic religious products to
          help you on your spiritual journey. Explore our curated collection and
          experience peace, devotion, and tradition at your fingertips.
        </p>
      </section>
      <footer className="footer">
        <p>
          &copy; {new Date().getFullYear()} Sacred Store. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
