import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar';

function Dashboard() {
  return (
    <div className="admin-shop-container">
      <Sidebar />
      <div className="product-panel">
        <h1>Dashboard</h1>
        <p>Summary of your store's performance...</p>
        {/* Add real stats or charts here later */}
      </div>
    </div>
  );
}

export default Dashboard;
