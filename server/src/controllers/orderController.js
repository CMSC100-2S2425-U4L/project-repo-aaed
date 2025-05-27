import Order from '../models/order.js';
import Product from '../models/product.js';
import mongoose from 'mongoose';
import validator from 'validator';

// Save a new order 
export const saveOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        // Get order details
        const { productId, quantity, user_id, time, totalAmount } = req.body;

        // All required fields
        if (!productId || !user_id || !time || !totalAmount || !quantity) {
            await session.abortTransaction();
            return res.status(400).json({ inserted: false, message: "Missing fields" });
        }

        // Validate quantity
        if (quantity <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ inserted: false, message: "Invalid quantity" });
        }

        // Check product existence (but do not deduct stock yet)
        const product = await Product.findById(productId).session(session);
        if (!product) {
            await session.abortTransaction();
            return res.status(400).json({ inserted: false, message: `Product with ID ${productId} not found` });
        }
        // Do not check for stock or deduct here

        // Create new order
        const newOrder = new Order({
            productId,
            quantity,
            user_id,
            time,
            totalAmount
        });
        await newOrder.save({ session });
        await session.commitTransaction();
        res.status(201).json({ inserted: true, order: newOrder });
    } catch (e) {
        await session.abortTransaction();
        console.error('Order failed!:', e);
        res.status(500).json({ inserted: false, message: "Server Error during transaction" });
    } finally {
        session.endSession();
    }
};

// Update order status 
export const updateOrderStatus = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        if (!id || (orderStatus !== 0 && orderStatus !== 1 && orderStatus !== 2)) {
            await session.abortTransaction();
            return res.status(400).json({
                updated: false,
                message: "Missing order ID or invalid status"
            });
        }

        // Find the order to approve
        const order = await Order.findById(id).session(session);
        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({ updated: false, message: "Order not found!" });
        }

        // Only check/deduct stock if approving (pending -> confirmed)
        if (order.orderStatus === 0 && orderStatus === 1) {
            // Get the product
            const product = await Product.findById(order.productId).session(session);
            if (!product) {
                await session.abortTransaction();
                return res.status(404).json({ updated: false, message: "Product not found!" });
            }

            // Calculate total reserved (pending) quantity for this product, excluding this order
            const pendingOrders = await Order.find({
                productId: order.productId,
                orderStatus: 0,
                _id: { $ne: order._id }
            }).session(session);
            const reservedQty = pendingOrders.reduce((sum, o) => sum + o.quantity, 0);
            const availableQty = product.productQuantity - reservedQty;

            if (order.quantity > availableQty) {
                // Remove this order and abort
                await Order.deleteOne({ _id: order._id }, { session });
                await session.commitTransaction();
                return res.status(400).json({ updated: false, message: "Order removed: not enough stock left after other pending orders were approved." });
            }

            // Deduct stock
            product.productQuantity -= order.quantity;
            await product.save({ session });
        }

        // Update order status
        order.orderStatus = orderStatus;
        await order.save({ session });

        await session.commitTransaction();
        res.json({ updated: true, message: "Order status updated!", order });
    } catch (e) {
        await session.abortTransaction();
        console.error('Order status update failed:', e);
        res.status(500).json({ updated: false, message: "Server Error during transaction" });
    } finally {
        session.endSession();
    }
};

// Get all orders 
export const getAllOrders = async (req, res) => {
    try {
        const { sortKey, sortDirection, orderStatus, email, user_id, populate } = req.query;
        let filter = {};
        let sort = { dateOrdered: -1 }; // Default sort by newest first

        // Filter by status if meron
        if (orderStatus) {
            filter.orderStatus = Number(orderStatus);
        }

        // Filter by email if meron
        if (email) {
            filter.email = email;
        }

        // Filter by user_id if meron
        if (user_id) {
            filter.user_id = user_id;
        }

        // Custom sorting if meron
        if (sortKey && sortDirection) {
            sort = { [sortKey]: sortDirection === 'asc' ? 1 : -1 };
        }

        let query = Order.find(filter).sort(sort);
        // Fix: Only call populate if the field exists in the schema and the param is present
        if (populate && populate === 'productId') {
            query = query.populate('productId');
        }
        const orders = await query;
        res.json(orders);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

// Get orders by user ID (not email)
export const getOrdersByUser = async (req, res) => {
    try {
        const { user_id, populate } = req.query;
        if (!user_id) {
            return res.status(400).json({ message: "No user ID provided" });
        }
        let query = Order.find({ user_id }).sort({ dateOrdered: -1 });
        if (populate === 'productId') {
            query = query.populate('productId');
        }
        const orders = await query;
        if (orders.length > 0) {
            res.json(orders);
        } else {
            res.status(404).json({ message: "No orders found for this user!" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server Error" });
    }
};

// https://mongoosejs.com/docs/transactions.html