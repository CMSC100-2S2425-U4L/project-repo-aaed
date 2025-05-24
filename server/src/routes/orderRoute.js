// src/routes/orderRoute.js
import express from 'express';
import Order from '../models/Order.js'; // Use .js if using ES modules

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('Received order:', req.body);
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("Order saving failed:", err); // Log the actual error
    res.status(500).json({ message: 'Failed to save order', error: err.message });
    }

});

export default router;
