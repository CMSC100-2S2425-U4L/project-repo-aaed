import React from 'react';
import './CustomerOrder.css';
import CustomerSidebar from './CustomerSidebar';

function Sales() {
  return (
    <div className="admin-shop-container">
      <CustomerSidebar />
      <div className="product-panel">
        <h1>Orders</h1>
        <p>View orders here...</p>
      </div>
    </div>
  );
}

export default Sales;
