import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import axios from 'axios';
import { toast } from 'react-toastify';

function SignUp({ onClose }) {
  const navigate = useNavigate();

  // Close signup page by going back to home (or any route)
  const handleOverlayClick = () => {
    navigate(-1); // Goes back to the previous page
  };

  // Prevent clicks inside the modal content from closing
  const handleContentClick = (e) => {
    e.stopPropagation(); // Prevents modal close when clicking inside
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    try {
      await axios.post('http://localhost:3000/auth/register', {
        ...formData,
        userType: 'customer'
      });
      toast.success('Account created successfully!');
      if (onClose) onClose();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error('Server error. Please try again later.');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content" onClick={handleContentClick}>
        <h2 className="modal-heading">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input name="firstName" placeholder="First Name" required onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" required onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" required onChange={handleChange} />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} />
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
