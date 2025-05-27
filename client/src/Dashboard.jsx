import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]); // <-- fetch from backend

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/getAllUsers`);
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
      console.error("Error fetching users:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/product/`);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders?populate=productId`);
      setOrders(res.data);
    } catch (err) {
      setOrders([]);
      console.error("Error fetching orders:", err);
    }
  };

  // Calculate total confirmed orders
  const getTotalConfirmedOrders = () => {
    return orders.filter(order => order.orderStatus === 1).length;
  };

  // Calculate total sales (sum of all confirmed orders)
  const getTotalSales = () => {
    return orders
      .filter(order => order.orderStatus === 1)
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchOrders(); // <-- fetch orders on mount
  }, []);

  return (
    <div className="admin-shop-container">
      <Sidebar />
      <main className="dashboard-panel" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 150px)', padding: '2rem' }}>
        <h1>Admin Dashboard</h1>
        <div className="dashboard-grid">
          <div className="dashboard-card"><h3>Total Users</h3><p>{users.length}</p></div>
          <div className="dashboard-card"><h3>Total Products</h3><p>{products.length}</p></div>
          <div className="dashboard-card"><h3>Total Sales</h3><p>Php {getTotalSales().toFixed(2)}</p></div>
          <div className="dashboard-card"><h3>Confirmed Orders</h3><p>{getTotalConfirmedOrders()}</p></div>
        </div>
        {/* USERS */}
        <section className="dashboard-section">
          <div className="dashboard-section-header">
            <h2>Recent Users</h2>
            <Link to="/users" className="view-all-link">View All</Link>
          </div>
          <div className="dashboard-scroll-preview">
            {users.filter(user => user.userType === 'customer').slice(0, 5).map(user => (
              <div className="user-card" key={user._id}>
                <img src={user.image || '/src/assets/images/placeholder.jpg'} alt={user.name || user.firstName} className="user-avatar" />
                <div className="user-info">
                  <h3>{user.name || `${user.firstName} ${user.lastName}`}</h3>
                  <p>{user.username || user.email}</p>
                  <p>{user.userType}</p>
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
              <div className="customer-order-card" key={order._id}>
                <div className="customer-order-info">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <h4>Order ID: {order._id}</h4>
                    {order.productId && order.productId.productImage && (
                      <img
                        src={`${API_URL}/uploads/${order.productId.productImage}`}
                        alt={order.productId.productName}
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, margin: '0.5rem 0' }}
                      />
                    )}
                    <div style={{ textAlign: 'center' }}>
                      <p>Status: {order.orderStatus === 1 ? "Confirmed" : order.orderStatus === 2 ? "Canceled" : "Pending"}</p>
                      <p>Total: Php {order.totalAmount?.toFixed(2)}</p>
                      <p>Date: {order.dateOrdered ? new Date(order.dateOrdered).toLocaleDateString() : ''}</p>
                    </div>
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
