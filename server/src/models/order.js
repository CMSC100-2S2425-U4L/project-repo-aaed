import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' }, // Single product reference
    quantity: { type: Number, required: true, min: 1 },
    orderStatus: { type: Number, enum: [0, 1, 2], default: 0 },
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, // Use user_id instead of email
    dateOrdered: { type: Date, default: Date.now },
    time: { type: String, required: true },
    totalAmount: { type: Number, required: true, min: 0 }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
