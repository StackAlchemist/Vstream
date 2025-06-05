import { useEffect, useState } from "react";

interface Rating {
  userId: string;
  no: number;
}

interface ViewershipData {
  title: string;
  rating: Rating[];
  coverImg: string;
}

const Viewership = () => {
  const [viewershipData, setViewershipData] = useState<ViewershipData[]>([]);

  useEffect(() => {
    const fetchViewership = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/viewership/get`);
        const data: ViewershipData[] = await response.json();
        setViewershipData(data);
      } catch (error) {
        console.error("Failed to fetch viewership data", error);
      }
    };

    fetchViewership();
  }, []);

  const getAverageRating = (ratings: Rating[]): string => {
    if (!ratings || ratings.length === 0) return "0.00";
    const total = ratings.reduce((sum, r) => sum + r.no, 0);
    return (total / ratings.length).toFixed(2);
  };

  return (
    <div className="min-h-screen  text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Viewership Stats</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {viewershipData.map((item, index) => (
          <div
            key={index}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300"
          >
            <img
              src={item.coverImg}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-sm">
                <span className="font-medium">Average Rating:</span>{" "}
                <span className="text-yellow-400">{getAverageRating(item.rating)}</span> / 5
              </p>
              <p className="text-sm">
                <span className="font-medium">Users Rated:</span>{" "}
                {item.rating?.length || 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Viewership;
