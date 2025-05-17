const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function normalizeProduct(rawProduct) {
  return {
    id: rawProduct._id || rawProduct.id,
    name: rawProduct.productName || rawProduct.name,
    price: rawProduct.productPrice || rawProduct.price,
    imageUrl: rawProduct.productImage
      ? `${API_URL}/uploads/${rawProduct.productImage}`
      : rawProduct.imageUrl || '/src/assets/images/placeholder.jpg',
    type:
      typeof rawProduct.productType === 'number'
        ? (rawProduct.productType === 1 ? 'Crop' : 'Poultry')
        : rawProduct.type || 'Unknown',
    quantity: rawProduct.productQuantity || rawProduct.quantity || 1,
    description: rawProduct.productDescription || rawProduct.description || '',
  };
}
