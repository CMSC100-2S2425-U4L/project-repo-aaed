// CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add item to cart or update quantity if already exists
    const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
        const exists = prev.find(item => item.id === product.id);
        if (exists) {
        return prev.map(item =>
            item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        }
        return [...prev, { ...product, quantity }];
    });
    };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};  

export function useCart() {
  return useContext(CartContext);
}

