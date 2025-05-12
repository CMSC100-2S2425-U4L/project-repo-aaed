import './App.css';
import logo from './assets/logo.png';
import { FaUserCircle, FaShoppingCart } from 'react-icons/fa';

function App() {
  return (
    <div className="app-container">
      <header className="navbar">
        <img src={logo} alt="AgriMart Logo" className="logo"/>
        <nav>
          <ul className="nav-links">
            <li className="active">Home</li>
            <li>Shop</li>
            <li>Cart</li>
            <li>About</li>
            <li><FaUserCircle size={45}/></li>
          </ul>
        </nav>
      </header>

      <main className="hero">
        <div className="hero-content">
          <img src={logo} alt="AgriMart Main" className="main-logo" />
          <button className="shop-button">
            <FaShoppingCart className="shop-icon" />
            <span>  Start Shopping</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
