import {
    saveOrder,
    getOrder,
    getOrdersByEmail,
    updateOrderStatus,
    getAllOrders
} 
from '../controllers/orderController.js';
import express from 'express';

const router = express.Router();
 
// Create new order
router.post("/add", saveOrder);

// Get order by ID
router.get("/:id", getOrder);

// Get orders by email 
router.get("/", (req, res, next) => {
    if (req.query.email) {
        return getOrdersByEmail(req, res, next);
    }
    return getAllOrders(req, res, next);
});

router.put("/status/:id", updateOrderStatus);

export default router;