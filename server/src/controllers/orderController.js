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
        const { items, email, time, totalAmount } = req.body;

        // All required fields
        if (!items || !email || !time || !totalAmount) {
            await session.abortTransaction();
            return res.status(400).json({ inserted: false, message: "Missing fields" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            await session.abortTransaction();
            return res.status(400).json({ inserted: false, message: "Invalid email format!" });
        }

        // Validate items array
        if (!Array.isArray(items) || items.length === 0) {
            await session.abortTransaction();
            return res.status(400).json({ inserted: false, message: "Items must be a non-empty array!" });
        }

        // Check product availability and validate quantities
        for (const item of items) {
            const product = await Product.findById(item.productId).session(session);
            if (!product) {
                await session.abortTransaction();
                return res.status(400).json({ 
                    inserted: false, 
                    message: `Product with ID ${item.productId} not found` 
                });
            }
            if (item.quantity <= 0 || item.quantity > product.productQuantity) {
                await session.abortTransaction();
                return res.status(400).json({ 
                    inserted: false, 
                    message: `Invalid quantity for product ${product.productName}` 
                });
            }
        }

        // Create new order (status defaults = 0; pending sya)
        const newOrder = new Order({ 
            items, 
            email, 
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

// Get order by ID 
export const getOrder = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "No order ID provided" });
        }

        const order = await Order.findById(id).populate('items.productId').populate('email');

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get orders by email 
export const getOrdersByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "No email provided" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const orders = await Order.find({ email }).populate('items.productId').sort({ dateOrdered: -1 });

        if (orders.length > 0) {
            res.json(orders);
        } else {
            res.status(404).json({ message: "No orders found for this email!" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server Error" });
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

        const order = await Order.findById(id).populate('items.productId').session(session);

        if (!order) {
            await session.abortTransaction();
            return res.status(404).json({ updated: false, message: "Order not found!" });
        }

        // If changing from pending (0) to confirmed (1), update product quantities
        if (order.orderStatus === 0 && orderStatus === 1) {
            for (const item of order.items) {
                const product = item.productId;
                if (product.productQuantity < item.quantity) {
                    await session.abortTransaction();
                    return res.status(400).json({ 
                        updated: false, 
                        message: `Insufficient quantity for product ${product.productName}` 
                    });
                }
                product.productQuantity -= item.quantity;
                await product.save({ session });
            }
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
        const { sortKey, sortDirection, orderStatus, email } = req.query;
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
  
        // Custom sorting if meron
        if (sortKey && sortDirection) {
            sort = { [sortKey]: sortDirection === 'asc' ? 1 : -1 };
        }

        const orders = await Order.find(filter)
            .populate('items.productId')
            .populate('email')
            .sort(sort);

        res.json(orders);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
};

// https://mongoosejs.com/docs/transactions.html