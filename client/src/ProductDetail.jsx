import React from 'react';
import './AdminShop.css';
import { FaArrowLeft } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_URL;
const PRODUCT_TYPE_MAP = {
  1: 'Crop',
  2: 'Poultry',
};

function ProductDetail({ product, onClose, onEdit, onDelete }) {
  if (!product) return null;

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


      <div className="detail-actions">
        <button className="back-button" onClick={onClose}>
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Back
        </button>
        <button className="edit-button" onClick={onEdit}>
          Edit Product
        </button>
        <button
          className="delete-button"
          style={{
            backgroundColor: '#e74c3c',
            color: '#fff',
            marginLeft: '0.5rem'
          }}
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this product?')) {
              onDelete(product);
            }
          }}
        >
          Delete Product
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
