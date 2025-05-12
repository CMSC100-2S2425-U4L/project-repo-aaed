import React from 'react';
import './AdminShop.css'; // Reuse your existing styles

function ProductDetail({ product, onClose, onEdit }) {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-detail-panel" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} style={{ alignSelf: 'flex-end', marginBottom: '1rem' }}>
          ✕
        </button>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Type: {product.type}</p>
        <p>Stock: {product.stock}</p>
        <p>Php {product.price.toFixed(2)}</p>
        <button onClick={onEdit}>Edit</button>
      </div>
    </div>
  );
}

export default ProductDetail;
