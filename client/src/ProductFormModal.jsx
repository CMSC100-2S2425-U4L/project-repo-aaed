import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit } from 'react-icons/fa';
import './ProductFormModal.css';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function ProductFormModal({ mode, product, onClose, onSave }) {
  const isEdit = mode === 'edit';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [type, setType] = useState(1); // Default to 1 (Crop)
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isEdit && product) {
      setName(product.productName || '');
      setDescription(product.productDescription || '');
      setPrice(product.productPrice || '');
      setStock(product.productQuantity || '');
      setType(product.productType || 1);
      // Set image preview if available (for edit mode)
      if (product.productImage) {
        setImagePreview(`${API_URL}/uploads/${product.productImage}`);
      } else {
        setImagePreview(null);
      }
      setImage(null); // Reset file input
    } else {
      // Clear form for add mode
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setType(1); // Default to Crop
      setImage(null);
      setImagePreview(null);
    }
  }, [isEdit, product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('productName', name);
      formData.append('productDescription', description);
      formData.append('productPrice', price);
      formData.append('productQuantity', stock);
      formData.append('productType', type);

      if (image) {
        formData.append('productImage', image);
      } else if (isEdit && product && product.productImage) {
        formData.append('productImage', product.productImage);
      }

      // Log FormData contents for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      let response;
      if (isEdit) {
        response = await axios.put(`${API_URL}/product/edit/${product._id}`, formData);
      } else {
        response = await axios.post(`${API_URL}/product/add`, formData);
      }

      // Check if the request was successful
      if (response.data) {
        // Pass the updated/created product back to the parent component
        onSave(response.data);
        onClose();
      }
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  return (
    <div className="product-modal-overlay" onClick={onClose}>
      <div className="product-modal-content" onClick={(e) => e.stopPropagation()}> 

        <div className="image-upload">
          <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>

          {imagePreview ? (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <label className="edit-photo">
                <FaEdit />
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              </label>
            </div>
          ) : (
            <label className="image-placeholder">
              <FaPlus size={30} />
              <span>Add a photo</span>
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          )}

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="product-input-field"
          />
        </div>

        <div className="product-form-fields-container">

          <h3>Add Description</h3>
          
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="product-input-field"
            minLength={1}
            maxLength={15}
            required
          /> 
          
          <h3>Set Price and Quantity</h3>
          <div className="product-price-quantity-container">
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="product-input-field"
              required
            />

            <input
              type="number"
              placeholder="Quantity"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="product-input-field"
              required
            />
          </div>

          <div className="product-type-selection">

            <label className="type-label">Product Type:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="productType"
                  value={1}
                  checked={type === 1}
                  onChange={() => setType(1)}
                />
                Crop
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="productType"
                  value={2}
                  checked={type === 2}
                  onChange={() => setType(2)}
                />
                Poultry
              </label>
            </div>
          </div>
        
          <button
            onClick={handleSubmit}
            className="product-submit-button"
          >
            Save
          </button>

        </div>
      </div>
    </div>
  );
}

export default ProductFormModal;