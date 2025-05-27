import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Users.css';
import Sidebar from './Sidebar';

function Users() {
  const [users, setUsers] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API_URL}/auth/getAllUsers`);
        setUsers(res.data);
      } catch (err) {
        setUsers([]);
      }
    };
    fetchUsers();
  }, [API_URL]);

  return (
    <div className="admin-shop-container">
      <Sidebar />

      <main className="user-panel">
        <div className="user-grid">
          {users.filter(user => user.userType === 'customer').map(user => (
            <div key={user._id || user.id} className="user-card">
              <img src={user.image || '/src/assets/images/placeholder.jpg'} alt={user.name || user.firstName} className="user-avatar" />
              <div className="user-info">
                <h3>{user.name || `${user.firstName} ${user.lastName}`}</h3>
                <p>{user.username || user.email}</p>
                <p>{user.userType || user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Users;
