import React from 'react';
import './Sales.css';
import Sidebar from './Sidebar';

function Sales() {
  return (
    <div className="admin-shop-container">
      <Sidebar />
      <div className="product-panel">
        <h1>Sales Report</h1>
        <p>View daily, weekly, or monthly sales here...</p>
        {/* Insert charts or data visualization */}
      </div>
    </div>
  );
}

export default Sales;
