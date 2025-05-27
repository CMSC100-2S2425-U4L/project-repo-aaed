import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import './SigninPage.css';

function SigninPage({ setIsLoggedIn, setShowModal, setUserData }) {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!password) {
      toast.error('Password is required.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      const data = response.data;
      if (response.status === 200 && data.token) {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        // Decode token to get user info
        const decoded = jwtDecode(data.token);
        localStorage.setItem('userId', decoded._id);
        // Store user info for session persistence
        localStorage.setItem('userType', data.userType);
        localStorage.setItem('email', data.email);
        localStorage.setItem('firstName', data.firstName);
        localStorage.setItem('lastName', data.lastName);
        setShowModal(false);
        setUserData({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          userType: data.userType
        });
        toast.success('Login successful!');
        if (data.userType === 'admin') {
          navigate('/shop');
        } else {
          navigate('/customershop');
        }
      } else {
        toast.error(data.message || 'Login failed.');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-heading">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" required />
          <br />
          <input type="password" placeholder="Password" required />
          <br />
          <div className="signup-text">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="create-link"
              onClick={() => setShowModal(false)}
            >
              Create one
            </Link>
          </div>
          <button>Continue</button>
        </form>
      </div>
    </div>
  );
}

export default SigninPage;
