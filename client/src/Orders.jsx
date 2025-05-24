import React, { useState } from 'react';
import './CustomerShop.css';
import './Sidebar.css';
import './CustomerOrder.css';
import Sidebar from './Sidebar';
import { useCart } from './CartContext';

function Orders() {
  const { orders, setOrders, products } = useCart();
  const PRODUCT_TYPE_MAP = {
  1: 'Crop',
  2: 'Poultry',
  };
  const modeOfPayment = "Cash On Delivery";

  return (
    <div className="admin-shop-container">
      <Sidebar />
      <div className="customer-order-panel">
        <div className="customer-order-grid">
          {orders.map((order) => (
            <div key={order.id} className="customer-order-card">
              <div className="customer-order-info">

                <div className="customer-order-items">
                  <h3>Items:</h3>
                  {order.items.map((item, index) => {
                    const product = products[item.productId] || {};
                    return (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <img className = "customer-order-image"
                          src={product.productImage || '/src/assets/images/placeholder.jpg'}
                          alt={product.name || 'Product Image'}
                        />
                        <div className="customer-order-item-info">
                          <p><strong>{product.name || 'Unknown Product'}</strong></p>
                          <p>Type: {PRODUCT_TYPE_MAP[product.type] || product.type || 'Unknown'}</p>
                          <p>Quantity: x{item.quantity}</p>
                          <p>Price: Php {item.quantity * product.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="customer-order-id">
                  <p><strong>Order ID: {order.id}</strong></p>
                  <p>Mode of Payment: {modeOfPayment}</p>
                </div>
                

                <div className="customer-order-status">
                  <p style={{ color: order.orderStatus === 1 ? 'green' : 'red', fontWeight: 'bold' }}>
                    Status: {order.orderStatus === 1 ? 'Paid' : 'Pending'}
                  </p>

                  <p className="order-total">Total&nbsp;{order.items.reduce((total, item) => total + item.quantity, 0)}&nbsp;Items:&nbsp;Php {order.totalAmount.toFixed(2)}</p>
                </div>

                <button className="order-button">Cancel</button>
              </div>
            </div>
          ))} 
        </div>
      </div>
    </div>
  );
}

export default Orders;