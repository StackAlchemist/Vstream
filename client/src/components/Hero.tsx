import { Info } from "lucide-react";
import { FaPlay } from "react-icons/fa";
import { asset } from "../assets/assets";
import axios from "axios";
import { useEffect, useState } from "react";
import { Series } from "../types/Series";
import VideoPlayer from "./VideoPLayer";

const Hero = () => {
  const [series, setSeries] = useState<Series[]>([]);
  const authToken: string | null = localStorage.getItem('authToken')
  const [popup, showPopup] = useState<boolean>(false)

  const fetchSeries = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/series/get", {
        headers: {
          "Authorization": `Bearer ${authToken}`
        }
      });
      console.log(response.data.series);
      setSeries(response.data.series);
    } catch (error) {
      console.log(error, "error fetching series");
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const selectedSeries = series[1];

  return (
    <div
      className="relative h-[50vh] w-[97%] rounded-md shadow-lg bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${asset.heroImg})` }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-center px-8 text-white">
        <h1 className="text-3xl font-bold mb-2 drop-shadow-lg">
          {selectedSeries?.seasons[0]?.season_title || "Loading..."}
        </h1>
        <p className="text-lg max-w-xl mb-6 drop-shadow-md">
          {selectedSeries?.description || "Stay tuned for more series info!"}
        </p>

        <div className="flex gap-4">
          <button onClick={()=>showPopup(!popup)} className="flex items-center gap-2 bg-white text-black font-semibold px-5 py-3 rounded-md shadow-md hover:bg-gray-200 transition">
            <FaPlay /> <span>Play</span>
          </button>
          <button className="flex items-center gap-2 bg-gray-700 text-white px-5 py-3 rounded-md shadow-md hover:bg-gray-600 transition">
            <Info size={20} /> <span>More Info</span>
          </button>
        </div>
      </div>
     {popup && <VideoPlayer onClose={()=>showPopup(false)} movieId="" seriesId={selectedSeries._id} seasonIndex={0} episodeIndex={0}/>}
    </div>
  );
};

export default Hero;
