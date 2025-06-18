import express from "express";
import { addComment, addSeason, addEpisode, deleteSeries, editSeries, getRated, getSeries, getSeriesByDir, getSeriesById, getVideo, postSeries, rating, replyComment, deleteEpisode, deleteSeason } from "../controllers/seriesController";
import upload from "../middlewares/multer";
import { requireAuth } from "../middlewares/authMiddleware";

const seriesRouter = express.Router();

seriesRouter.post('/post', requireAuth, upload.fields([
    {name: 'coverImg', maxCount: 1},
    {name: 'video', maxCount: 1},
]), postSeries);

seriesRouter.put('/edit', requireAuth, upload.fields([
    {name: 'video', maxCount: 1},
]), editSeries);

seriesRouter.post('/add-comment', requireAuth, addComment)
seriesRouter.post('/reply-comment', requireAuth, replyComment)

seriesRouter.get('/get', requireAuth, getSeries)
seriesRouter.get('/get/:id', requireAuth, getSeriesById)
seriesRouter.get('/get/view/:id', requireAuth, getSeriesByDir)
seriesRouter.get('/video/:seriesId/:seasonIndex/:episodeIndex', getVideo)
seriesRouter.delete('/delete/:id', requireAuth, deleteSeries)
seriesRouter.post('/rate/:id', requireAuth, rating)
seriesRouter.get('/rated/:id', requireAuth, getRated)
// Add Season to a Series
seriesRouter.post("/:seriesId/add-season", addSeason);

// Add Episode to a Season within a Series
seriesRouter.post(
  "/:seriesId/:seasonId/add-episode",
  upload.fields([{ name: "video", maxCount: 1 }]),
  addEpisode
);
seriesRouter.delete('/:seriesId/season/:seasonId/episode/:episodeId', requireAuth, deleteEpisode);
seriesRouter.delete('/:seriesId/:seasonId', requireAuth, deleteSeason)



export default seriesRouter;