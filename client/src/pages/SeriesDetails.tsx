import { useParams } from "react-router-dom";
import { Series } from "../types/Series";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlay } from "react-icons/fa";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import VideoPlayer from "../components/VideoPLayer";
import SeriesRating from "../components/SeriesRating";

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [serie, setSerie] = useState<Series | null>(null);
  const authToken = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  const [popup, showPopup] = useState(false);
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState<number | null>(null);
  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [director, setDirector] = useState("");
  const [replyTo, setReplyTo] = useState("");
  const [replyToComment, setReplyToComment] = useState("");
  const fetchSeries = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + `/series/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSerie(response.data.series);
      setDirector(response.data.director);
    } catch (error) {
      console.error("Failed to fetch series:", error);
    }
  };

  const addComment = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_API_URL + `/series/add-comment`,
        {
          seriesId: serie?._id,
          userId: userId,
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment");
      console.error("Failed to add comment:", error);
    }
  };

  const replyComment = async () => {
    try {
      await axios.post(
        import.meta.env.VITE_API_URL + `/series/reply-comment`,
        {
          seriesId: serie?._id,
          userId: userId,
          comment: replyToComment, 
          replyTo: replyTo
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setComment("");
      toast.success("Reply added successfully");
    } catch (error) {
      toast.error("Failed to add reply");
      console.error("Failed to add reply:", error);
    }
  }

  useEffect(() => {
    fetchSeries();
  }, [id, comment]);

  const playNextEpisode = () => {
    if (selectedSeasonIndex === null || selectedEpisodeIndex === null || !serie) return;
  
    const currentSeason = serie.seasons[selectedSeasonIndex];
  
    if (selectedEpisodeIndex < currentSeason.episodes.length - 1) {
      // Go to next episode in same season
      setSelectedEpisodeIndex(selectedEpisodeIndex + 1);
      showPopup(true);
    } else if (selectedSeasonIndex < serie.seasons.length - 1) {
      // Go to first episode in next season
      setSelectedSeasonIndex(selectedSeasonIndex + 1);
      setSelectedEpisodeIndex(0);
      showPopup(true);
    } else {
      toast.info("You’ve finished the last episode!");
    }
  };
  

  if (!serie)
    return (
      <div className="text-center text-white mt-10 h-screen flex flex-col justify-center items-center">
        <SyncLoader color="#9810fa" />
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <img
          src={serie.coverImg}
          alt={serie.title}
          className="w-full h-auto rounded-2xl shadow-2xl"
        />

        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-3">{serie.title}</h1>
            <p className="text-gray-200 mb-3">Directed by: {director}</p>

            {/* Genre Section */}
            {serie.genre && (
              <div className="flex flex-wrap gap-2 mb-3">
                {Array.isArray(serie.genre) ? (
                  serie.genre.map((genre) => (
                    <span
                      key={genre}
                      className="text-sm text-white bg-purple-600 px-3 py-1 rounded-full"
                    >
                      {genre}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-white bg-purple-600 px-3 py-1 rounded-full">
                    {serie.genre}
                  </span>
                )}
              </div>
            )}

            <p className="text-gray-300 leading-relaxed">{serie.description}</p>
          </div>

          {/* Season Picker */}
          <div className="mb-10 max-w-md">
            <label htmlFor="seasonSelect" className="block mb-2 text-lg font-semibold">
              Select Season
            </label>
            <select
              id="seasonSelect"
              value={selectedSeasonIndex ?? ""}
              onChange={(e) => {
                const index = e.target.value === "" ? null : parseInt(e.target.value);
                setSelectedSeasonIndex(index);
                setSelectedEpisodeIndex(index !== null ? 0 : null); // auto-select first episode
              }}
              className="w-full p-3 rounded-md bg-gray-800 text-white border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">-- Choose Season --</option>
              {serie.seasons.map((season, index) => (
                <option key={index} value={index}>
                  {season.season_title || `Season ${index + 1}`}
                </option>
              ))}
            </select>
          </div>

          {/* Episodes */}
          {selectedSeasonIndex !== null && (
            <div className="space-y-10">
              <div className="mb-10">
                {/* Episode Circles */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {serie.seasons[selectedSeasonIndex].episodes.map((episode, episodeIndex) => {
                    const isSelected = episodeIndex === selectedEpisodeIndex;
                    return (
                      <button
                        key={episodeIndex}
                        onClick={() => setSelectedEpisodeIndex(episodeIndex)}
                        className={`w-12 h-12 flex items-center justify-center rounded-full border-2 text-sm font-semibold transition-all
                        ${
                          isSelected
                            ? "bg-purple-600 border-purple-600 text-white"
                            : "bg-gray-700 border-gray-500 text-gray-300 hover:bg-purple-600 hover:border-purple-600 hover:text-white"
                        }`}
                        title={episode.episode_title}
                      >
                        {episodeIndex + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Episode Info */}
                {selectedEpisodeIndex !== null && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex gap-5 shadow-xl">
                    <img
                      src={serie.coverImg}
                      alt={serie.seasons[selectedSeasonIndex].episodes[selectedEpisodeIndex].episode_title}
                      className="w-28 h-36 object-cover rounded-md shadow"
                    />
                    <div className="flex flex-col space-y-3">
                      <h3 className="text-xl font-semibold">
                        {serie.seasons[selectedSeasonIndex].episodes[selectedEpisodeIndex].episode_title}
                      </h3>
                      <p className="text-gray-300">
                        {serie.seasons[selectedSeasonIndex].episodes[selectedEpisodeIndex].description}
                      </p>
                      <button
                        onClick={() => showPopup(true)}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full text-sm w-fit"
                      >
                        <FaPlay /> Play Episode
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <SeriesRating movieId={serie._id} token={authToken} />
        </div>
      </div>

      {/* Comments Input */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold mb-4">Leave a Comment</h2>
        <div className="bg-gray-800 p-4 rounded-xl shadow-md flex flex-col gap-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your comment..."
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
            rows={4}
          ></textarea>
          <button
            onClick={addComment}
            className="self-end bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md font-semibold text-white"
          >
            Submit Comment
          </button>
        </div>
      </div>

      {/* Comment List */}
      <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6">Comments ({serie.comments.length + serie.comments.reduce((acc, comment) => acc + comment.replies.length, 0)})</h2>
        {serie.comments.length === 0 ? (
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-6">{serie.comments.map((comment, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-yellow-400 font-medium">{comment.userName}</p>
                <span className="text-xs text-gray-500">#{index + 1}</span>
              </div>
              <p className="text-gray-300 mt-2">{comment.text}</p>
              
              <button
                className="text-purple-600 hover:text-purple-700"
                onClick={() => setReplyTo(comment.userId)}
              >
                Reply
              </button>
          
              {replyTo === comment.userId && (
                <div className="mt-2">
                  <textarea
                    value={replyToComment}
                    onChange={(e) => setReplyToComment(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
                    rows={2}
                  ></textarea>
                  <button
                    onClick={replyComment}
                    className="mt-2 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md font-semibold text-white"
                  >
                    Submit Reply
                  </button>
                </div>
              )}
          
              {/* Replies Display */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-6 border-l border-gray-700 space-y-3">
                  {comment.replies.map((reply, rIndex) => (
                    <div
                      key={rIndex}
                      className="bg-gray-700 p-3 rounded-lg"
                    >
                      <p className="text-purple-400 font-medium">{reply.userName}</p>
                      <p className="text-gray-200">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          </div>
        )}
      </div>

      {/* Popup Video Player */}
      {popup && (
        <VideoPlayer
          onClose={() => showPopup(false)}
          movieId={""}
          seriesId={serie._id}
          seasonIndex={selectedSeasonIndex}
          episodeIndex={selectedEpisodeIndex}
          onEnded={playNextEpisode}
        />
      )}
    </div>
  );
};

export default SeriesDetails;
