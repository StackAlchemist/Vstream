import express from "express";
import { postSeries } from "../controllers/seriesController";
import upload from "../middlewares/multer";

const seriesRouter = express.Router();

seriesRouter.post('/post', upload.fields([
    {name: 'coverImg', maxCount: 1},
    {name: 'video', maxCount: 1},
]), postSeries);

export default seriesRouter;