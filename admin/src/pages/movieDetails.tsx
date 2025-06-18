import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Movies } from "../types/Movies"
import { FaPlay } from "react-icons/fa"
import { toast } from "react-toastify"
import { SyncLoader } from "react-spinners"
import { StopCircle } from "lucide-react"
import VideoPlayer from "../components/Videoplayer"

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movies | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const authToken: string | null = localStorage.getItem('authToken')
  const userId: string | null = localStorage.getItem('userId')
  const navigate = useNavigate()
  const [movieDirector, setMovieDirector] = useState<string | null>(null)
  const [popup, showPopup]  = useState<boolean>(false)

  const fetchMovie = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + `/movies/get/${id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            // 'userId': userId
          }
        }
      )
      setMovie(response.data.movie)
      setMovieDirector(response.data.director)
    } catch (error) {
      console.error("Failed to fetch movie:", error)
    } finally {
      setIsLoading(false)
    }
  }
  

  const deleteMovie = async () => {
    setIsLoading(true)
    try {
      const response = await axios.delete(
        import.meta.env.VITE_API_URL + `/movies/delete/${id}`, {
          
          headers: {
            'Authorization': `Bearer ${authToken}`,
          }
        }
      )
      if (response) {
        toast.success("Deleted successfully")
        navigate("/view")
      } else {
        toast.error("Failed to delete")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMovie()
  }, [id])

  useEffect(() => {
    if(!authToken){
      navigate('/sign')
    }
  }, [authToken, navigate])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">
        <SyncLoader color="#805ad5" />
        <p className="mt-4 text-lg">Loading your content...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <img
          src={movie?.coverImg}
          alt={movie?.title}
          className="w-full h-auto rounded-2xl shadow-2xl"
        />

        <div className="flex flex-col justify-between space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{movie?.title}</h1>
            <p className="text-sm text-gray-400 mb-3">
              Directed by: <span className="text-white">{movieDirector}</span>
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {movie?.genre?.map((g: string, index: number) => (
                <span
                  key={index}
                  className="bg-purple-600/80 text-white text-xs px-3 py-1 rounded-full"
                >
                  {g}
                </span>
              ))}
            </div>

            <p className="text-gray-300 leading-relaxed">
              {movie?.description}
            </p>

            <button onClick={()=>showPopup(!popup)}  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors duration-200 px-5 py-2 rounded-full mt-6 w-fit text-sm">
            {!popup ? <><FaPlay /> Play</> : <> <StopCircle /> Stop</>}
            </button>
          </div>
        </div>
      </div>




            {/* Comment List */}
            <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-6">Comments 
          {/* ({movie?.comments?.reduce((total, comment) => total + comment.replies.length, 0) || 0}) */}
          </h2>
        {movie.comments.length === 0 ? (
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-6">{movie.comments.map((comment, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-yellow-400 font-medium">{comment.userName}</p>
                <span className="text-xs text-gray-500">#{index + 1}</span>
              </div>
              <p className="text-gray-300 mt-2">{comment.text}</p>
              
              
          
              {/* Replies Display */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 pl-6 border-l border-gray-700 space-y-3">
                  {comment.replies.map((reply, rIndex) => (
                    <div
                      key={rIndex}
                      className="bg-gray-700 p-3 rounded-lg"
                    >
                      <p className="text-purple-400 font-medium">{reply.userName}</p>
                      <p className="text-gray-200">{reply.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          </div>
        )}
      </div>


      

      <div className="flex justify-center gap-6 mt-12">
        {/* <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-8 rounded-full transition-all duration-200">
          Edit
        </button> */}
        <button
          onClick={deleteMovie}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-8 rounded-full transition-all duration-200"
        >
          Delete
        </button>
      </div>

      {popup && <VideoPlayer onClose={() => showPopup(false)} movieId={id} />}
      
    </div>
  )
}

export default MovieDetails
