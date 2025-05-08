import express,{Request, Response} from 'express'
import { v2 as cloudinary } from "cloudinary";
import Series from '../models/seriesModel';
import Directors from '../models/adminModel';

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

export const editSeries = async (req: Request, res: Response)=>{
    try {
        const videoFile = (req.files as any).video?.[0]
        const { ep_title, description, id, s_id, ep_id } = req.body;

        if(!videoFile){
            return res.status(400).json({ error: "Video file is required." });
        }

        const videoUrl = `/uploads/${videoFile.filename}`;


        const series = await Series.findById(id)
        if(!series){
            return res.status(404).json({error: "Series not found"})
        }

        const season = series.seasons.id(s_id)
        if(!season) {
            return res.status(404).json({ error: "Season not found." });
          }

        const newEpisode = {
            episode_title: ep_title,
            description,
            video: videoUrl
        }

        season.episodes.push(newEpisode)

        await series.save()

        res.status(200).json({ msg: "Episode uploaded successfully", series });
      

    } catch (error) {
        
        console.error(error)
        res.status(400).json({ error: 'There was a problem updating the series.' })
    }


}

export const getSeries = async (req: Request, res: Response)=>{
    try {
        const series = await Series.find();
        res.status(200).json({ series });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'There was a problem fetching the series.' })
    }
}

export const getSeriesById = async (req: Request, res: Response)=>{
    try {

        const { id } = req.params;

        const series = await Series.findById(id);
        if (!series) {
            return res.status(404).json({ error: 'Series not found.' });
        }

        const director = await Directors.findById(series.director).select('name')
        res.status(200).json( {series, director} );
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'There was a problem fetching the series.' })
    }
}

export const deleteSeries = async(req: Request, res: Response)=>{
    try {
        const sId: String = req.params.id;

        const movie = await Series.findByIdAndDelete(sId)
        res.status(200).json({message: 'deleted successfully'})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: 'internal server error'})
    }
}