import { useEffect, useState } from "react";

const SkeletonCard = () => (
  <div className="w-48 h-72 bg-gray-800 rounded-lg animate-pulse"></div>
);

const MovieCard = ({ title, image }: { title: string; image: string; }) => (
  <div className="w-48 flex-shrink-0 cursor-pointer">
    <div
      className="w-full h-72 object-cover bg-gray-700 rounded-lg hover:scale-105 transition-transform"
      style={{ backgroundImage: `url(${image})` }}
    ></div>
    <p className="mt-2 text-white text-sm text-center">{title}</p>
  </div>
);

const MyList = () => {
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<{ title: string; image: string }[]>([]);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setMovies([
        { title: "Lorem", image: "" },
        { title: "Ipsum", image: "" },
        { title: "Dolor", image: "" },
        { title: "Sit", image: "" },
        { title: "Amet", image: "" },
        { title: "Connecteur", image: "" },
      ]);
      setLoading(false);
    }, 2000);
  }, []);

  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-bold text-white">My List</h2>
      <p className="text-sm mb-4 text-[#f8f8f8]">These are the movies you added to your list.</p>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
          : movies.map((movie, i) => (
              <MovieCard key={i} title={movie.title} image={movie.image} />
            ))}
      </div>
    </div>
  );
};

export default MyList;
