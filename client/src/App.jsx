import './App.css';
import logo from './assets/logo.png';

function App() {
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
            <li><i className="fas fa-user-circle"></i></li>
          </ul>
        </nav>
      </header>

      <main className="hero">
        <div className="hero-content">
          <img src={logo} alt="AgriMart Main" className="main-logo" />
          <button className="shop-button">
            🛒 Start Shopping
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
