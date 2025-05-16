import React, { useState } from 'react';
import './App.css'; // Reuse styles from modal
import { useNavigate } from 'react-router-dom';

function SignUp({ onClose, onCreateAccount }) {

    const navigate = useNavigate();

  // Close signup page by going back to home (or any route)
  const handleOverlayClick = () => {
    navigate('/');
  };

  // Prevent clicks inside the modal content from closing
  const handleContentClick = (e) => {
    e.stopPropagation();
  };
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // TODO: Add uniqueness check for username via backend
    onCreateAccount(formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-heading">Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input name="firstName" placeholder="First Name" required onChange={handleChange} />
          <input name="lastName" placeholder="Last Name" required onChange={handleChange} />
          <input name="username" placeholder="Username" required onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" required onChange={handleChange} />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" required onChange={handleChange} />
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
