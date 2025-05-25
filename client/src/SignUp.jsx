import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function SignUp({ onClose, onCreateAccount }) {

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

  const handleSubmit = e => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    onCreateAccount(formData);
    onClose();
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
