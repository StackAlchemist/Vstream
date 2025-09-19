import express from 'express'
import { addComment, deleteMovie, getMovieById, getMovies, getMoviesByDirector, getRated, getVideo, postMovies, rating, replyComment } from '../controllers/moviesController'
import upload from '../middlewares/multer';
import { requireAuth } from '../middlewares/authMiddleware';

const movieRouter = express.Router()

movieRouter.post('/post', requireAuth, upload.fields([
    {name: 'coverImg', maxCount: 1},
    {name: 'video', maxCount: 1},
]), postMovies)

movieRouter.get('/get', requireAuth, getMovies)
movieRouter.get('/get/:id', requireAuth,  getMovieById as any)
movieRouter.get('/get/view/:directorId', requireAuth,  getMoviesByDirector)
movieRouter.get('/video/:id',  getVideo as any)
movieRouter.post('/add-comment', requireAuth, addComment as any)
movieRouter.post('/reply-comment', requireAuth, replyComment as any)
movieRouter.delete('/delete/:id', requireAuth, deleteMovie)
movieRouter.post('/rate/:id', requireAuth, rating as any)
movieRouter.get('/rated/:id', requireAuth, getRated as any)

export default movieRouter;