import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit } from 'react-icons/fa';
import './ProductFormModal.css';

function ProductFormModal({ mode, product, onClose, onSave }) {
  const isEdit = mode === 'edit';

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isEdit && product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setStock(product.stock);
      setType(product.type);
      setImagePreview(product.image);
    } else {
      // Clear form for add mode
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setType('');
      setImage(null);
      setImagePreview(null);
    }
  }, [isEdit, product]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    const formData = {
      name,
      description,
      price,
      stock,
      type,
      image, // You might convert this to base64 or send FormData in a real app
    };
    onSave(formData);
    onClose();
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
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Type (e.g., Poultry)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input-field"
        />

        <button onClick={handleSubmit} className="submit-button">
          Save
        </button>
      </div>
    </div>
  );
}

export default ProductFormModal;
