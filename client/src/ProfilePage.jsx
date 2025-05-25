import React from "react";

function ProfilePage({ userData, setShowProfile, setIsLoggedIn, setUserData }) {
  //Return nothing or a placeholder if no user data yet
  if (!userData) {
    return null;
  }

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setShowProfile(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowProfile(false)}>
      <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="profile-name">
          {userData.firstName} {userData.middleName} {userData.lastName}
        </h2>
        <p className="profile-email">{userData.email}</p>
        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default ProfilePage;
