import mongoose from "mongoose";

const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    coverImg: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Movies = mongoose.model('movies', moviesSchema)
export default Movies;