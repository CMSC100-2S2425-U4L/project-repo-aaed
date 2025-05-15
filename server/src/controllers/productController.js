import Product from '../models/product.js';
import validator from 'validator';
import mongoose from 'mongoose';

// save a new product
export const saveProduct = async (req, res) => {
    try {
        // get the details of the product
        const { productName, productDescription, productType, productQuantity, productPrice } = req.body;

        // Handle image upload to GridFS only if file is present
        let productImage = null;
        if (req.file) {
            const db = mongoose.connection.db;
            const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
            const filename = Date.now() + '-' + req.file.originalname;
            const uploadStream = bucket.openUploadStream(filename, {
                contentType: req.file.mimetype
            });
            await new Promise((resolve, reject) => {
                uploadStream.end(req.file.buffer, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            productImage = filename;
        } else if (req.body.productImage) {
            productImage = req.body.productImage;
        }

        // check for missing fields
        if (!productName || !productDescription || !productType || !productQuantity || !productPrice || !productImage) {
            return res.status(400).json({ inserted: false, message: "Missing fields" });
        }

        // validate productName and product description length
        if (!validator.isLength(productName, { min: 1, max: 10 })) {
            return res.status(400).json({ inserted: false, message: "Product name must be between 1 and 10 characters" });
        }

        if (!validator.isLength(productDescription, { min: 1, max: 15 })) {
            return res.status(400).json({ inserted: false, message: "Product description must be between 1 and 15 characters" });
        }

        // create and save new Product
        const newProduct = new Product({
            productName,
            productDescription,
            productType,
            productQuantity,
            productPrice,
            productImage // filename only
        });

        await newProduct.save();
        res.status(201).json({ inserted: true, product: newProduct });

    } catch (e) {
        console.error(e);
        res.status(500).json({ inserted: false, message: "Server Error" });
    }
};

// Remove product by productId  
export const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if id was provided
        if (!id) {
            return res.status(400).json({ message: "No product ID provided" });
        }

        const deleted = await Product.deleteOne({ _id: id });

        if (deleted.deletedCount !== 0) {
            res.json({ deleted: true });
        } else {
            res.status(404).json({ deleted: false, message: "Product not found" });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ deleted: false, message: "Server Error" });
    }
};

// update product by productId
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, productDescription, productType, productQuantity, productPrice } = req.body;

        // Check for missing fields
        if (!id || !productName || !productDescription || !productType || !productQuantity || !productPrice) {
            return res.status(400).json({ inserted: false, message: "Missing fields" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ inserted: false, message: "Product not found" });
        }

        // Handle image upload to GridFS only if file is present
        let productImage = product.productImage;
        if (req.file) {
            const db = mongoose.connection.db;
            const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });

            // Delete old image if it exists
            if (productImage) {
                const files = await bucket.find({ filename: productImage }).toArray();
                if (files.length > 0) {
                    await bucket.delete(files[0]._id);
                }
            }

            const filename = Date.now() + '-' + req.file.originalname;
            const uploadStream = bucket.openUploadStream(filename, {
                contentType: req.file.mimetype
            });
            await new Promise((resolve, reject) => {
                uploadStream.end(req.file.buffer, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
            productImage = filename;
        } else if (req.body.productImage) {
            productImage = req.body.productImage;
        }

        // validate productName and product description length
        if (!validator.isLength(productName, { min: 1, max: 10 })) {
            return res.status(400).json({ inserted: false, message: "Product name must be between 1 and 10 characters" });
        }
        if (!validator.isLength(productDescription, { min: 1, max: 15 })) {
            return res.status(400).json({ inserted: false, message: "Product description must be between 1 and 15 characters" });
        }

        // Update all fields
        product.productName = productName;
        product.productDescription = productDescription;
        product.productType = productType;
        product.productQuantity = productQuantity;
        product.productPrice = productPrice;
        if (productImage) product.productImage = productImage;

        await product.save();
        res.json({ inserted: true, message: "Product updated successfully", product });
    } catch (e) {
        console.error(e);
        res.status(500).json({ inserted: false, message: "Server Error" });
    }
};

// get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};