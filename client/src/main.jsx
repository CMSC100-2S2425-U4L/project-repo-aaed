import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { CartProvider } from './CartContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>  {/* <-- Wrap App with CartProvider here */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
