import express from "express";
import { addComment, deleteSeries, editSeries, getSeries, getSeriesByDir, getSeriesById, getVideo, postSeries, rating } from "../controllers/seriesController";
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

seriesRouter.get('/get', requireAuth, getSeries)
seriesRouter.get('/get/:id', requireAuth, getSeriesById)
seriesRouter.get('/get/view/:id', requireAuth, getSeriesByDir)
seriesRouter.get('/video/:seriesId/:seasonIndex/:episodeIndex', getVideo)
seriesRouter.delete('/delete/:id', requireAuth, deleteSeries)
seriesRouter.post('/rate/:id', requireAuth, rating)


export default seriesRouter;