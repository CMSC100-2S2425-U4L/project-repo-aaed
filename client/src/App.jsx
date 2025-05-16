import './App.css';
import logo from './assets/logo.png';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import React, { useState } from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import AdminShop from './AdminShop';
import Users from './Users';
import Orders from './Orders';
import Sales from './Sales';
import Dashboard from './Dashboard';
import SignUp from './SignUp';
import CustomerShop from './CustomerShop';
import CustomerOrder from './CustomerOrder';
import Cart from './Cart';

// Import your CartProvider from where you saved it
import { CartProvider } from './CartContext';

function Navbar({ handleProfileClick }) {
  return (
    <header className="navbar">
      <img src={logo} alt="AgriMart Logo" className="logo" />
      <nav>
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? "active-tab" : ""}`}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop" className={({ isActive }) => `nav-item ${isActive ? "active-tab" : ""}`}>
              Shop
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className={({ isActive }) => `nav-item ${isActive ? "active-tab" : ""}`}>
              Cart
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => `nav-item ${isActive ? "active-tab" : ""}`}>
              About
            </NavLink>
          </li>
          <li onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
            <FaUserCircle size={45} />
          </li>
        </ul>
      </nav>
    </header>
  );
}

function Home() {
  return (
    <main className="hero">
      <div className="hero-content">
        <img src={logo} alt="AgriMart Main" className="main-logo" />
        <button className="shop-button">
          <FaShoppingCart className="shop-icon" />
          <span><Link to="/customershop">Start Shopping</Link></span>
        </button>
      </div>
    </main>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      // Logic for showing profile info if logged in
    }
  };

  return (
    <div className="app-container">
      <Navbar handleProfileClick={handleProfileClick} />

      {/* Wrap your routes with CartProvider here */}
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<AdminShop />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/customershop" element={<CustomerShop />} />
          <Route path="/customerorder" element={<CustomerOrder />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </CartProvider>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-heading">Sign In</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              setIsLoggedIn(true);
              setShowModal(false);
            }}>
              <input type="email" placeholder="Email" required /><br />
              <input type="password" placeholder="Password" required /><br />
              <div className="signup-text">
                Don’t have an account?{' '}
                <Link to="/signup" className="create-link" onClick={() => setShowModal(false)}>
                  Create one
                </Link>
              </div>
              <button>Continue</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
