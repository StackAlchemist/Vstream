import express, { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import Series from "../models/seriesModel";
import Directors from "../models/adminModel";
import fs from "fs";
import path from "path";
import User from "../models/userModel";
import multer from "multer";

/**
 * Series controllers — all handlers return Promise<void> and never return Response objects.
 * This avoids the 'Promise<Response> is not assignable to Promise<void>' TypeScript errors.
 */

export const postSeries = async (req: Request, res: Response): Promise<void> => {
  console.log(`i was hit with a ${req.method} request for series`);

  try {
    const coverImgFile = (req.files as any).coverImg?.[0];
    const videoFile = (req.files as any).video?.[0];
    const { title, genre, description, director, seasons } = req.body;

    if (!coverImgFile) {
      res.status(400).json({ error: "Cover image is required." });
      return;
    }

    // Upload cover image to Cloudinary and get the URL
    const result = await cloudinary.uploader.upload(coverImgFile.path);

    const parsedSeasons = JSON.parse(seasons || "[]");
    const parsedGenre = JSON.parse(genre || "[]");

    // video insertion logic (if first season/episode exists)
    if (parsedSeasons[0]?.episodes?.[0] && videoFile) {
      parsedSeasons[0].episodes[0].video = `/uploads/${videoFile.filename}`;
    }

    const series = await Series.create({
      title,
      genre: parsedGenre,
      description,
      coverImg: result.secure_url, // Save the Cloudinary URL
      director,
      seasons: parsedSeasons,
    });

    res.status(201).json({ series, msg: "movie uploaded successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "There was a problem uploading the series." });
    return;
  }
};

export const editSeries = async (req: Request, res: Response): Promise<void> => {
  try {
    const videoFile = (req.files as any).video?.[0];
    const { ep_title, description, id, s_id, ep_id } = req.body;

    if (!videoFile) {
      res.status(400).json({ error: "Video file is required." });
      return;
    }

    const videoUrl = `/uploads/${videoFile.filename}`;

    const series = await Series.findById(id);
    if (!series) {
      res.status(404).json({ error: "Series not found" });
      return;
    }

    const season = series.seasons.id(s_id);
    if (!season) {
      res.status(404).json({ error: "Season not found." });
      return;
    }

    const newEpisode = {
      episode_title: ep_title,
      description,
      video: videoUrl,
    };

    season.episodes.push(newEpisode);
    await series.save();

    res.status(200).json({ msg: "Episode uploaded successfully", series });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "There was a problem updating the series." });
    return;
  }
};

export const getSeries = async (req: Request, res: Response): Promise<void> => {
  try {
    const series = await Series.find();
    res.status(200).json({ series });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was a problem fetching the series." });
    return;
  }
};

export const getSeriesByDir = async (req: Request, res: Response): Promise<void> => {
  try {
    const director_id: string = req.params.id;
    const series = await Series.find({ director: director_id });
    res.status(200).json({ series });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was a problem fetching the series." });
    return;
  }
};

export const getSeriesById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const series = await Series.findById(id).populate("director", "name");
    if (!series) {
      res.status(404).json({ error: "Series not found." });
      return;
    }

    const director = await Directors.findById(series.director).select("name");

    res.status(200).json({ series, director: director?.name });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "There was a problem fetching the series." });
    return;
  }
};

export const deleteSeries = async (req: Request, res: Response): Promise<void> => {
  try {
    const sId: string = req.params.id;

    await Series.findByIdAndDelete(sId);
    res.status(200).json({ message: "deleted successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "internal server error" });
    return;
  }
};

export const getVideo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { seriesId, seasonIndex, episodeIndex } = req.params;
    const range: string | undefined = req.headers.range as string | undefined;

    if (!range) {
      res.status(400).send("Requires Range header");
      return;
    }

    const series = await Series.findById(seriesId);
    if (!series) {
      res.status(404).send("Series not found");
      return;
    }

    const season = series.seasons[parseInt(seasonIndex, 10)];
    if (!season) {
      res.status(404).send("Season not found");
      return;
    }

    const episode = season.episodes[parseInt(episodeIndex, 10)];
    if (!episode) {
      res.status(404).send("Episode not found");
      return;
    }

    const videoPath = path.resolve(__dirname, "../../uploads", path.basename(episode.video));

    if (!fs.existsSync(videoPath)) {
      res.status(404).send("Video file not found");
      return;
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
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "internal server error" });
    return;
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { seriesId, userId, comment } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const series = await Series.findById(seriesId);
    if (!series) {
      res.status(404).json({ error: "Series not found" });
      return;
    }

    series.comments.push({ userId, text: comment, userName: user.name });
    await series.save();

    res.status(200).json({ msg: "Comment added successfully", series });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "There was a problem adding the comment" });
    return;
  }
};

export const replyComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { seriesId, userId, comment, replyTo } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const userToReply = await User.findById(replyTo);
    if (!userToReply) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const series = await Series.findById(seriesId);
    if (!series) {
      res.status(404).json({ error: "Series not found" });
      return;
    }

    const commentToReply = series.comments.find((c) => c.userId === replyTo);
    if (!commentToReply) {
      res.status(404).json({ error: "Comment not found" });
      return;
    }

    commentToReply.replies.push({
      userId,
      text: comment,
      userName: user.name,
      replyTo: userToReply.name,
    });
    await series.save();

    res.status(200).json({ msg: "Reply added successfully", series });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "There was a problem adding the reply" });
    return;
  }
};

export const rating = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rating: ratingVal, userId }: { rating: number; userId: string } = req.body;
    const { id } = req.params;

    if (typeof ratingVal !== "number" || ratingVal < 1 || ratingVal > 5 || typeof userId !== "string") {
      res.status(400).json({ error: "Invalid rating or user ID" });
      return;
    }

    const movie = await Series.findById(id);
    if (!movie) {
      res.status(404).json({ error: "Movie not found" });
      return;
    }

    // ensure rating array exists
    if (!movie.rating) movie.rating = []  as any;

    // Check if user has already rated
    const existingRatingIndex = movie.rating.findIndex((r) => r.userId === userId);

    if (existingRatingIndex !== -1) {
      // Update existing rating
      movie.rating[existingRatingIndex].no = ratingVal;
    } else {
      // Add new rating
      movie.rating.push({ userId, no: ratingVal });
    }

    await movie.save();

    // Optionally calculate average rating
    const avg = movie.rating.reduce((acc, cur) => acc + (cur.no ?? 0), 0) / movie.rating.length;

    res.status(200).json({
      message: "Rating updated successfully",
      averageRating: avg.toFixed(1),
      totalRatings: movie.rating.length,
    });
    return;
  } catch (error) {
    console.error("Rating error:", error);
    res.status(500).json({ error: "There was an error adding the rating" });
    return;
  }
};

export const getRated = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    const movie = await Series.findById(id);
    if (!movie) {
      res.status(404).json({ error: "Series not found" });
      return;
    }

    const rating = movie.rating?.find((r) => r.userId === userId);
    if (!rating) {
      res.status(404).json({ error: "Rating not found" });
      return;
    }

    res.status(200).json({ rating });
    return;
  } catch (error) {
    console.error("Rating error:", error);
    res.status(500).json({ error: "There was an error getting the rating" });
    return;
  }
};

export const addSeason = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    const { seriesId } = req.params;

    const series = await Series.findById(seriesId);
    if (!series) {
      res.status(404).json({ error: "Series not found" });
      return;
    }

    series.seasons.push({ season_title: title, description, episodes: [] });
    await series.save();

    res.status(201).json({ msg: "New season added successfully", series });
    return;
  } catch (error) {
    console.error("Add Season Error:", error);
    res.status(500).json({ error: "Failed to add season" });
    return;
  }
};

export const addEpisode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { seriesId, seasonId } = req.params;
    const { ep_title, description } = req.body;

    const videoFile = (req.files as { video?: Express.Multer.File[] })?.video?.[0];
    if (!videoFile) {
      res.status(400).json({ error: "Video file is required." });
      return;
    }

    const series = await Series.findById(seriesId);
    if (!series) {
      res.status(404).json({ error: "Series not found" });
      return;
    }

    const season = series.seasons.id(seasonId);
    if (!season) {
      res.status(404).json({ error: "Season not found" });
      return;
    }

    season.episodes.push({
      episode_title: ep_title,
      description,
      video: `/uploads/${videoFile.filename}`,
    });

    await series.save();
    res.status(201).json({ msg: "Episode added successfully", series });
    return;
  } catch (error) {
    console.error("Add Episode Error:", error);
    res.status(500).json({ error: "Failed to add episode" });
    return;
  }
};

export const deleteEpisode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { seriesId, seasonId, episodeId } = req.params;

    const series = await Series.findById(seriesId);
    if (!series) {
      res.status(404).json({ error: "Series not found" });
      return;
    }

    const season = series.seasons.id(seasonId);
    if (!season) {
      res.status(404).json({ error: "Season not found" });
      return;
    }

    const episodeIndex = season.episodes.findIndex((ep) => ep._id.toString() === episodeId);
    if (episodeIndex === -1) {
      res.status(404).json({ error: "Episode not found" });
      return;
    }

    const episode = season.episodes[episodeIndex];

    // Delete video file from local storage
    const videoPath = path.resolve(__dirname, "../../uploads", path.basename(episode.video));
    if (fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    }

    // Remove episode from array
    season.episodes.splice(episodeIndex, 1);

    await series.save();

    res.status(200).json({ msg: "Episode deleted successfully", series });
    return;
  } catch (error) {
    console.error("Delete Episode Error:", error);
    res.status(500).json({ error: "Failed to delete episode" });
    return;
  }
};

export const deleteSeason = async (req: Request, res: Response): Promise<void> => {
  try {
    const { seriesId, seasonId } = req.params;
    const series = await Series.findById(seriesId);
    if (!series) {
      res.status(404).json({ error: "Series not found" });
      return;
    }

    const season = series.seasons.id(seasonId);
    if (!season) {
      res.status(404).json({ error: "Season not found" });
      return;
    }

    // Remove the season
    series.seasons.pull(seasonId);

    // Save the updated series
    await series.save();

    res.json({ message: "Season deleted successfully" });
    return;
  } catch (error) {
    console.error("Deletion Error:", error);
    res.status(500).json({ error: "Failed to delete season" });
    return;
  }
};
