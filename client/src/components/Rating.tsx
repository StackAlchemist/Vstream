import { useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

interface RatingProps {
  onRate?: (value: number) => void;
  initialValue?: number;
  movieId: string;
  token: string | null;
}

const Rating = ({ onRate, initialValue = 0, movieId, token }: RatingProps) => {
  const [selected, setSelected] = useState<number>(initialValue);
  // const [userRating, setRated] = useState<number>(0);

  
  const getRated = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + `/movies/rated/${movieId}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            userId: localStorage.getItem("userId")
          }
        }
      )
      setSelected(response.data.rating.no)
    } catch (error) {
      console.error("Failed to get rated:", error)
      toast.error("Failed to get rated")
    }
  }

  const handleClick = async (value: number) => {
    setSelected(value);
    onRate?.(value);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/movies/rate/${movieId}`, {
        rating: value,
        userId: localStorage.getItem("userId"),
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success("Rated successfully")
      getRated()
    } catch (error) {
      console.error("Failed to rate movie:", error);
      toast.error("Failed to rate movie")
    }
  };

  

  useEffect(() => {
    getRated()
  }, [movieId])

  return (
    <div className="flex-col gap-6 mt-4 items-center">
      <span className="text-white font-medium mb-2">What would you rate this outta 5?</span>
      <div className="flex gap-3">

      {[1, 2, 3, 4, 5].map((num) => (
        <button
        key={num}
        onClick={() => handleClick(num)}
        className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors duration-200 
          ${
            selected >= num
            ? "bg-purple-600 text-white border-purple-700"
            : "bg-gray-800 text-gray-400 border-gray-600 hover:border-purple-400 hover:text-purple-300"
            }`}
            >
          {num}
        </button>
      ))}
      </div>
    </div>
  );
};

export default Rating;
