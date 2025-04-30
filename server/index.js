import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./server.js"
dotenv.config();

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected...");
        app.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    })

process.on('SIGINT', () => {
    console.log("Shutting down server...");
    process.exit();
});

