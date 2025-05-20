import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const addToCart = (product, quantity = 1) => {
    // setCartItems(prev => {
    //   const existing = prev.find(item => item.id === product.id);
    //   if (existing) {
    //     const maxQty = existing.stock || product.stock || product.quantity || Infinity;
    //     const newQuantity = Math.min(existing.quantity + quantity, maxQty);
    //     return prev.map(item =>
    //       item.id === product.id
    //         ? { ...item, quantity: newQuantity }
    //         : item
    //     );
    //   }
    //   return [...prev, { ...product, quantity: Math.min(quantity, product.quantity), stock: product.quantity }];
    // });


    let added = true;

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      const stock = product.stock || product.quantity || Infinity;  //checks stock

      if(existing) {
        const newQuantity = existing.quantity + quantity;
        if(newQuantity > stock){
          added = false;
          return prev;  //do not update if stock is exceeded
        }

        return prev.map(item => item.id === product.id ? { ...item, quantity: newQuantity, stock } : item
        );
      }


      if(quantity > stock){
        added = false;
        return prev;
      }

      //save product info
      setProducts(prevProducts => ({
        ...prevProducts,
        [product.id]: {
          name: product.name,
          price: product.price,
          type: product.type,
          quantity: product.quantity,
          image: product.image
        },
      }))

      return [...prev, { ...product, quantity, stock }];
    });

    return added;
  };

  //add order
  const addOrder = (order) => {
    setOrders(prev => [...prev, order]);
  }

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, orders, addOrder, products }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
