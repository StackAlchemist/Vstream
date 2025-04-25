import { useEffect, useState } from "react";

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

const TrendingMovies = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<{ title: string; image: string }[]>([]);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setMovies([
        { title: "Dune", image: "/images.jpg" },
        { title: "Oppenheimer", image: "/images.jpg" },
        { title: "Avatar 2", image: "/images.jpg" },
        { title: "John Wick 4", image: "/images.jpg" },
        { title: "The Batman", image: "/images.jpg" },
        { title: "Sinners", image: "/images.jpg" },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-bold text-white mb-4">Trending Now</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
          : movies.map((movie, i) => (
              <MovieCard key={i} title={movie.title} image={movie.image} />
            ))}
      </div>
    </div>
  );
};

export default TrendingMovies;
