import express, { Request, Response } from 'express';
import Movies from '../models/moviesModel';
import { v2 as cloudinary } from "cloudinary";
import User from '../models/userModel';
import Directors from '../models/adminModel';
import fs from 'fs';
import path from "path";

export const postMovies = async (req: Request, res: Response) => {

    console.log(`i was hit with a ${req.method} request`)

    try {
        
        const coverImgFile = (req.files as any).coverImg?.[0];
        const videoFile = (req.files as any).video?.[0];
        const { title, genre, description, director } = req.body;
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
    
        res.status(201).json({ movies, msg: 'movie uploaded successfully' })

    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'There was a problem uploading the movie.' })
    }

}


export const getMovies = async (req: Request, res: Response) => {
    try {
        const movies = await Movies.find({})
        res.status(200).json(movies)
    } catch (error) {
        console.log('error fetching movies', error)
        res.status(400).json({ error: 'Oops, We`re having trouble fetching movies' })
    }
} 
export const getMoviesByDirector = async (req: Request, res: Response) => {
    console.log('req made')
    try {
        const { directorId } = req.params;
        const movies = await Movies.find({ director: directorId });
        res.status(200).json({ movies });
    } catch (error) {
        console.log('error fetching movies', error);
        res.status(400).json({ error: 'Oops, We`re having trouble fetching movies' });
    }
} 


export const getMovieById = async (req: Request, res: Response) => {
    try {
        const movieId: string = req.params.id;

        // Populate the director's `name` field from the referenced Director model
        const movie = await Movies.findById(movieId).populate('director', 'name');
        const director = await Directors.findById(movie?.director)
    
        if (!movie) {
          return res.status(404).json({ success: false, error: 'Movie not found' });
        }
        res.status(200).json({movie, director: director?.name});
    } catch (error) {
        console.error('Error fetching movie', error);
        res.status(500).json({ error: 'Oops, We`re having trouble fetching the movie' });
    }
}

export const deleteMovie = async(req: Request, res: Response) => {
    try {
        const movieId: string = req.params.id;

        const movie = await Movies.findByIdAndDelete(movieId)
        res.status(200).json({ message: 'deleted successfully' })
    } catch (error) {
        console.error(error)
        res.status(400).json({ message: 'internal server error' })
    }
}

const editMovies = async (req: Request, res: Response) => {
    
}


export const getVideo = async(req: Request, res: Response)=>{
    // console.log('i got a video request')
    try{

        const range: string | undefined = req.headers.range;
        const movieId: string = req.params.id;
        const movie = await Movies.findById(movieId);
        const videoPath = movie ? path.resolve(__dirname, "../../uploads", path.basename(movie.video)) : "";
        // console.log(videoPath)

        if (!range) return res.status(400).send("Requires Range header");

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

          
    }catch (error) {
        console.error(error)
        res.status(400).json({ message: 'internal server error' })
    }
}


export const addComment = async (req: Request, res: Response)=>{
    try {
        const {movieId, userId, comment} = req.body;
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({error: "User not found"})
        }

        const movie = await Movies.findById(movieId)
        if(!movie){
            return res.status(404).json({error: "Movie not found"})
        }

        movie?.comments?.push({userId, text: comment, userName: user.name})
        await movie.save()

        res.status(200).json({msg: "Comment added successfully", movie})
    } catch (error) {
        console.error(error)
        res.status(400).json({error: "There was a problem adding the comment"})
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

    const movie = await Movies.findById(id);
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
      movie.rating.reduce((acc, cur) => acc + cur.no, 0) / movie.rating.length;

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
    const movie = await Movies.findById(id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
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

export const replyComment = async (req: Request, res: Response) => {
  try {
      const { movieId, userId, comment, replyTo } = req.body;
      const user = await User.findById(userId)

      // check if user exists
      if(!user){
          return res.status(404).json({error: "User not found"})
      }

      // check if user to reply exists
      const userToReply = await User.findById(replyTo)
      if(!userToReply){
          return res.status(404).json({error: "User to reply not found"})
      }

      // check if movie exists
      const movie = await Movies.findById(movieId)
      if(!movie){
          return res.status(404).json({error: "Movie not found"})
      }

      // check if comment to reply exists
      const commentToReply = movie?.comments?.find(c => c.userId === replyTo)
      if(!commentToReply){
          return res.status(404).json({error: "Comment not found"})
      }

      // add reply to comment
      commentToReply.replies.push({userId, text: comment, userName: user.name, replyTo: userToReply.name})
        await movie.save()

      res.status(200).json({msg: "Reply added successfully", movie})

  } catch (error) {
      console.error(error)
      res.status(400).json({error: "There was a problem adding the reply"})
  }
}