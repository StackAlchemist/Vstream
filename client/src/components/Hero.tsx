import { Info } from "lucide-react";
import { FaPlay } from "react-icons/fa";

const Hero = () => {
  return (
    <div className="h-[50vh] w-[97%] bg-gray-400 rounded-md shadow-lg">
      <div className="flex flex-col gap-1 mt-10 ml-5">
        <div className="bg-gray-600 shadow-lg h-4 w-52 rounded-full"></div>
        <div className="bg-gray-600 shadow-lg h-4 w-64 rounded-full"></div>
        <div className="bg-gray-600 shadow-lg h-4 w-72 rounded-full"></div>
      </div>

      <div className="flex justify-start mt-10 items-center h-full">
        <button className="flex items-center justify-center gap-2 bg-gray-600 h-12 w-32 rounded-md m-4 shadow-lg hover:bg-gray-700 transition-colors duration-200 ease-in-out text-white">
          <p>Play</p>
          <FaPlay color="white"/>
          </button>
        <button className="flex items-center justify-center gap-2 bg-gray-600 h-12 w-32 rounded-md m-4 shadow-lg hover:bg-gray-700 transition-colors duration-200 ease-in-out text-white">
          <p>See info</p>
          <Info />
        </button>
      </div>
      
    </div>
  )
}

export default Hero
