import express,{Request, Response} from 'express'
import { v2 as cloudinary } from "cloudinary";
import Series from '../models/seriesModel';

export const postSeries = async (req: Request, res: Response)=>{

    console.log(`i was hit with a ${req.method} request for series`)

    try {
        
        const coverImgFile = (req.files as any).coverImg?.[0];
        const videoFile = (req.files as any).video?.[0];
        const {title, genre, description, director, seasons} = req.body;

        // Upload the file to Cloudinary and get the URL
        const result = await cloudinary.uploader.upload(coverImgFile.path);

        const parsedSeasons = JSON.parse(seasons)
        const parsedGenre = JSON.parse(genre)

        //video insertion logic

        if(parsedSeasons[0]?.episodes[0]){
            parsedSeasons[0].episodes[0].video = `/uploads/${videoFile.filename}`
        }
    
        const series = await Series.create({
            title,
            genre: parsedGenre,
            description,
            coverImg: result.secure_url, // Save the Cloudinary URL
            director,
            seasons: parsedSeasons
        })
    
        res.status(201).json({series, msg: 'movie uploaded successfully'})

    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'There was a problem uploading the series.' })
    }

}