// import React, { useState } from 'react';
import './AdminShop.css';
import ProductDetail from './ProductDetail';
import ProductFormModal from './ProductFormModal';
import Sidebar from './Sidebar';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import React, { useState, useEffect } from 'react';



function AdminShop() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState({ key: '', direction: '' });
  const PRODUCT_TYPE_MAP = {
    1: 'Crop',
    2: 'Poultry',
  };

  const fetchProducts = async (sort = sortOption) => {
    const params = {};
    if (sort.key && sort.direction) {
      params.sortKey = sort.key;
      params.sortDirection = sort.direction;
    }
    if (sort.key === 'productType' && sort.value) {
      params.productType = Object.keys(PRODUCT_TYPE_MAP).find(
        k => PRODUCT_TYPE_MAP[k] === sort.value
      );
    }
    const res = await axios.get(`${API_URL}/product/`, { params });
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    fetchProducts(sortOption);
    // eslint-disable-next-line
  }, [sortOption]);

  // Ensure fetchProducts is called after closing the modal (add/edit)
  const handleSave = () => {
    fetchProducts(sortOption);
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Ensure fetchProducts is called after deleting a product
  const handleDelete = async () => {
    await axios.delete(`${API_URL}/product/delete/${selectedProduct._id}`);
    fetchProducts(sortOption);
    setSelectedProduct(null);
  };

  return (
    <div className="admin-shop-container">
      <Sidebar onSortChange={setSortOption} />
      {console.log(sortOption)}
      <main className="product-panel">
        <button className="add-product-btn" onClick={() => setIsModalOpen(true)}>+ Add a Product</button>

        <div className="product-grid">
          {products.map(product => (
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
              <span className="product-type-badge">
                {PRODUCT_TYPE_MAP[product.productType] || 'Unknown'}
              </span>
            </div>
          ))}
        </div>
      </main>

      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onEdit={() => setIsModalOpen(true)}
        onDelete={handleDelete}
      />

      {isModalOpen && (
        <ProductFormModal
          mode={selectedProduct ? 'edit' : 'add'}
          product={selectedProduct}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default AdminShop;
