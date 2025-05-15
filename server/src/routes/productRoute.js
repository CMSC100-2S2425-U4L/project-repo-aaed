import {
    saveProduct,
    removeProduct,
    updateProduct,
    getAllProducts
} from '../controllers/productController.js';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// Use Multer memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Add product (expects multipart/form-data with productImage)
router.post("/add", upload.single('productImage'), saveProduct);

// Delete product by ID (from URL param)
router.delete("/delete/:id", async (req, res, next) => {
    try {
        const productId = req.params.id;
        const Product = (await import('../models/product.js')).default;
        const mongoose = (await import('mongoose')).default;

        // Find the product to get the image filename
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ deleted: false, message: "Product not found" });
        }

        // Delete the product document
        const deleted = await Product.deleteOne({ _id: productId });

        // Delete the associated GridFS file if it exists
        if (product.productImage) {
            const db = mongoose.connection.db;
            const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
            // Find the file by filename
            const files = await bucket.find({ filename: product.productImage }).toArray();
            if (files.length > 0) {
                // Remove the file (this also deletes chunks)
                await bucket.delete(files[0]._id);
            }
        }

        if (deleted.deletedCount !== 0) {
            res.json({ deleted: true });
        } else {
            res.status(404).json({ deleted: false, message: "Product not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ deleted: false, message: "Server Error" });
    }
});

// Edit product (expects multipart/form-data with optional productImage)
router.put("/edit/:id", upload.single('productImage'), updateProduct);

// Get all products
router.get("/", getAllProducts);

export default router;