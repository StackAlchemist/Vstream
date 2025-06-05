import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import movieRouter from './routes/movieRoutes';
import connectCloudinary from './config/cloudinary';
import fs from 'fs';
import userRouter from './routes/userRoutes';
import cors from 'cors'
import adminRouter from './routes/adminRoutes';
import seriesRouter from './routes/seriesRoutes';
import viewershipRouter from './routes/viewershipRoutes';

dotenv.config();

const app = express();
app.use(express.json())
connectCloudinary()
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGODB_URI || '')
    .then(()=>console.log('connected to DB'))
    .catch((err)=>console.error(err));

    
    const allowedOrigins = [process.env.CLIENT1, process.env.CLIENT2];
    const corsOptions = {
      origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // allow requests with no origin (like Postman, curl)
        if (!origin) return callback(null, true);
        // Check if the origin is in the list of allowed origins
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('CORS policy does not allow this origin'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    };
    
    app.use(cors(corsOptions));


app.use('/api/movies', movieRouter)
app.use('/api/auth/', userRouter)
app.use('/api/admin/', adminRouter)
app.use('/api/series', seriesRouter)
app.use('/api/viewership', viewershipRouter)
app.get('/video', (req, res)=>{
    const range: string | undefined = req.headers.range;
    if(!range) res.status(400).send("Requires range header")
    
    const videoPath = './uploads/1746461450266.mp4';
    const videoSize = fs.statSync(videoPath).size;

    // Parse Range
    const CHUNK_SIZE = 10 ** 6; //1mb
    const start = range ? Number(range.replace(/\D/g, "")) : 0;
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1); //Limit byte returned to video size

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
    };
    res.writeHead(206, headers)

    const videoStream = fs.createReadStream(videoPath, {start, end});

    videoStream.pipe(res);
})

app.listen(1000,()=>{
    console.log("Server is running on port 1000");
})
