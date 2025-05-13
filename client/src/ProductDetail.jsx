import React from 'react';
import './AdminShop.css';
import { FaArrowLeft } from 'react-icons/fa';

function ProductDetail({ product, onClose, onEdit }) {
  if (!product) return null;

  return (
    <div className="product-detail-panel">
      <img
        src={product.image}
        alt={product.name}
        className="product-detail-image"
      />
      <h2>{product.name}</h2>
      <p className="product-description">{product.description}</p>
      <p><strong>Price:</strong> Php {product.price.toFixed(2)}</p>
      <p><strong>Stock:</strong> {product.stock}</p>
      <p><strong>Type:</strong> {product.type}</p>

      <div className="detail-actions">
        <button className="back-button" onClick={onClose}>
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Back
        </button>
        <button className="edit-button" onClick={onEdit}>
          Edit Product
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
