import express from "express";
import { deleteSeries, editSeries, getSeries, getSeriesById, postSeries } from "../controllers/seriesController";
import upload from "../middlewares/multer";

const seriesRouter = express.Router();

seriesRouter.post('/post', upload.fields([
    {name: 'coverImg', maxCount: 1},
    {name: 'video', maxCount: 1},
]), postSeries);

seriesRouter.put('/edit', upload.fields([
    {name: 'video', maxCount: 1},
]), editSeries);

seriesRouter.get('/get', getSeries)
seriesRouter.get('/get/:id', getSeriesById)
seriesRouter.delete('/delete/:id', deleteSeries)

export default seriesRouter;