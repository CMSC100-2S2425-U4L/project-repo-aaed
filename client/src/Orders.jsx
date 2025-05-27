import React, { useState, useEffect } from 'react';
import './CustomerShop.css';
import './Sidebar.css';
import './Orders.css';
import Sidebar from './Sidebar';
import { useCart } from './CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { products } = useCart();
  const API_URL = import.meta.env.VITE_API_URL;

  const PRODUCT_TYPE_MAP = {
    1: 'Crop',
    2: 'Poultry',
  };


  useEffect(() => {
    setLoading(true);
    axios.get(`${API_URL}/orders`, { params: { populate: 'productId' } })
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        setOrders([]);
        setLoading(false);
      });
  }, [API_URL]);

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
  };

  const handleConfirm = async (orderId, currentStatus) => {
    if (currentStatus === 1) {  //confirmed
      toast.error("Error: Cannot confirm order that is already confirmed.");
      return;
    }
    if (currentStatus == 2) { //canceled
      toast.error("Error: Cannot confirm order that is already canceled.");
      return;
    }
    try {
      const res = await axios.put(`${API_URL}/orders/status/${orderId}`, { orderStatus: 1 });
      if (res.data.updated) {
        setOrders(prevOrders => prevOrders.map(order => order._id === orderId ? { ...order, orderStatus: 1 } : order));
        toast.success("Order confirmed successfully!");
      } else {
        toast.error(res.data.message || "Failed to confirm order.");
      }
    } catch (err) {
      toast.error("Failed to confirm order.");
    }
  }

  return (
    < div className="admin-shop-container" >
      {console.log(orders)}

      <Sidebar />
      <div className="order-panel">
        <div className="order-grid">
          {loading ? (
            <div>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div>No orders found.</div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-info">

                  <div className="order-date">
                    <p><strong>Date</strong></p>
                    <p>{new Date(order.dateOrdered).toLocaleDateString()}</p>
                  </div>

                  <div className="order-id">
                    <p><strong>Order ID</strong></p>
                    <p>{order._id}</p>
                  </div>

                  <div className="order-items">
                    <p><strong>Product</strong></p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                      <img
                        className="order-image"
                        src={order.productId && order.productId.productImage ? `${API_URL}/uploads/${order.productId.productImage}` : '/src/assets/images/placeholder.jpg'}
                        alt={order.productId && order.productId.productName ? order.productId.productName : 'Product Image'}
                      />
                      <div className="order-item-info">
                        <p><strong>{order.productId?.productName || 'Unknown Product'}</strong></p>
                        <p>Type: {PRODUCT_TYPE_MAP[order.productId?.productType] || 'Unknown'}</p>
                        <p>Quantity: {order.quantity}</p>
                      </div>
                    </div>
                  </div>

                  <div className="order-price">
                    <p><strong>Total Price</strong></p>
                    <p>Php {order.totalAmount?.toFixed(2)}</p>
                  </div>

                  <div className="order-status">
                    <p><strong>Status</strong></p>
                    <button
                      className="order-status-button"
                      onClick={() => handleConfirm(order._id, order.orderStatus)}
                      disabled={order.orderStatus === 1 || order.orderStatus === 2}
                      style={{
                        backgroundColor: order.orderStatus === 1 ? '#4CAF50' : order.orderStatus === 2 ? '#ED4C4C' : '#EEBA14',
                        cursor: order.orderStatus === 1 || order.orderStatus === 2 ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {order.orderStatus === 1 ? 'Confirmed' : order.orderStatus === 2 ? 'Canceled' : 'Confirm'}
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div >
  );
}

export default Orders;