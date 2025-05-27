import "./App.css";
import logo from "./assets/logo.png";
import { FaUserCircle, FaShoppingCart } from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import AdminShop from "./AdminShop";
import Users from "./Users";
import Orders from "./Orders";
import Sales from "./Sales";
import Dashboard from "./Dashboard";
import SignUp from "./SignUp";
import CustomerShop from "./CustomerShop";
import CustomerOrder from "./CustomerOrder";
import SigninPage from "./SigninPage";
import ProfilePage from "./ProfilePage";
import Cart from "./Cart";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CartProvider } from "./CartContext";

function Navbar({ handleProfileClick, role, handleLogout, isLoggedIn }) {
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

          {role !== "admin" && (
            <>
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
            </>
          )}

          <li onClick={handleProfileClick} style={{ cursor: "pointer" }}>
            <FaUserCircle size={45} />
          </li>
        </ul>
      </nav>
    </header>
  );
}

// function Home() {
//   return (
//     <main className="hero">
//       <div className="hero-content">
//         <img src={logo} alt="AgriMart Main" className="main-logo" />
//         <button className="shop-button">
//           <FaShoppingCart className="shop-icon" />
//           <span>
//             <Link to="/customershop">Start Shopping</Link>
//           </span>
//         </button>
//       </div>
//     </main>
//   );
// }

function Home({ userType }) {
  return (
    <main className="hero">
      <div className="hero-content">
        <img src={logo} alt="AgriMart Main" className="main-logo" />
        <button className="shop-button">
          <FaShoppingCart className="shop-icon" />
          <span>
            <Link to={userType === "admin" ? "/shop" : "/customershop"}>
              {userType === "admin" ? "Manage Your Shop" : "Start Shopping"}
            </Link>
          </span>
        </button>
      </div>
    </main>
  );
}


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [showModal, setShowModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userData, setUserData] = useState(() => {
    // Restore user info from localStorage on app load
    const userType = localStorage.getItem('userType');
    const email = localStorage.getItem('email');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    return userType && email && firstName && lastName
      ? { userType, email, firstName, lastName }
      : null;
  });
  const location = useLocation();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      setShowProfile(true);
    }
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('email');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    setIsLoggedIn(false);
    setUserData(null);
    setShowProfile(false);
    toast.success('Logged out successfully!');
    window.location.href = '/';
  };

  useEffect(() => {
    const showModalListener = () => setShowModal(true);
    window.addEventListener('show-signin-modal', showModalListener);
    return () => window.removeEventListener('show-signin-modal', showModalListener);
  }, []);

  // Keep userData in sync with localStorage (for login)
  useEffect(() => {
    if (isLoggedIn && userData) {
      localStorage.setItem('userType', userData.userType);
      localStorage.setItem('email', userData.email);
      localStorage.setItem('firstName', userData.firstName);
      localStorage.setItem('lastName', userData.lastName);
    }
  }, [isLoggedIn, userData]);

  useEffect(() => {
    if (isLoggedIn && userData?.userType) {
      // If on /shop but not admin, redirect to /customershop
      if (location.pathname === "/shop" && userData.userType !== "admin") {
        navigate("/customershop", { replace: true });
      }
      // If on /customershop but admin, redirect to /shop
      if (location.pathname === "/customershop" && userData.userType === "admin") {
        navigate("/shop", { replace: true });
      }
    }
  }, [isLoggedIn, userData, location.pathname, navigate]);

  return (
    <div className="app-container">
      <Navbar handleProfileClick={handleProfileClick} role={userData?.userType} handleLogout={handleLogout} isLoggedIn={isLoggedIn} />
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home userType={userData?.userType} />} />
          <Route
            path="/shop"
            element={
              userData?.userType === "admin"
                ? <AdminShop />
                : <CustomerShop />
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/customershop" element={<CustomerShop />} />
          <Route path="/customerorder" element={<CustomerOrder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/signin" element={<SigninPage setIsLoggedIn={setIsLoggedIn} setShowModal={setShowModal} setUserData={setUserData} />} />
        </Routes>
      </CartProvider>
      {showModal && (
        <SigninPage
          setIsLoggedIn={setIsLoggedIn}
          setShowModal={setShowModal}
          setUserData={setUserData}
        />
      )}
      {showProfile && userData && (
        <ProfilePage
          userData={userData}
          setShowProfile={setShowProfile}
          setIsLoggedIn={setIsLoggedIn}
          setUserData={setUserData}
        />
      )}
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default App;
