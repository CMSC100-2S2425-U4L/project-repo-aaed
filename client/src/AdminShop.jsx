import React, { useState } from 'react';
import './AdminShop.css'; // You'll style sidebar, cards, modal here
import ProductDetail from './ProductDetail'; // Adjust path if needed
import ProductFormModal from './ProductFormModal'; // Adjust path as needed



function AdminShop() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products = [
    {
      id: 1,
      name: 'Chicken Eggs',
      price: 7.00,
      type: 'Poultry',
      stock: 13579,
      description: 'Farm fresh eggs',
      image: '/src/assets/images/eggs.jpg'
    },
    // Add more products
  ];

  const openProductDetail = (product) => setSelectedProduct(product);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
            <div key={product.id} className="product-card" onClick={() => openProductDetail(product)}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Php {product.price.toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
            </div>
          ))}
        </div>
      </main>

      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onEdit={openModal}
      />
      

      {isModalOpen && (
        <ProductFormModal
          mode={selectedProduct ? 'edit' : 'add'}
          product={selectedProduct}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={(formData) => {
            if (selectedProduct) {
              // update logic
            } else {
              // add logic
            }
          }}
        />
      )}

      
    </div>
    
  );
}

export default AdminShop;
