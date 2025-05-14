import product from '../models/product.js';
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';

// function to generate unique product ID
function generateID (productName){
    if (!productName){
        return null;
    }

    //make it lowercase 
    //remove whitespace characters with ''
    // references: https://stackoverflow.com/questions/10800355/remove-whitespaces-inside-a-string-in-javascript
    let removedSpaces = productName.replace(/\s+/g, '');
    let lowercasePname = removedSpaces.toLowerCase();

    //get only 8 characters of the string 
    const uid = uuidv4().substring(0,8); 
    //console.log (uid);

    return lowercasePname + uid //return the uid 

};

// save a new product
export const saveProduct = async (req, res) => {
    // get the details of the product
    try{
        const {productName, productDescription, productType, productQuantity, productPrice} = req.body;

        // check for missing fieldds
        if (!productName || !productDescription || !productType || !productQuantity || !productPrice) {
        return res.status(400).json({ inserted: false, message: "Missing fields" });
        }
        
        // validate productName and product description length
        if (!validator.isLength(productName, { min: 1, max: 10 })) {
            return res.status(400).json({ inserted: false, message: "Product name must be between 1 and 10 characters" });
        }

        if (!validator.isLength(productDescription, { min: 1, max: 15 })) {
            return res.status(400).json({ inserted: false, message: "Product description must be between 1 and 15 characters" });
        }
        
        // Generate product ID
        const productId = generateID(productName);

        // create and save new Product
        const newProduct = new Product({
                productId,
                productName,
                productDescription,
                productType,
                productQuantity,
                productPrice
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
    try{

    // delete by product ID (unique)
    const { productId } = req.body;

    // Check if productId was provided
    if (!productId) {
        return res.status(400).json({ message: "No product ID provided" });
    }

    const deleted = await Product.deleteOne({ productId });
    
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
        const { productId, productType, productQuantity } = req.body;

        // Check for missing fields
        if (!productId || !productType || !productQuantity) {
            return res.status(400).json({ inserted: false, message: "Missing fields" });
        }

        const product = await Product.findOne({ productId });

        if (!product) {
            return res.status(404).json({ inserted: false, message: "Product not found" });
        }

        // Update the product fields
        await product.updateOne({
            $set: {
                productType,
                productQuantity
            }
        });

        res.json({ inserted: true, message: "Product updated successfully" });

    } catch (e) {
        console.error(e);
        res.status(500).json({ inserted: false, message: "Server Error" });
    }
};