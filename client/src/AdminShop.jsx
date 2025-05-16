// import React, { useState } from 'react';
import './AdminShop.css'; // You'll style sidebar, cards, modal here
import ProductDetail from './ProductDetail'; // Adjust path if needed
import ProductFormModal from './ProductFormModal'; // Adjust path as needed
import Sidebar from './Sidebar';
import axios from 'axios';
const API_URL = 'http://localhost:3000';
import React, { useState, useEffect } from 'react';



function AdminShop() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState({ key: '', direction: '' });

  const fetchProducts = () => {
    axios.get(`${API_URL}/product`)
      .then(res => {
        setProducts(res.data);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    const { key, direction } = sortOption;
    if (!key || !direction) return 0;

    let valA = a[key];
    let valB = b[key];

    // If sorting by name/type, make sure it's case-insensitive
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return direction === 'asc' ? -1 : 1;
    if (valA > valB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="admin-shop-container">
      <Sidebar onSortChange={setSortOption} />
      <main className="product-panel">
        <button className="add-product-btn" onClick={() => setIsModalOpen(true)}>+ Add a Product</button>

        <div className="product-grid">
          {sortedProducts.map(product => (
            <div key={product._id} className="product-card" onClick={() => setSelectedProduct(product)}>
              <img
                src={product.productImage
                  ? `${API_URL}/uploads/${product.productImage}`
                  : '/src/assets/images/placeholder.jpg'}
                alt={product.productName}
              />
              <h3>{product.productName}</h3>
              <p>Php {product.productPrice?.toFixed(2)}</p>
              <p>Stock: {product.productQuantity}</p>
            </div>
          ))}
        </div>
      </main>

      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onEdit={() => setIsModalOpen(true)}
        onDelete={async () => {
          await axios.delete(`${API_URL}/product/delete/${selectedProduct._id}`);
          setProducts(products.filter(p => p._id !== selectedProduct._id));
          setSelectedProduct(null);
        }}
      />

      {isModalOpen && (
        <ProductFormModal
          mode={selectedProduct ? 'edit' : 'add'}
          product={selectedProduct}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={() => {
            fetchProducts();
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}


export default AdminShop;
