import React, { useState, useEffect } from 'react';
import './CustomerShop.css';
import './CustomerSidebar.css';
import './CustomerOrder.css';
import CustomerSidebar from './CustomerSidebar';
import { useCart } from './CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function CustomerOrder() {
  const [userOrders, setUserOrders] = useState([]);
  const { products, updateOrderStatus } = useCart();
  const PRODUCT_TYPE_MAP = {
    1: 'Crop',
    2: 'Poultry',
  };
  const modeOfPayment = 'Cash On Delivery';

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      try {
        // Use the correct endpoint and params to get orders for this user, with productId populated
        const res = await axios.get(`${API_URL}/orders/user`, { params: { user_id: userId, populate: 'productId' } });
        // Log the first order for debugging
        console.log('Fetched orders:', res.data);
        if (res.data && res.data.length > 0) {
          console.log('First order object:', res.data[0]);
        }
        setUserOrders(res.data);
      } catch (err) {
        setUserOrders([]);
        toast.error('Failed to fetch your orders.');
      }
    };
    fetchOrders();
  }, []);

  const handleCancel = async (orderId, currentStatus) => {
    if (currentStatus === 1) {
      toast.error('Error: Cannot cancel order that is already confirmed.');
      return;
    }
    if (currentStatus === 2) {
      toast.error('Error: Cannot cancel order that is already canceled.');
      return;
    }
    try {
      const res = await axios.put(`${API_URL}/orders/status/${orderId}`, { orderStatus: 2 });
      if (res.data.updated) {
        setUserOrders(prev => prev.map(order => order._id === orderId ? { ...order, orderStatus: 2 } : order));
        toast.success('Order canceled successfully!');
      } else {
        toast.error(res.data.message || 'Failed to cancel order.');
      }
    } catch (err) {
      toast.error('Failed to cancel order.');
    }
  };

  return (
    <div className="admin-shop-container">
      <CustomerSidebar />
      <div className="customer-order-panel">
        <div className="customer-order-grid">
          {userOrders.length === 0 ? (
            <div style={{ padding: '2rem', color: '#888' }}>No orders found.</div>
          ) : (
            userOrders.map((order) => (
              <div key={order._id} className="customer-order-card">
                <div className="customer-order-info">
                  <div className="customer-order-items">
                    <h3>Item:</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      {console.log(`Product Name: ${order.productId.productName}`)}
                      <img className="customer-order-image"
                        src={order.productId && order.productId.productImage ? `${API_URL}/uploads/${order.productId.productImage}` : '/src/assets/images/placeholder.jpg'}
                        alt={order.productId && order.productId.productName ? order.productId.productName : 'Product Image'}
                      />
                      <div className="customer-order-item-info">
                        <p><strong>{order.productId?.productName || 'Unknown Product'}</strong></p>
                        <p>Type: {PRODUCT_TYPE_MAP[order.productId?.productType] || 'Unknown'}</p>
                        <p>Quantity: x{order.quantity}</p>
                        <p>Price: Php {order.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                  <div className="customer-order-id">
                    <p><strong>Order ID: {order._id}</strong></p>
                    <p>Mode of Payment: {modeOfPayment}</p>
                  </div>
                  <div className="customer-order-status">
                    <p>Status: <span style={{ color: order.orderStatus === 1 ? 'green' : order.orderStatus === 2 ? 'red' : 'orange', fontWeight: 'bold' }}>{order.orderStatus === 1 ? 'Paid' : order.orderStatus === 2 ? 'Canceled' : 'Pending'}</span></p>
                    <p className="order-total">Total&nbsp;{order.quantity}&nbsp;Items:&nbsp;Php {order.totalAmount?.toFixed(2)}</p>
                  </div>
                  <button
                    className="order-button"
                    onClick={() => handleCancel(order._id, order.orderStatus)}
                    disabled={order.orderStatus === 1 || order.orderStatus === 2}
                    style={{
                      backgroundColor: order.orderStatus === 1 || order.orderStatus === 2 ? '#ccc' : '#EEBA14',
                      cursor: order.orderStatus === 1 || order.orderStatus === 2 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerOrder;