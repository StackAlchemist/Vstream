import axios from "axios"
import { useEffect, useState } from "react"
import { Series } from "../types/Series"
import { Movies } from "../types/Movies"
import { useNavigate } from "react-router-dom"

const View = () => {
  const [series, setSeries] = useState<Series[]>([])
  const [movies, setMovies] = useState<Movies []>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/series/get"
        )
        console.log(response.data) // inspect it
        setSeries(response.data.series) // access the array inside the `data` property
      } catch (error) {
        console.log(error, "error fetching series")
      }
    }

    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL + "/movies/get"
        )
        console.log(response.data) // inspect it
        setMovies(response.data) // access the array inside the `data` property
      } catch (error) {
        console.log(error, "error fetching series")
      }
    }

    fetchMovies()
    fetchSeries()
  }, [])

  return (
    <div className="text-white pt-4 ">
      <h1 className="text-2xl font-bold mb-4 mt-">Uploaded Series</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {series?.map((item) => (
          <div onClick={()=>navigate(`/view-series/${item._id}`)}  key={item._id} className="bg-gray-800 rounded-xl p-4">
            <img
              src={item.coverImg}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md mb-2"
            />
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-300">{item.description}</p>
            <p className="text-xs text-gray-400 mt-1">Directed by: {item.director}</p>
          </div>
        ))}
      </div>



      <h1 className="text-2xl font-bold mb-4 mt-10">Uploaded Series</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        {movies?.map((item) => (
          <div onClick={()=>navigate(`/view/${item._id}`)} key={item._id} className="bg-gray-800 rounded-xl p-4">
            <img
              src={item.coverImg}
              alt={item.title}
              className="w-full h-48 object-cover rounded-md mb-2"
            />
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-sm text-gray-300">{item.description}</p>
            <p className="text-xs text-gray-400 mt-1">Directed by: {item.director}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default View
