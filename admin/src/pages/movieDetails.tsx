import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Movies } from "../types/Movies"
import { FaPlay } from "react-icons/fa"
import { toast } from "react-toastify"

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movies | null>(null)
  const navigate = useNavigate()

  const fetchMovie = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + `/movies/get/${id}`
      )
      setMovie(response.data)
      console.log(response.data)
    } catch (error) {
      console.error("Failed to fetch movie:", error)
    }
  }

  const deleteMovie = async () => {
    try {
      const response = await axios.delete(
        import.meta.env.VITE_API_URL + `/movies/delete/${id}`
      )
      if (response) {
        toast.success("Deleted successfully")
        navigate("/view")
      } else {
        toast.error("Failed to delete")
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchMovie()
  }, [id])

  if (!movie)
    return <p className="text-center text-white mt-10">Loading...</p>

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <img
          src={movie.coverImg}
          alt={movie.title}
          className="w-full h-auto rounded-2xl shadow-2xl"
        />

        <div className="flex flex-col justify-between space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <p className="text-sm text-gray-400 mb-3">
              Directed by: <span className="text-white">{movie.director}</span>
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genre.map((g, index) => (
                <span
                  key={index}
                  className="bg-purple-600/80 text-white text-xs px-3 py-1 rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-300 leading-relaxed">
              {movie.description}
            </p>

            <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors duration-200 px-5 py-2 rounded-full mt-6 w-fit text-sm">
              <FaPlay /> Play
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-12">
        <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-8 rounded-full transition-all duration-200">
          Edit
        </button>
        <button
          onClick={deleteMovie}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-8 rounded-full transition-all duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default MovieDetails
