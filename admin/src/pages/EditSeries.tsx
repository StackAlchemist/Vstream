import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const EditSeries = () => {
  const { id } = useParams();
  const [series, setSeries] = useState<any>(null);
  const [seasonOneId, setSeasonOneId] = useState<string>("");
  const [episodeTitle, setEpisodeTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
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

        const seriesData = response.data.series;
        setSeries(seriesData);
        const firstSeason = seriesData?.seasons?.[0];
        if (firstSeason) {
          //set id of first season
          setSeasonOneId(firstSeason._id);
        } else {
          toast.error("No seasons found in this series.");
        }
      } catch (error) {
        toast.error("Failed to fetch series data.");
        console.error(error);
      }
    };

    fetchSeries();
  }, [id]);

  const handleAddEpisode = async () => {
    if (!seasonOneId || !episodeTitle || !description || !videoFile) {
      toast.error("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("ep_title", episodeTitle);
    formData.append("description", description);
    formData.append("video", videoFile);
    formData.append("id", id!);
    formData.append("s_id", seasonOneId);

    try {
      await axios.put(
        import.meta.env.VITE_API_URL + `/series/edit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Episode uploaded successfully!");
      setEpisodeTitle("");
      setDescription("");
      setVideoFile(null);
      navigate(`/view-series/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload episode.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12 flex flex-col items-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">
        You are editing <span className="text-yellow-400">{series?.title}</span>
      </h1>

      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Add New Episode to Season 1</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Episode Title</label>
          <input
            type="text"
            value={episodeTitle}
            onChange={(e) => setEpisodeTitle(e.target.value)}
            placeholder="Enter episode title"
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Episode description"
            rows={3}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded-md"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium">Upload Video</label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            className="w-full text-white"
          />
        </div>

        <button
          onClick={handleAddEpisode}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-md"
        >
          Upload Episode
        </button>
      </div>
    </div>
  );
};

export default EditSeries;
