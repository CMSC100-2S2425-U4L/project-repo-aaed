import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './SigninPage.css';

function SigninPage({ setIsLoggedIn, setShowModal, setUserData }) {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target[0].value;

    let dummyUser;

    if (email === "admin@example.com") {
        dummyUser = {
        firstName: "Admin",
        middleName: "",
        lastName: "User",
        email,
        userType: "admin",
        };
    } else {
        dummyUser = {
        firstName: "Jane",
        middleName: "C.",
        lastName: "Doe",
        email,
        userType: "customer",
        };
    }

    setUserData(dummyUser);
    setIsLoggedIn(true);
    setShowModal(false);

    navigate("/profile");
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
