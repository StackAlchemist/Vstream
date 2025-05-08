import axios from "axios";
import { useEffect, useState } from "react";
import { Series } from "../types/Series";

const SkeletonCard = () => (
  <div className="w-48 h-72 bg-gray-800 rounded-lg animate-pulse"></div>
);

const MovieCard = ({ title, image }: { title: string; image: string }) => (
  <div className="w-48 flex-shrink-0 cursor-pointer">
    <img
      src={image}
      alt={title}
      className="w-full h-72 object-cover rounded-lg hover:scale-105 transition-transform"
    />
    <p className="mt-2 text-white text-sm text-center">{title}</p>
  </div>
);

const TvShows = () => {
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<Series[]>([]);

  const fetchSeries = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/series/get")
      setSeries(response.data.series)
    } catch (error) {
      console.log(error, "error fetching series")
    }
  }

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      fetchSeries()
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-bold text-white mb-4">TV Series</h2>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
          : series.map((movie, i) => (
              <MovieCard key={i} title={movie.title} image={movie.coverImg} />
            ))}
      </div>
    </div>
  );
};

export default TvShows;
