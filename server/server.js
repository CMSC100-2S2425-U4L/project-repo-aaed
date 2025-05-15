import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoute from "./src/routes/authRoute.js";
import productRoute from "./src/routes/productRoute.js";
import path from "path";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

dotenv.config();

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

//routes
app.use('/auth', authRoute);
app.use('/product', productRoute);

app.get("/", (req, res) => {
    res.send("Server is running!");
});

// Add GridFS streaming route for images
let gfsBucket;
mongoose.connection.on('connected', () => {
    gfsBucket = new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    console.log('GridFSBucket initialized');
});

// Serve images from GridFS by filename
app.get('/uploads/:filename', async (req, res) => {
    try {
        if (!gfsBucket) {
            console.error('GridFS not initialized');
            return res.status(500).send('GridFS not initialized');
        }
        const files = await gfsBucket.find({ filename: req.params.filename }).toArray();
        if (!files || files.length === 0) {
            console.error('File not found:', req.params.filename);
            return res.status(404).send('File not found');
        }
        res.set('Content-Type', files[0].contentType || 'application/octet-stream');
        gfsBucket.openDownloadStreamByName(req.params.filename).pipe(res);
    } catch (err) {
        console.error('Error retrieving file:', err);
        res.status(500).send('Error retrieving file');
    }
});

export default app;
