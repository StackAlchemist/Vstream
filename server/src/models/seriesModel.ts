import mongoose from "mongoose";

const seriesSchema = new mongoose.Schema({
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
  seasons: {
    type: [{
      season_title: String,
      episodes: [{
        episode_title: {type: String, required: true},
        video: {
          type: String,
          required: true
        },
        description: { type: String, required: true }
      }]
    }],
    required: true
  },
  rating: {
    type: [{
      userId: String,
      no: Number
    }],
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
    default: []
  },
  director: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Series = mongoose.model('series', seriesSchema);
export default Series;
