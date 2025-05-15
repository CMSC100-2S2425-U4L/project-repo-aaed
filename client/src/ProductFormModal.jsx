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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit Product' : 'Add Product'}</h2>

        <div className="image-upload">
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
              <FaPlus size={24} />
              <span>Add a photo</span>
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
            </label>
          )}
        </div>

        <div className="form-fields-container">
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

          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field"
            minLength={1}
            maxLength={15}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(e.target.value)}
            onInput={e => {
              e.target.value = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
            }}
            className="input-field"
            min={0}
            step="any"
            inputMode="decimal"
            pattern="^\d*\.?\d*$"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={e => setStock(e.target.value)}
            onInput={e => {
              // Remove non-numeric characters
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
            }}
            className="input-field"
            min={0}
            step={1}
            inputMode="numeric"
            pattern="^\d*$"
            required
          />
        </div>

        <button
          onClick={handleSubmit}
          className="submit-button"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default ProductFormModal;