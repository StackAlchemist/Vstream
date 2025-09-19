import axios from "axios";
import React, { useEffect, useState } from "react";
import { Series } from "../types/Series";
import { NavigateFunction, useNavigate } from "react-router-dom";

const SkeletonCard = () => (
  <div className="w-48 h-72 bg-gray-800 rounded-lg animate-pulse"></div>
);

const MovieCard = ({ title, image, id, navigate }: { title: string; image: string, id: string, navigate: NavigateFunction}) => (
  <div onClick={()=>navigate(`/series/${id}`)} className="w-48 relative flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300 group">
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


const TvShows = () => {
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<Series[]>([]);
  const navigate = useNavigate()
  const authToken: string | null = localStorage.getItem('authToken')

  const fetchSeries = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/series/get", {
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      })
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
          : series.map((movie) => (
              <MovieCard key={movie._id} title={movie.title} image={movie.coverImg} id={movie._id} navigate={navigate}/>
            ))}
      </div>
    </div>
  );
};

export default TvShows;
