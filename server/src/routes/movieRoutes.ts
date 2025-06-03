import express from 'express'
import { addComment, deleteMovie, getMovieById, getMovies, getMoviesByDirector, getRated, getVideo, postMovies, rating } from '../controllers/moviesController'
import upload from '../middlewares/multer';
import { requireAuth } from '../middlewares/authMiddleware';

const movieRouter = express.Router()

movieRouter.post('/post', requireAuth, upload.fields([
    {name: 'coverImg', maxCount: 1},
    {name: 'video', maxCount: 1},
]), postMovies)

movieRouter.get('/get', requireAuth, getMovies)
movieRouter.get('/get/:id', requireAuth,  getMovieById)
movieRouter.get('/get/view/:directorId', requireAuth,  getMoviesByDirector)
movieRouter.get('/video/:id',  getVideo)
movieRouter.post('/add-comment', requireAuth, addComment)
movieRouter.delete('/delete/:id', requireAuth, deleteMovie)
movieRouter.post('/rate/:id', requireAuth, rating)
movieRouter.get('/rated/:id', requireAuth, getRated)

export default movieRouter;