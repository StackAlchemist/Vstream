import axios from "axios"
import { useEffect, useState } from "react"
import { NavigateFunction, useNavigate, useParams } from "react-router-dom"
import { Movies } from "../types/Movies"
import { FaPlay } from "react-icons/fa"
import { toast } from "react-toastify"
import VideoPLayer from "../components/VideoPLayer"
import { StopCircle } from "lucide-react"

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movies | null>(null)
  const navigate: NavigateFunction = useNavigate()
  const authToken: string | null = localStorage.getItem('authToken')
  const [popup, showPopup]  = useState<boolean>(false)

  const fetchMovie = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + `/movies/get/${id}` ,
        {
          headers:{
            'Authorization': `Bearer ${authToken}`
          }
        }
      )
      setMovie(response.data)
      console.log(response.data)
    } catch (error) {
      console.error("Failed to fetch movie:", error)
    }
  }

  // const playVideo = async()=>{
  //   try {
  //      const response = axios.get(import.meta.env.VITE_API_URL + `/movies/getVideo/${id}`)
  //   } catch (error) {
  //     console.error('failed to load video:', error)
  //     toast.error('failed to load video')
  //   }
  // }


  useEffect(() => {
    fetchMovie()
  }, [id])

  if (!movie)
    return <p className="text-center text-white mt-10">Loading...</p>

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        <img
          src={movie.coverImg}
          alt={movie.title}
          className="w-full h-auto rounded-3xl shadow-2xl object-cover"
        />

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-sm text-gray-400 mb-4">
            Directed by: <span className="text-white">{movie.director}</span>
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {movie.genre.map((g, index) => (
              <span
                key={index}
                className="bg-purple-600/80 text-white text-xs px-3 py-1 rounded-full"
              >
                {g}
              </span>
            ))}
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">
            {movie.description}
          </p>

          <button onClick={()=>showPopup(!popup)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors duration-200 px-6 py-2 rounded-full w-fit text-sm font-medium shadow-lg">
            {!popup ? <><FaPlay /> Play</> : <> <StopCircle /> Stop</>}
          </button>
        </div>
      </div>
      {popup && <VideoPLayer onClose={() => showPopup(false)} movieId={movie._id} />}
    </div>
  )
}

export default MovieDetails
