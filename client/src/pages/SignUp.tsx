import axios from "axios";
import { useEffect, useState } from "react";
import { Series } from "../types/Series";
import { Movies } from "../types/Movies";
import { useNavigate } from "react-router-dom";

const View = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const [movies, setMovies] = useState<Movies[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/series/get"
        );
        setSeries(response.data.series);
      } catch (error) {
        console.log(error, "error fetching series");
      }
    };

    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/movies/get"
        );
        setMovies(response.data);
      } catch (error) {
        console.log(error, "error fetching movies");
      }
    };

    fetchMovies();
    fetchSeries();
  }, []);

  if (!series && !movies) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="text-white px-6 py-10 bg-gradient-to-b from-black to-gray-900 min-h-screen">
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-6">Uploaded Series</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {series.map((item) => (
            <div
              onClick={() => navigate(`/view-series/${item._id}`)}
              key={item._id}
              className="bg-gray-800 hover:bg-gray-700 transition p-4 rounded-lg cursor-pointer shadow-md">
              <img
                src={item.coverImg}
                alt={item.title}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-300 line-clamp-2">
                {item.description}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Directed by: {item.director}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section>
        {" "}
        <h1 className="text-3xl font-bold mb-6">Uploaded Movies</h1>{" "}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {" "}
          {movies.map((item) => (
            <div
              onClick={() => navigate(`/view/${item._id}`)}
              key={item._id}
              className="bg-gray-800 hover:bg-gray-700 transition p-4 rounded-lg cursor-pointer shadow-md">
              {" "}
              <img
                src={item.coverImg}
                alt={item.title}
                className="w-full h-48 object-cover rounded-md mb-3"
              />{" "}
              <h2 className="text-lg font-semibold">{item.title}</h2>{" "}
              <p className="text-sm text-gray-300 line-clamp-2">
                {item.description}
              </p>{" "}
              <p className="text-xs text-gray-400 mt-1">
                Directed by: {item.director}
              </p>{" "}
            </div>
          ))}{" "}
        </div>{" "}
      </section>{" "}
    </div>
  );
};
