import { useNavigate, useParams } from "react-router-dom";
import { Series } from "../types/Series";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlay } from "react-icons/fa";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp } from "lucide-react";

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [serie, setSerie] = useState<Series | null>(null);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [showEpisodeModal, setShowEpisodeModal] = useState<string | null>(null);
  const [seasonTitle, setSeasonTitle] = useState("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [episodeDesc, setEpisodeDesc] = useState("");
  const [selectedSeasonId, setSelectedSeasonId] = useState("");
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [openSeasonIndex, setOpenSeasonIndex] = useState<number | null>(null);
  const authToken: string | null = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const fetchMovie = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/series/get/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSerie(response.data.series);
    } catch (error) {
      console.error("Failed to fetch movie:", error);
    }
  };

  const deleteSeries = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/series/delete/${id}`
      );
      if (response) {
        toast.success("Deleted successfully");
        navigate("/view");
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addSeason = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/series/${id}/add-season`,
        { season_title: seasonTitle },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success("Season added!");
      setSeasonTitle("");
      setShowSeasonModal(false);
      fetchMovie();
    } catch (err) {
      toast.error("Failed to add season");
    }
  };

  const addEpisode = async () => {
    try {
      const formData = new FormData();
      formData.append("ep_title", episodeTitle);
      formData.append("description", episodeDesc);
      if (selectedVideoFile) {
        formData.append("video", selectedVideoFile);
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/series/${id}/${selectedSeasonId}/add-episode`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Episode added!");
      setEpisodeTitle("");
      setEpisodeDesc("");
      setSelectedVideoFile(null);
      setShowEpisodeModal(null);
      fetchMovie();
    } catch (err) {
      toast.error("Failed to add episode");
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (!authToken) {
      navigate("/sign");
    }
  }, [authToken, navigate]);

  if (!serie) return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="text-white min-h-screen py-10 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        <img
          src={serie.coverImg}
          alt={serie.title}
          className="w-full h-auto rounded-2xl shadow-2xl"
        />
        <div className="flex flex-col space-y-4">
          <h2 className="font-bold text-4xl">{serie.title}</h2>
          <p className="text-gray-300 leading-relaxed">{serie.description}</p>

          <div className="space-y-6">
            {serie.seasons.map((season, seasonIndex) => {
              const isOpen = openSeasonIndex === seasonIndex;

              return (
                <div key={seasonIndex} className="border border-gray-700 rounded-xl overflow-hidden">
                  <button
                    onClick={() =>
                      setOpenSeasonIndex(isOpen ? null : seasonIndex)
                    }
                    className="w-full text-left px-4 py-3 bg-white/10 hover:bg-white/20 font-semibold text-lg transition-all duration-200 flex items-center justify-between"
                  >
                    Season {seasonIndex + 1} {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {isOpen && (
                    <div className="p-4 space-y-4 bg-white/5">
                      {season.episodes.map((episode, episodeIndex) => (
                        <div
                          key={episodeIndex}
                          className="flex gap-4 items-start bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-xl p-4"
                        >
                          <img
                            src={serie.coverImg}
                            alt="episode"
                            className="w-24 h-auto rounded-lg object-cover"
                          />
                          <div className="flex flex-col space-y-2">
                            <h3 className="text-lg font-semibold">
                              {episode.episode_title}
                            </h3>
                            <p className="text-sm text-gray-400">
                              {episode.description.slice(0, 100)}...
                            </p>
                            {/* <button className="inline-flex items-center gap-2 self-start mt-2 text-sm bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full transition-colors duration-200">
                              <FaPlay /> Play
                            </button> */}
                          </div>
                        </div>
                      ))}
                      <div className="mt-4">
                        <button
                          onClick={() => {
                            setShowEpisodeModal(season._id);
                            setSelectedSeasonId(season._id);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-200"
                        >
                          + Add Episode
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-12">
        <button
          onClick={() => setShowSeasonModal(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-8 rounded-full transition-all duration-200"
        >
          + Add Season
        </button>
        <button
          onClick={() => navigate(`/edit/${id}`)}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-8 rounded-full transition-all duration-200"
        >
          Edit
        </button>
        <button
          onClick={deleteSeries}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-8 rounded-full transition-all duration-200"
        >
          Delete
        </button>
      </div>


      
      {/* Comments Input */}
      <div className="max-w-4xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold mb-4">Leave a Comment</h2>

      </div>

      {/* Comment List */}
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-6">Comments ({serie.comments.length})</h2>
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
              
          
          
              {/* Replies Display */}
              {serie.comments.replies && serie.comments.replies.length > 0 && (
                <div className="mt-4 pl-6 border-l border-gray-700 space-y-3">
                  {serie.comments.replies.map((reply, rIndex) => (
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

      {/* Season Modal */}
      {showSeasonModal && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white">Add Season</h3>
            <input
              type="text"
              placeholder="Season Title"
              value={seasonTitle}
              onChange={(e) => setSeasonTitle(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSeasonModal(false)}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addSeason}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Episode Modal */}
      {showEpisodeModal && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-xl w-full max-w-md border border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-white">Add Episode</h3>
            <input
              type="text"
              placeholder="Episode Title"
              value={episodeTitle}
              onChange={(e) => setEpisodeTitle(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded mb-4"
            />
            <textarea
              placeholder="Episode Description"
              value={episodeDesc}
              onChange={(e) => setEpisodeDesc(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded mb-4"
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                if (e.target.files) setSelectedVideoFile(e.target.files[0]);
              }}
              className="w-full text-white mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEpisodeModal(null)}
                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={addEpisode}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeriesDetails;
