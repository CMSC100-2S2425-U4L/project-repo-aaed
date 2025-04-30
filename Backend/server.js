import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log(' Connected to MongoDB') )
.catch((err) => console.error(' MongoDB connection error:', err));


app.use(express.json());

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
