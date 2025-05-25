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

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id == orderId) {

          if(newStatus == 2) { // if order is canceled

            setCartItems(prevItems =>
              prevItems.map(item => {
                const orderItem =  order.items.find(i => i.productId == item.id);

                if (orderItem) {
                  return { ...item, stock: item.stock + orderItem.quantity,
                    quantity: Math.min(item.quantity + orderItem.quantity, item.stock)};
                }

                return item;
              })
            );
            
            //update products
            setProducts( prevProducts => {
              const updatedProducts = { ...prevProducts };
              order.items.forEach(item => {
                if (updatedProducts[item.productId]) {
                  updatedProducts[item.productId] = {
                    ...updatedProducts[item.productId],
                    quantity: updatedProducts[item.productId].quantity + item.quantity,
                  };
                }
            });

            return updatedProducts;
          });
          }

          return { ...order, orderStatus: newStatus };
        }

        return order;
      })
    );

    return true;
  }

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, orders, addOrder, products , updateOrderStatus}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
