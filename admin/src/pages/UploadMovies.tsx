/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const genresList = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy",
  "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller",
];

const inputStyles =
  "w-full bg-gray-800 border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

const UploadMovies = () => {
  const [formData, setFormData] = useState({
    title: "",
    genre: [] as string[],
    description: "",
    director: "",
  });

  const [coverImg, setCoverImg] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const authToken: string | null = localStorage.getItem('authToken')
  const navigate = useNavigate()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(value)
        ? prev.genre.filter(g => g !== value)
        : [...prev.genre, value],
    }));
  };

  const handleUpload = async () => {
    if (!coverImg || !video) {
      toast.warn("Cover image and video are required");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    const director = localStorage.getItem('userId');
    if (director) {
      data.append("director", director);
    }
    data.append("genre", JSON.stringify(formData.genre));
    data.append("coverImg", coverImg);
    data.append("video", video);

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/movies/post",
        data, {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        }
      );
      toast.success("Movie uploaded!");
      console.log(res.data);
      navigate('/view')
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload movie");
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
      setCoverImg(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoPreview(URL.createObjectURL(file));
      setVideo(file);
    }
  };

  useEffect(() => {
    if(!authToken){
      navigate('/sign')
    }
  }, [authToken, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-8">
      <div className="w-full max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-6 shadow-xl text-white">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">Upload Movie 🎬</h2>

        <div className="space-y-4">
          <input
            name="title"
            placeholder="Title"
            className={inputStyles}
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {genresList.map((genre) => (
                <label
                  key={genre}
                  className="flex items-center gap-2 text-sm text-gray-300"
                >
                  <input
                    type="checkbox"
                    value={genre}
                    checked={formData.genre.includes(genre)}
                    onChange={() => handleGenreChange(genre)}
                    className="accent-blue-500"
                  />
                  {genre}
                </label>
              ))}
            </div>

          <textarea
            name="description"
            placeholder="Description"
            rows={4}
            className={inputStyles}
            onChange={handleChange}
          />

          {/* <input
            name="director"
            placeholder="Director"
            className={inputStyles}
            onChange={handleChange}
          /> */}

          <div>
            <label className="block text-sm mb-1 text-gray-300">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="w-full bg-gray-800 p-2 rounded-lg border border-gray-600 file:text-white file:bg-blue-600 file:border-0 file:px-4 file:py-1 hover:file:bg-blue-700"
            />
            {coverPreview && (
              <img
                src={coverPreview}
                alt="Cover Preview"
                className="rounded-lg mt-2 w-full max-h-60 object-cover"
              />
            )}
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">Movie File</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full bg-gray-800 p-2 rounded-lg border border-gray-600 file:text-white file:bg-purple-600 file:border-0 file:px-4 file:py-1 hover:file:bg-purple-700"
            />
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="rounded-lg mt-2 w-full max-h-60 bg-black"
              />
            )}
          </div>

          <button
            onClick={handleUpload}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition duration-200 mt-4"
          >
            Upload Movie
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadMovies;
