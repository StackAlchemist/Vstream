import axios from "axios"
import { useEffect, useState } from "react"
import { NavigateFunction, useNavigate, useParams } from "react-router-dom"
import { Movies } from "../types/Movies"
import { FaPlay } from "react-icons/fa"
import { toast } from "react-toastify"
import VideoPLayer from "../components/VideoPLayer"
import { StopCircle } from "lucide-react"
import Rating from "../components/Rating"

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<Movies | null>(null)
  const navigate: NavigateFunction = useNavigate()
  const authToken: string | null = localStorage.getItem('authToken')
  const [popup, showPopup]  = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const [director, setDirector] = useState<string>("")
  const userId: string | null = localStorage.getItem('userId')

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
      setMovie(response.data.movie)
      setDirector(response.data.director)
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

  const addComment = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + `/movies/add-comment`,
        {
          movieId: movie?._id,
          userId: userId,
          comment: comment
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      )
      setComment("")
      toast.success("Comment added successfully")
    } catch (error) {
      console.error("Failed to add comment:", error)
      toast.error("Failed to add comment")
    }
  }

  useEffect(() => {
    fetchMovie()
  }, [id, comment])

  if (!movie)
    return <p className="text-center text-white mt-10">Loading...</p>

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-4 py-10">

      <div></div>
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        <img
          src={movie.coverImg}
          alt={movie.title}
          className="w-full h-auto rounded-3xl shadow-2xl object-cover"
        />

  <div className="flex-col gap-4">

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-sm text-gray-400 mb-4">
            Directed by: <span className="text-white">{director}</span>
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
  <Rating onRate={(val) => {console.log(val)}} movieId={movie._id} token={authToken}/>
        </div>
        
      </div>

{/* Comment Input Section */}
<div className="max-w-4xl mx-auto mt-16">
  <h2 className="text-2xl font-semibold mb-4">Leave a Comment</h2>
  <div className="bg-gray-800 p-4 rounded-xl shadow-md flex flex-col gap-4">
    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder="Write your comment..."
      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
      rows={4}
    ></textarea>
    <button
      onClick={addComment}
      className="self-end bg-purple-600 hover:bg-purple-700 transition-colors px-6 py-2 rounded-md font-semibold text-white"
    >
      Submit Comment
    </button>
  </div>
</div>

{/* Comment Display Section */}
<div className="max-w-4xl mx-auto mt-10">
  <h2 className="text-2xl font-semibold mb-6">Comments ({movie.comments.length})</h2>
  {movie.comments.length === 0 ? (
    <p className="text-gray-400">No comments yet. Be the first to comment!</p>
  ) : (
    <div className="space-y-6">
      {movie.comments.map((movieComment: any, index: number) => (
        <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-yellow-400 font-medium">{movieComment.userName}</p>
            <span className="text-xs text-gray-500">#{index + 1}</span>
          </div>
          <p className="text-gray-300 mt-2">{movieComment.text}</p>
        </div>
      ))}
    </div>
  )}
</div>



      {popup && <VideoPLayer onClose={() => showPopup(false)} movieId={movie._id} />}
    </div>
  )
}

export default MovieDetails
