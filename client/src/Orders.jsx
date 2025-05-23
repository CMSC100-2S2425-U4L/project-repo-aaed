import React, { useState, useEffect } from 'react';
import './CustomerShop.css';
import './Sidebar.css';
import './Orders.css';
import Sidebar from './Sidebar';
import { useCart } from './CartContext';

function Orders() {
  const { orders, products, addOrder, updateOrderStatus } = useCart();

  const PRODUCT_TYPE_MAP = {
    1: 'Crop',
    2: 'Poultry',
  };

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
  };

  return (
    <div className="admin-shop-container">
      <Sidebar /> 
      <div className="order-panel">
        <div className="order-grid">

          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-info">

                <div className="order-date">
                  <p><strong>Date</strong></p>
                  <p>{new Date(order.dateOrdered).toLocaleDateString()}</p>
                </div>

                <div className="order-id">
                  <p><strong>Order ID</strong></p>
                  <p>{order.id}</p>
                </div>


                <div className="order-items">
                  <p><strong>Items</strong></p>
                  {order.items.map((item, index) => {
                    const product = products[item.productId] || {};
                    return (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <img
                          className="order-image"
                          src={product.image || '/src/assets/images/placeholder.jpg'}
                          alt={product.productName || 'Product Image'}
                        />
                        <div className="order-item-info">
                          <p><strong>{product.name || 'Unknown Product'}</strong></p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="order-price">
                  <p><strong>Total Price</strong></p>
                  <p>Php {order.totalAmount.toFixed(2)}</p>
                </div>

              <div className="order-status">
                <p><strong>Status</strong></p>
                <button
                  className="order-status-button"
                  style={{
                    backgroundColor: order.orderStatus === 1 ? '#4CAF50' : '#ddd',
                  }}
                  onClick={() => handleOrderStatusChange(order.id, 1)}
                >
                  {order.orderStatus === 1 ? 'Confirmed' : 'Not Confirmed'}
                </button>
              </div>

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Orders;