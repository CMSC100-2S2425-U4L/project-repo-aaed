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

  // Fetch products from backend API using axios
  const fetchProducts = () => {
    axios.get(`${API_URL}/product`)
    .then(res => {
      console.log('API response:', res.data); // <--- Important
      setProducts(res.data);
  })

  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openProductDetail = (product) => setSelectedProduct(product);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDeleteProduct = async (product) => {
    try {
      await axios.delete(`${API_URL}/product/delete/${product._id}`);
      setProducts(products.filter(p => p._id !== product._id));
      setSelectedProduct(null);
    } catch (err) {
      alert('Failed to delete product.');
      console.error(err);
    }
  };

  return (
    <div className="admin-shop-container">
      <Sidebar />
      <main className="product-panel">
        <button className="add-product-btn" onClick={openModal}>+ Add a Product</button>

        <div className="product-grid">
          {products.map(product => (
            <div key={product._id} className="product-card" onClick={() => openProductDetail(product)}>
              <img
                src={
                  product.productImage
                    ? `${API_URL}/uploads/${product.productImage}`
                    : '/src/assets/images/placeholder.jpg'
                }
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
        onEdit={openModal}
        onDelete={handleDeleteProduct}
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
