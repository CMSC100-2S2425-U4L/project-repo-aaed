import React, { useState, useEffect } from 'react';
import './Cart.css';
import { useCart } from './CartContext';

const Cart = () => {
  const { cartItems, setCartItems } = useCart();

  const [quantities, setQuantities] = useState(() =>
    cartItems.reduce((acc, item) => {
      acc[item.id] = item.quantity || 1;
      return acc;
    }, {})
  );

  useEffect(() => {
    setQuantities(
      cartItems.reduce((acc, item) => {
        acc[item.id] = item.quantity || 1;
        return acc;
      }, {})
    );
  }, [cartItems]);

  const [checkedItems, setCheckedItems] = useState(new Set(cartItems.map(item => item.id)));

  useEffect(() => {
    setCheckedItems(prevChecked => {
      const newChecked = new Set();
      cartItems.forEach(item => {
        if (prevChecked.has(item.id)) newChecked.add(item.id);
      });
      return newChecked;
    });
  }, [cartItems]);

  const handleQuantityChange = (id, amount) => {
    // setQuantities(prev => {
    //   const item = cartItems.find(item => item.id === id);
    //   const maxQty = item?.quantity || Infinity;
    //   const newQty = Math.min(Math.max((prev[id] || 1) + amount, 1), maxQty);

    //   const updated = { ...prev, [id]: newQty };

    //   setCartItems(prevItems =>
    //     prevItems.map(item =>
    //       item.id === id ? { ...item, quantity: newQty } : item
    //     )
    //   );

    //   return updated;
    // });


    //use stock amount for maxQty
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.id === id) {
          const maxQty = item.stock || Infinity;
          const currentQty = item.quantity || 1;
          const newQty = Math.max(1, Math.min(currentQty + amount, maxQty));
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const toggleChecked = (id) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleDelete = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const checkedCartItems = cartItems.filter(item => checkedItems.has(item.id));

  // const subtotal = checkedCartItems.reduce(
  //   (sum, item) => sum + (item.price * (quantities[item.id] || 1)),
  //   0
  // );

  //fixed prices based on current quantity
  const subtotal = checkedCartItems.reduce(
    (sum, item) => sum + (item.price * (item.quantity || 1)),
    0
  );

  return (
    <div className="admin-shop-container">
      <div className="cart-content">
        <div className="order-details">
          {cartItems.map(item => (
            <div key={item.id} className="order-card">
              <img src={item.imageUrl || item.image} alt={item.name} className="product-image" />
              <div className="product-info">
                <strong>{item.name}</strong>
                <div className="product-type">{item.type}</div>
              </div>
              <div className="quantity-controls">
                <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                <span>{quantities[item.id]}</span>
                <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
              </div>
              <div className="product-price">
                <input
                  type="checkbox"
                  checked={checkedItems.has(item.id)}
                  onChange={() => toggleChecked(item.id)}
                />
                <div className="price-breakdown">
                  Php {item.price} x {quantities[item.id]}
                </div>
                <div className="price-total">
                  Php {item.price * quantities[item.id]}
                </div>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <p>Cart Items: {checkedCartItems.length}</p>
          <p>Subtotal: Php {subtotal.toFixed(2)}</p>
          <div className="checkout-section">
            <p className="total">
              Total: <span className="pill">Php {subtotal.toFixed(2)}</span>
            </p>
            <button className="checkout-button" disabled={checkedCartItems.length === 0}>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
