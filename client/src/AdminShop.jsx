import React, { useState, useEffect } from 'react';
import './AdminShop.css';
import ProductDetail from './ProductDetail';
import ProductFormModal from './ProductFormModal';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function AdminShop() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products from backend API using axios
  const fetchProducts = () => {
    axios.get(`${API_URL}/product`)
      .then(res => setProducts(res.data))
      .catch(err => console.error('Failed to fetch products:', err));
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
      <aside className="sidebar">
        <h2>AgriMart</h2>
        <nav>
          <ul>
            <li>Dashboard</li>
            <li className="active">Products</li>
            <li>Users</li>
            <li>Orders</li>
            <li>Sales</li>
          </ul>
        </nav>
      </aside>

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
