import './App.css';
import logo from './assets/logo.png';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';
import React, { useState } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      // Show profile or menu if needed
    }
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <img src={logo} alt="AgriMart Logo" className="logo" />
        <nav>
          <ul className="nav-links">
            <li className="active">Home</li>
            <li>Shop</li>
            <li>Cart</li>
            <li>About</li>
            <li onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
              <FaUserCircle size={45} />
            </li>
          </ul>
        </nav>
      </header>

      <main className="hero">
        <div className="hero-content">
          <img src={logo} alt="AgriMart Main" className="main-logo" />
          <button className="shop-button">
            <FaShoppingCart className="shop-icon" />
            <span> Start Shopping</span>
          </button>
        </div>
      </main>

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
                Don’t have an account? <span className="create-link">Create one</span>
              </div>
              <button>Continue</button>
              <p style={{ fontSize: '0.8rem', marginTop: '8px' }}>Don't have an account? Sign up here.</p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
