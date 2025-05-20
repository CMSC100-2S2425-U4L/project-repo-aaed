import React, { useState } from 'react';
import './CustomerShop.css';
import './CustomerSidebar.css';
import './CustomerOrder.css';
import CustomerSidebar from './CustomerSidebar';
import { useCart } from './CartContext';

function CustomerOrder() {
  const { orders, setOrders, products } = useCart();
  const PRODUCT_TYPE_MAP = {
  1: 'Crop',
  2: 'Poultry',
  };
  const modeOfPayment = "Cash On Delivery";

  return (
    <div className="admin-shop-container">
      <CustomerSidebar />
      <div className="order-panel">
        <div className="order-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-info">
                <h3>Order ID: {order.id}</h3>
                <p>Mode of Payment: {modeOfPayment}</p>
                <p>Status: {order.orderStatus === 1 ? 'Paid' : 'Pending'}</p>
                <h4>Items:</h4>

                {order.items.map((item, index) => {
                  const product = products[item.productId] || {};
                  return (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <img
                        src={product.imageUrl || '/src/assets/images/placeholder.jpg'}
                        alt={product.name || 'Product Image'}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px' }}
                      />
                      <div>
                        <p><strong>{product.name || 'Unknown Product'}</strong></p>
                        <p>Type: {PRODUCT_TYPE_MAP[product.type] || product.type || 'Unknown'}</p>
                        <p>Quantity: x{item.quantity}</p>
                        <p>Price: Php {item.quantity * product.price}</p>
                      </div>
                    </div>
                  );
                })}
                
                <p>Total {order.items.reduce((total, item) => total + item.quantity, 0)} 
                  Items: Php {order.totalAmount.toFixed(2)}</p>
                <button className="add-to-cart-btn">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomerOrder;