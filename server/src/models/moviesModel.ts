import mongoose from "mongoose";

const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: [String],
        required: true
    },
    description: {
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
    },
    rating: {
        type: [{
            userId: String,
            no: Number
        }],
        required: false,
        default: []
    },
    comments: {
        type: [{
            userId: String,
            text: String,
            userName: String,
            replies: [{
                userId: String,
                text: String,
                userName: String,
                replyTo: String
              }]
        }],
        required: false,
        default: []
    },
    director: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Movies = mongoose.model('movies', moviesSchema)
export default Movies;