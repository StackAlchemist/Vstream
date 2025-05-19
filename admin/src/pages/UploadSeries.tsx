import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadSeries = () => {
  const [isFirstUpload, setIsFirstUpload] = useState(true);
  const [seriesId, setSeriesId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    genre: [] as string[],
    description: '',
    director: '',
    season_title: '',
    episode_title: '',
    episode_description: '',
  });

  const [coverImg, setCoverImg] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const authToken: string | null = localStorage.getItem('authToken')
  const navigate = useNavigate()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenreChange = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter((g) => g !== genre)
        : [...prev.genre, genre],
    }));
  };

  const genresList = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy",
    "Horror", "Mystery", "Romance", "Sci-Fi", "Thriller",
  ];

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    if (!video) return alert("Please upload a video");

    data.append('video', video);

    if (isFirstUpload) {
      if (!coverImg) return alert("Please upload a cover image");

      data.append('coverImg', coverImg);
      data.append('title', formData.title);
      const director = localStorage.getItem('userId') || formData.director;
      data.append("director", director);
      data.append("genre", JSON.stringify(formData.genre));
      data.append('description', formData.description);

      const seasons = [
        {
          season_title: formData.season_title,
          episodes: [
            {
              episode_title: formData.episode_title,
              video: '', // backend assigns this
              description: formData.episode_description,
            },
          ],
        },
      ];

      data.append('seasons', JSON.stringify(seasons));

      try {
        const res = await axios.post(import.meta.env.VITE_API_URL + '/series/post', data, {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });
        alert('Series uploaded!');
        setSeriesId(res.data.series._id);
        setIsFirstUpload(false);
        navigate('/view')
      } catch (err) {
        console.error(err);
        alert('Failed to upload series');
      }
    } else {
      data.append('episodeTitle', formData.episode_title);
      data.append('description', formData.episode_description);
      data.append('seriesId', seriesId);

      try {
        await axios.put('/api/series', data);
        alert('Episode uploaded!');
      } catch (err) {
        console.error(err);
        alert('Failed to upload episode');
      }
    }
  };

  useEffect(() => {
    if(!authToken){
      navigate('/sign')
    }
  }, [authToken, navigate])

  return (
    <form
      onSubmit={handleUpload}
      className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-2xl shadow-xl"
    >
      <h1 className="text-3xl font-bold mb-6 text-indigo-400">🎞️ Upload Series</h1>

      <label className="block mb-1 font-medium">Title</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded mb-4"
        required
      />

      <div className="mb-4">
        <label className="block mb-1 font-medium">Genre</label>
        <div className="grid grid-cols-2 gap-2">
          {genresList.map((genre) => (
            <label key={genre} className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.genre.includes(genre)}
                onChange={() => handleGenreChange(genre)}
                className="accent-blue-500"
              />
              {genre}
            </label>
          ))}
        </div>
      </div>

      <label className="block mb-1 font-medium">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded mb-4"
        rows={4}
        required
      />

      <label className="block mb-1 font-medium">Cover Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCoverImg(e.target.files?.[0] || null)}
        className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded mb-4"
        required={isFirstUpload}
      />

      <label className="block mb-1 font-medium">Video File (First Episode Only)</label>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files?.[0] || null)}
        className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded mb-4"
        required
      />

      {/* <label className="block mb-1 font-medium">Director</label>
      <input
        type="text"
        name="director"
        value={formData.director}
        onChange={handleChange}
        className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded mb-4"
        required={isFirstUpload}
      /> */}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3 text-pink-400">📺 Seasons</h2>
        <div className="p-4 bg-gray-800 border border-gray-700 rounded mb-4">
          <label className="block text-sm mb-1">Season Title</label>
          <input
            type="text"
            name="season_title"
            value={formData.season_title}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 text-white p-2 rounded mb-3"
            required
          />

          <h3 className="font-medium text-sm mb-2 text-yellow-300">Episodes</h3>
          <div className="p-4 bg-gray-700 border border-gray-600 rounded">
            <label className="text-sm block mb-1">Episode Title</label>
            <input
              type="text"
              name="episode_title"
              value={formData.episode_title}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded mb-2"
              required
            />

            <label className="text-sm block mb-1">Episode Description</label>
            <textarea
              name="episode_description"
              value={formData.episode_description}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-600 text-white p-2 rounded"
              required
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded font-semibold transition"
      >
        Upload Series
      </button>
    </form>
  );
};

export default UploadSeries;
