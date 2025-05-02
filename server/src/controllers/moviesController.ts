import express,{Request, Response} from 'express'
import Movies from '../models/moviesModel';
import { v2 as cloudinary } from "cloudinary";

export const postMovies = async (req: Request, res: Response)=>{

    console.log(`i was hit with a ${req.method} request`)

    try {
        
        const coverImgFile = (req.files as any).coverImg?.[0];
        const videoFile = (req.files as any).video?.[0];
        const {title, genre, description, director} = req.body;
        const parsedGenre = JSON.parse(genre)

        // Upload the file to Cloudinary and get the URL
        const result = await cloudinary.uploader.upload(coverImgFile.path);
    
        const movies = await Movies.create({
            title,
            genre: parsedGenre,
            description,
            coverImg: result.secure_url, // Save the Cloudinary URL
            video: `/uploads/${videoFile.filename}`,
            director
        })
    
        res.status(201).json({movies, msg: 'movie uploaded successfully'})

    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'There was a problem uploading the movie.' })
    }

}

export const getMovies = async (req: Request, res: Response)=>{
    try {
        const movies = await Movies.find({})
        res.status(200).json(movies)
    } catch (error) {
        console.log('error fetching movies', error)
        res.status(400).json({error: 'Oops, We`re having trouble fetching movies'})
    }
} 