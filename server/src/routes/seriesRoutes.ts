import express, { Router } from "express";
import {
  addComment,
  addSeason,
  addEpisode,
  deleteSeries,
  editSeries,
  getRated,
  getSeries,
  getSeriesByDir,
  getSeriesById,
  getVideo,
  postSeries,
  rating,
  replyComment,
  deleteEpisode,
  deleteSeason,
} from "../controllers/seriesController";
import upload from "../middlewares/multer";
import { requireAuth } from "../middlewares/authMiddleware";

const seriesRouter: Router = express.Router();

// Create Series
seriesRouter.post(
  "/post",
  requireAuth,
  upload.fields([
    { name: "coverImg", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  postSeries
);

// Edit Series
seriesRouter.put(
  "/edit",
  requireAuth,
  upload.fields([{ name: "video", maxCount: 1 }]),
  editSeries
);

// Comments
seriesRouter.post("/add-comment", requireAuth, addComment);
seriesRouter.post("/reply-comment", requireAuth, replyComment);

// Series Retrieval
seriesRouter.get("/get", requireAuth, getSeries);
seriesRouter.get("/get/:id", requireAuth, getSeriesById);
seriesRouter.get("/get/view/:id", requireAuth, getSeriesByDir);

// Video Streaming
seriesRouter.get("/video/:seriesId/:seasonIndex/:episodeIndex", getVideo);

// Ratings
seriesRouter.post("/rate/:id", requireAuth, rating);
seriesRouter.get("/rated/:id", requireAuth, getRated);

// Delete Series
seriesRouter.delete("/delete/:id", requireAuth, deleteSeries);

// Seasons
seriesRouter.post("/:seriesId/add-season", requireAuth, addSeason);
seriesRouter.delete("/:seriesId/:seasonId", requireAuth, deleteSeason);

// Episodes
seriesRouter.post(
  "/:seriesId/:seasonId/add-episode",
  requireAuth,
  upload.fields([{ name: "video", maxCount: 1 }]),
  addEpisode
);
seriesRouter.delete(
  "/:seriesId/season/:seasonId/episode/:episodeId",
  requireAuth,
  deleteEpisode
);

export default seriesRouter;
