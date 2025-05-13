import axios from "axios";
import { useEffect, useState } from "react";
import { Movies } from "../types/Movies";
import { useNavigate } from "react-router-dom";



const SkeletonCard = () => (
  <div className="w-48 h-72 bg-gray-800 rounded-lg animate-pulse"></div>
);
const MovieCard = ({ title, image, id, navigate }: { title: string; image: string, id: string, navigate: React.FC }) => (
  <div onClick={()=>navigate(`/movie/${id}`)} className="w-48 relative flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300 group">
    <img
      src={image}
      alt={title}
      className="w-full h-72 object-cover rounded-lg shadow-md"
    />
    <div className="absolute bottom-0 left-0 w-full px-2 py-2 backdrop-blur-lg bg-black/47 border border-white/20 shadow-lg text-slate-200 rounded-b-lg">
      <p className=" text-sm text-center font-medium line-clamp-2">{title}</p>
    </div>
  </div>
);

const TrendingMovies = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<Movies[]>([]);
  const navigate = useNavigate()

  const fetchMovies = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/movies/get")
      setMovies(response.data)
    } catch (error) {
      console.log(error, "error fetching movies")
    }
  }

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      fetchMovies()
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-bold text-white mb-4">Trending Now</h2>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
          : movies.map((movie) => (
              <MovieCard key={movie._id} title={movie.title} image={movie.coverImg} id={movie._id} navigate={navigate}/>
            ))}
      </div>
    </div>
  );
};

export default TrendingMovies;
