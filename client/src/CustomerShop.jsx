// import React, { useState } from 'react';
import './CustomerShop.css';
import ProductFormModal from './ProductFormModal';
import CustomerSidebar from './CustomerSidebar';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
import React, { useState, useEffect } from 'react';
import CustomerProductDetail from './CustomerProductDetail';
import { useCart } from './CartContext';
import { normalizeProduct } from './normalizeProduct';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function CustomerShop() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState({ key: '', direction: '' });
  const PRODUCT_TYPE_MAP = {
    1: 'Crop',
    2: 'Poultry',
  };
  const { addToCart } = useCart();
  const navigate = useNavigate();
  // Always get isLoggedIn fresh from localStorage to avoid stale value
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const fetchProducts = () => {
    axios.get(`${API_URL}/product`)
      .then(res => {
        setProducts(res.data);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const sortedProducts = (() => {
    const { key, direction, value } = sortOption;

    if (key === 'productType' && value) {
      // Instead of matching string directly, find key by value and filter by number
      const typeKey = Object.keys(PRODUCT_TYPE_MAP).find(k => PRODUCT_TYPE_MAP[k] === value);
      return products.filter(product => String(product.productType) === String(typeKey));
    }

    if (key && direction) {
      return [...products].sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return products;
  })();

  return (
    <div className="admin-shop-container" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 90px)' }}>
      <CustomerSidebar onSortChange={setSortOption} />

      <main className="product-panel">
        <div className="product-grid">
          {sortedProducts.map(product => (
            <div key={product._id} className="product-card">
              <div onClick={() => setSelectedProduct(product)}>
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

              <button
                className="add-to-cart-btn"
                disabled={product.productQuantity === 0}
                style={product.productQuantity === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                onClick={(e) => {
                  e.stopPropagation();
                  // Re-check isLoggedIn at click time
                  if (localStorage.getItem('isLoggedIn') !== 'true') {
                    // Instead of navigating, show the sign-in modal
                    window.dispatchEvent(new CustomEvent('show-signin-modal'));
                    return;
                  }
                  const normalizedProduct = normalizeProduct(product);
                  const addedToCart = addToCart(normalizedProduct, 1);
                  if (addedToCart) {
                    toast.success(`Added 1 x ${normalizedProduct.name} to cart`);
                  } else {
                    toast.error(`Failed to add 1 x ${normalizedProduct.name} to cart: stock exceeded`);
                  }
                }}
              >
                {product.productQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* {selectedProduct && (
            <CustomerProductDetail
                product={{
                ...selectedProduct,
                name: selectedProduct.productName,
                type: PRODUCT_TYPE_MAP[selectedProduct.productType],
                price: selectedProduct.productPrice,
                quantity: selectedProduct.productQuantity,
                imageUrl: selectedProduct.productImage
                    ? `${API_URL}/uploads/${selectedProduct.productImage}`
                    : '/src/assets/images/placeholder.jpg',
                description: selectedProduct.productDescription || 'No description available.',
                }}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={(product, quantity) => {
                console.log(`Added ${quantity} x ${product.name} to cart`);
                //cart logic
                }}
            />
            )} */}

      {selectedProduct && (
        <CustomerProductDetail
          product={{
            ...selectedProduct,
            name: selectedProduct.productName,
            type: PRODUCT_TYPE_MAP[selectedProduct.productType],
            price: selectedProduct.productPrice,
            quantity: selectedProduct.productQuantity,
            imageUrl: selectedProduct.productImage
              ? `${API_URL}/uploads/${selectedProduct.productImage}`
              : '/src/assets/images/placeholder.jpg',
            description: selectedProduct.productDescription || 'No description available.',
          }}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, quantity) => {
            // Re-check isLoggedIn at click time
            if (localStorage.getItem('isLoggedIn') !== 'true') {
              navigate('/signin');
              return;
            }
            addToCart(product, quantity);
            toast.success(`Added ${quantity} x ${product.name} to cart`);
          }}
        />
      )}

      {isModalOpen && (
        <ProductFormModal
          // mode={selectedProduct ? 'edit' : 'add'}
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


export default CustomerShop;
