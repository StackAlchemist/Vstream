import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Movies } from "../types/Movies"
import { Play, PlayCircle, PlayIcon } from "lucide-react"
import { FaPlay } from "react-icons/fa"


const MovieDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movies | null>(null)

  const fetchMovie = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + `/movies/get/${id}`)
      setMovie(response.data) // assuming backend returns { success, data }
      console.log(response.data)
    } catch (error) {
      console.error("Failed to fetch movie:", error)
    }
  }

  useEffect(() => {
    fetchMovie()
  }, [id])

  if (!movie) return <p className="text-center text-white mt-10">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8">
      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
        <img
          src={movie.coverImg}
          alt={movie.title}
          className="w-full h-auto rounded-lg shadow-lg"
        />

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <p className="text-sm text-gray-400 mb-4">Directed by: {movie.director}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre.map((g, index) => (
                <span
                  key={index}
                  className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-300">{movie.description}</p>
            <button className="flex gap-3 items-center bg-purple-600 rounded-full px-3 py-2 mt-2"> Play <FaPlay /></button>
          </div>
          

          {/* <div className="mt-6 text-sm text-gray-400">
            <p>Release Date: {new Date(movie.releaseDate).toLocaleDateString()}</p>
            <p>Rating: {movie.rating} / 10</p>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
