import express, { Request, Response } from 'express';
import { v2 as cloudinary } from "cloudinary";
import Series from '../models/seriesModel';
import Directors from '../models/adminModel';
import fs from 'fs';
import path from "path";
import User from '../models/userModel';
import multer from 'multer';
export const postSeries = async (req: Request, res: Response) => {

    console.log(`i was hit with a ${req.method} request for series`)

    try {
        
        const coverImgFile = (req.files as any).coverImg?.[0];
        const videoFile = (req.files as any).video?.[0];
        const { title, genre, description, director, seasons } = req.body;

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
    
        res.status(201).json({ series, msg: 'movie uploaded successfully'})

    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'There was a problem uploading the series.' })
    }

}

export const editSeries = async (req: Request, res: Response) => {
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

export const getSeries = async (req: Request, res: Response) => {
    try {
        const series = await Series.find();
        res.status(200).json({ series });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'There was a problem fetching the series.' })
    }
}

export const getSeriesByDir = async (req: Request, res: Response) => {
    try {
        const director_id: string = req.params.id;
        const series = await Series.find({director: director_id});
        res.status(200).json({ series });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'There was a problem fetching the series.' })
    }
}

export const getSeriesById = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;

        const series = await Series.findById(id).populate('director', 'name');
        const director = await Directors.findById(series?.director).select('name')
        if (!series) {
            return res.status(404).json({ error: 'Series not found.' });
        }

        res.status(200).json( {series, director: director?.name} );
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'There was a problem fetching the series.' })
    }
}

export const deleteSeries = async(req: Request, res: Response) => {
    try {
        const sId: String = req.params.id;

        const movie = await Series.findByIdAndDelete(sId)
        res.status(200).json({message: 'deleted successfully'})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: 'internal server error'})
    }
}

export const getVideo = async (req: Request, res: Response) => {
    try {

        
        const { seriesId, seasonIndex, episodeIndex } = req.params;
        const range : string | undefined = req.headers.range;
        // const videoPath = series ? path.resolve(__dirname, "../../uploads", path.basename(series.seasons.episodes.video)) : "";
        // console.log(videoPath)

        if (!range) return res.status(400).send("Requires Range header");

        const series = await Series.findById(seriesId)
        if (!series) {
            return res.status(404).send("Series not found");
          }
      
          const season = series.seasons[parseInt(seasonIndex)];
          if (!season) {
            return res.status(404).send("Season not found");
          }
      
          const episode = season.episodes[parseInt(episodeIndex)];
          if (!episode) {
            return res.status(404).send("Episode not found");
          }

          const videoPath = path.resolve(__dirname, "../../uploads", path.basename(episode.video));

          if (!fs.existsSync(videoPath)) {
            return res.status(404).send("Video file not found");
          }

          const videoSize = fs.statSync(videoPath).size;
          const CHUNK_SIZE = 10 ** 6; // 1MB
          const start = Number(range.replace(/\D/g, ""));
          const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
        
          const contentLength = end - start + 1;
          const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
          };
        
          res.writeHead(206, headers);
          const videoStream = fs.createReadStream(videoPath, { start, end });
          videoStream.pipe(res);
        
    } catch (error) {
        console.error(error)
        res.status(400).json({message: 'internal server error'})
    }
}

export const addComment = async (req: Request, res: Response) => {
    try {
        const {seriesId, userId, comment} = req.body;
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({error: "User not found"})
        }

        const series = await Series.findById(seriesId)
        if(!series){
            return res.status(404).json({error: "Series not found"})
        }

        series.comments.push({userId, text: comment, userName: user.name})
        await series.save()

        res.status(200).json({msg: "Comment added successfully", series})
    } catch (error) {
        console.error(error)
        res.status(400).json({error: "There was a problem adding the comment"})
    }
}


export const replyComment = async (req: Request, res: Response) => {
    try {
        const { seriesId, userId, comment, replyTo } = req.body;
        const user = await User.findById(userId)

        // check if user exists
        if(!user){
            return res.status(404).json({error: "User not found"})
        }

        // check if user to reply exists
        const userToReply = await User.findById(replyTo)
        if(!userToReply){
            return res.status(404).json({error: "User not found"})
        }

        // check if series exists
        const series = await Series.findById(seriesId)
        if(!series){
            return res.status(404).json({error: "Series not found"})
        }

        // check if comment to reply exists
        const commentToReply = series.comments.find(c => c.userId === replyTo)
        if(!commentToReply){
            return res.status(404).json({error: "Comment not found"})
        }

        // add reply to comment
        commentToReply.replies.push({userId, text: comment, userName: user.name, replyTo: userToReply.name})
        await series.save()

        res.status(200).json({msg: "Reply added successfully", series})

    } catch (error) {
        console.error(error)
        res.status(400).json({error: "There was a problem adding the reply"})
    }
}


export const rating = async (req: Request, res: Response) => {
    try {
      const { rating, userId }: { rating: number; userId: string } = req.body;
      const { id } = req.params;
  
      if (
        typeof rating !== "number" ||
        rating < 1 ||
        rating > 5 ||
        typeof userId !== "string"
      ) {
        return res.status(400).json({ error: "Invalid rating or user ID" });
      }
  
      const movie = await Series.findById(id);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }
  
      // Check if user has already rated
      const existingRatingIndex = movie.rating.findIndex(r => r.userId === userId);
  
      if (existingRatingIndex !== -1) {
        // Update existing rating
        movie.rating[existingRatingIndex].no = rating;
      } else {
        // Add new rating
        movie.rating.push({ userId, no: rating });
      }
  
      await movie.save();
  
      // Optionally calculate average rating
      const avg =
        movie.rating.reduce((acc, cur) => acc + (cur.no ?? 0), 0) / movie.rating.length;
  
      res.status(200).json({
        message: "Rating updated successfully",
        averageRating: avg.toFixed(1),
        totalRatings: movie.rating.length,
      });
    } catch (error) {
      console.error("Rating error:", error);
      res.status(500).json({ error: "There was an error adding the rating" });
    }
  };

  export const getRated = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { userId } = req.query;
      const movie = await Series.findById(id);
      if (!movie) {
        return res.status(404).json({ error: "Series not found" });
      }
  
      const rating = movie.rating?.find(r => r.userId === userId);
      if (!rating) {
        return res.status(404).json({ error: "Rating not found" });
      }
  
      res.status(200).json({ rating });
      
    } catch (error) {
      console.error("Rating error:", error);
      res.status(500).json({ error: "There was an error getting the rating" });
    }
  }


// Adding new season to a series
export const addSeason = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const { seriesId } = req.params;

    const series = await Series.findById(seriesId);
    if (!series) return res.status(404).json({ error: "Series not found" });

    series.seasons.push({ season_title: title , description, episodes: [] });
    await series.save();

    res.status(201).json({ msg: "New season added successfully", series });
  } catch (error) {
    console.error("Add Season Error:", error);
    res.status(500).json({ error: "Failed to add season" });
  }
};

// Add ing new episode to a specific season of a series
export const addEpisode = async (req: Request, res: Response) => {
  try {
    const { seriesId, seasonId } = req.params;
    const { ep_title, description } = req.body;

    const videoFile = (req.files as { video?: Express.Multer.File[] })?.video?.[0];
    if (!videoFile) {
      return res.status(400).json({ error: "Video file is required." });
    }

    const series = await Series.findById(seriesId);
    if (!series) return res.status(404).json({ error: "Series not found" });

    const season = series.seasons.id(seasonId);
    if (!season) return res.status(404).json({ error: "Season not found" });

    season.episodes.push({
      episode_title: ep_title,
      description,
      video: `/uploads/${videoFile.filename}`,
    });

    await series.save();
    res.status(201).json({ msg: "Episode added successfully", series });
  } catch (error) {
    console.error("Add Episode Error:", error);
    res.status(500).json({ error: "Failed to add episode" });
  }
};