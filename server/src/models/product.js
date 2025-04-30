import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true, min: 0 },
    productDescription: { type: String, required: true },
    productType: { type: Number, enum: [1, 2], required: true },
    productQuantity: { type: Number, required: true, min: 0 },
    productImage: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema);
export default Product;

