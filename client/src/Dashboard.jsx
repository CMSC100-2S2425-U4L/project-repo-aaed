import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './CartContext';

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [products, setProducts] = useState([]);
  const { orders, products: cartProducts } = useCart(); // from CartContext

  // For now, users are still hardcoded
  const users = [
    { id: 1, name: 'Mike Wazowski', username: '@mikewazowski', email: 'mikewazowski@gmail.com', image: '/src/assets/images/mike.jpg' },
    { id: 2, name: 'Sully Sullivan', username: '@sully', email: 'sully@monstersinc.com', image: '/src/assets/images/sully.jpg' },
  ];

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/product/`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="admin-shop-container">
      <Sidebar />
      <main className="dashboard-panel">
        <h1>Admin Dashboard</h1>

        {/* Summary Cards */}
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
            {products.slice(0, 5).map(product => (
              <div className="product-card" key={product._id}>
                <img
                  src={product.productImage ? `${API_URL}/uploads/${product.productImage}` : '/src/assets/images/placeholder.jpg'}
                  alt={product.productName}
                />
                <h3>{product.productName}</h3>
                <p>Php {product.productPrice?.toFixed(2)}</p>
                <p>Stock: {product.productQuantity}</p>
                <span className="product-type-badge">
                  {product.productType === 1 ? "Crop" : product.productType === 2 ? "Poultry" : "Unknown"}
                </span>
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
            {orders.slice(0, 5).map(order => (
              <div className="customer-order-card" key={order.id}>
                <div className="customer-order-info">
                  <div>
                    <h4>Order ID: {order.id}</h4>
                    <p>Status: {order.orderStatus === 1 ? "Confirmed" : "Pending"}</p>
                    <p>Total: Php {order.totalAmount?.toFixed(2)}</p>
                    <p>Date: {new Date(order.dateOrdered).toLocaleDateString()}</p>
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
