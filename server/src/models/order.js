import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    transactionId: { type: String, required: true, unique: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    orderStatus: { type: Number, enum: [0, 1, 2], default: 0 },
    email: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    dateOrdered: { type: Date, default: Date.now },
    time: { type: String, required: true },
    totalAmount: { type: Number, required: true, min: 0 }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
