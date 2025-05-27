// // src/routes/orderRoute.js
// import express from 'express';
// import Order from '../models/Order.js'; // Use .js if using ES modules

// const router = express.Router();

// router.post('/', async (req, res) => {
//   console.log('Received order:', req.body);
//   try {
//     const newOrder = new Order(req.body);
//     await newOrder.save();
//     res.status(201).json(newOrder);
//   } catch (err) {
//     console.error("Order saving failed:", err); // Log the actual error
//     res.status(500).json({ message: 'Failed to save order', error: err.message });
//     }

// });

// export default router;
// import {
//     saveOrder,
//     getOrder,
//     getOrdersByEmail,
//     updateOrderStatus,
//     getAllOrders
// } 
// from '../controllers/orderController.js';
import express from 'express';
import {
    saveOrder,
    updateOrderStatus,
    getAllOrders,
    getOrdersByUser
} from '../controllers/orderController.js';

const router = express.Router();

// Create new order
router.post("/add", saveOrder);
// Get orders by user ID (not email)
router.get("/user", getOrdersByUser);
// Get all orders (for admin view)
router.get("/", getAllOrders);
// Update order status by ID
router.put("/status/:id", updateOrderStatus);

export default router;
