import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import movieRouter from './routes/movieRoutes';
import connectCloudinary from './config/cloudinary';

dotenv.config();

const app = express();
app.use(express.json())
connectCloudinary()
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI || '')
    .then(()=>console.log('connected to DB'))
    .catch((err)=>console.error(err));


app.use('/api/movies', movieRouter)


app.listen(1000, ()=>{
    console.log("Server is running on port 1000");
})
