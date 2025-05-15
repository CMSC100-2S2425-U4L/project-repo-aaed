import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true, min: 0 },
    productDescription: { type: String, required: true },
    productType: { type: Number, enum: [1, 2], required: true },
    productQuantity: { type: Number, required: true, min: 0 },
    // Store the GridFS filename of the uploaded image
    productImage: { type: String, required: true }
});

const Product = mongoose.model('Product', productSchema, 'products');
export default Product;

