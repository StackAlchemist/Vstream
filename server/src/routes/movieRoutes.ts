import express from 'express'
import { deleteMovie, getMovieById, getMovies, postMovies } from '../controllers/moviesController'
import upload from '../middlewares/multer';
import { requireAuth } from '../middlewares/authMiddleware';

const movieRouter = express.Router()

movieRouter.post('/post', upload.fields([
    {name: 'coverImg', maxCount: 1},
    {name: 'video', maxCount: 1},
]), postMovies)

movieRouter.get('/get', getMovies)
movieRouter.get('/get/:id', getMovieById)
movieRouter.delete('/delete/:id', deleteMovie)

export default movieRouter;