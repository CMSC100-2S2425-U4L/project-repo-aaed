import React from 'react';
import './Users.css';
import Sidebar from './Sidebar';

function Users() {
  const users = [
    { id: 1, name: 'Mike Wazowski', username: '@mikewazowski', email: 'mikewazowski@gmail.com', image: '/src/assets/images/mike.jpg' },
    { id: 2, name: 'Sully Sullivan', username: '@sully', email: 'sully@monstersinc.com', image: '/src/assets/images/sully.jpg' },
  ];

  return (
    <div className="admin-shop-container">
      <Sidebar />

      <main className="user-panel">
        <div className="user-grid">
          {users.map(user => (
            <div key={user.id} className="user-card">
              <img src={user.image} alt={user.name} className="user-avatar" />
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.username}</p>
                <p>{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Users;
