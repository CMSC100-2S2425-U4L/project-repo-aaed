import React from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom'; // Add this if not yet

function Dashboard() {
  const users = [
    { id: 1, name: 'Mike Wazowski', username: '@mikewazowski', email: 'mikewazowski@gmail.com', image: '/src/assets/images/mike.jpg' },
    { id: 2, name: 'Sully Sullivan', username: '@sully', email: 'sully@monstersinc.com', image: '/src/assets/images/sully.jpg' },
  ];

  const products = [
    { id: 1, name: 'Chicken Eggs', price: 35.00, stock: 10, type: 'Poultry', image: '/src/assets/images/placeholder.jpg' },
    { id: 2, name: 'Rice', price: 45.00, stock: 5, type: 'Crop', image: '/src/assets/images/placeholder.jpg' },
  ];

  const orders = [
    {
      id: 'ORD001',
      items: [
        { name: 'Chicken Eggs', quantity: 2, price: 35.00 },
        { name: 'Rice', quantity: 1, price: 45.00 },
      ],
      total: 115.00,
      status: 1
    },
  ];

  return (
    <div className="admin-shop-container">
      <Sidebar />
      <main className="dashboard-panel">
        <h1>Admin Dashboard</h1>

        <div className="dashboard-grid">
          <div className="dashboard-card"><h3>Total Users</h3><p>{users.length}</p></div>
          <div className="dashboard-card"><h3>Total Products</h3><p>{products.length}</p></div>
          <div className="dashboard-card"><h3>Total Orders</h3><p>{orders.length}</p></div>
          <div className="dashboard-card"><h3>Weekly Sales</h3><p>Php 475.00</p></div>
        </div>

        {/* USERS */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Recent Users</h2>
            <Link to="/users" className="view-all-link">View All</Link>
          </div>
          <div className="dashboard-scroll-preview">
            {users.map(user => (
              <div className="user-card" key={user.id}>
                <img src={user.image} alt={user.name} className="user-avatar" />
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p>{user.username}</p>
                  <p>{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Inventory Snapshot</h2>
            <Link to="/shop" className="view-all-link">View All</Link>
          </div>
          <div className="dashboard-scroll-preview">
            {products.map(product => (
              <div className="product-card" key={product.id}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Php {product.price.toFixed(2)}</p>
                <p>Stock: {product.stock}</p>
                <span className="product-type-badge">{product.type}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ORDERS */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Latest Orders</h2>
            <Link to="/orders" className="view-all-link">View All</Link>
          </div>
          <div className="dashboard-scroll-preview">
            {orders.map(order => (
              <div className="customer-order-card" key={order.id}>
                <div className="customer-order-info">
                  <div>
                    <h4>Order ID: {order.id}</h4>
                    <p>Status: {order.status === 1 ? "Paid" : "Pending"}</p>
                    <p>Total: Php {order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
