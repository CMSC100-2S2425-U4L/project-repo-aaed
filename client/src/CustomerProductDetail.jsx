import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './CustomerShop.css';
import './CustomerShop.jsx';
import { normalizeProduct } from './normalizeProduct';

const API_URL = import.meta.env.VITE_API_URL;

const PRODUCT_TYPE_MAP = {
  1: 'Crop',
  2: 'Poultry',
};

const CustomerProductDetail = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
  const normalizedProduct = normalizeProduct(product);
  onAddToCart(normalizedProduct, quantity);
  onClose();
  };

  return (
    <div className="product-detail-panel">
      <img
        src={
          product.productImage
            ? `${API_URL}/uploads/${product.productImage}`
            : '/src/assets/images/placeholder.jpg'
        }
        alt={product.productName}
        className="product-detail-image"
      />

      <h2>{product.productName}</h2>
      <p className="product-description">{product.productDescription}</p>
      <p><strong>Price:</strong> Php {product.productPrice?.toFixed(2)}</p>
      <p><strong>Stock:</strong> {product.productQuantity}</p>
      <p><strong>Type:</strong> {PRODUCT_TYPE_MAP[product.productType] || 'Unknown'}</p>

      <div className="quantity-wrapper">
        <label className="quantity-label">Quantity:</label>
        <div className="quantity-control">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
            <input type="number" value={quantity} readOnly />
            <button onClick={() => setQuantity((q) => Math.min(product.productQuantity, q + 1))}>+</button>
        </div>
      </div>
      <div className="detail-actions">
        <button className="back-button" onClick={onClose}>
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Back
        </button>

        <button
          className="edit-button"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
};

export default CustomerProductDetail;
