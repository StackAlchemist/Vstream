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
  const [loading, setLoading] = useState<boolean>(true)
  const navigate: NavigateFunction = useNavigate()
  const authToken: string | null = localStorage.getItem('authToken')
  const [popup, showPopup]  = useState<boolean>(false)
  const [comment, setComment] = useState<string>("")
  const [director, setDirector] = useState<string>("")
  const userId: string | null = localStorage.getItem('userId')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyToComment, setReplyToComment] = useState<string>("")
  const fetchMovie = async () => {
    try {
      setLoading(true)
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
      setLoading(false)
    } catch (error) {
      console.error("Failed to fetch movie:", error)
      setLoading(false)
    }
  }

  const addComment = async () => {
    try {
      await axios.post(
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
      fetchMovie() // refresh after submission
    } catch (error) {
      console.error("Failed to add comment:", error)
      toast.error("Failed to add comment")
    }
  }
  

  const replyComment = async (replyTo: string, reply: string) => {
    try {
      await axios.post(
        import.meta.env.VITE_API_URL + `/movies/reply-comment`,
        {
          movieId: movie?._id,
          userId: userId,
          replyTo: replyTo,
          comment: reply
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      )
      toast.success("Reply added successfully")
      setReplyTo(null)
      setReplyToComment("")
      fetchMovie()
    } catch (error) {
      console.error("Failed to add reply:", error)
      toast.error("Failed to add reply")
    }
  }
  

  useEffect(() => {
    fetchMovie()
  }, [id]) // only run when the ID changes
  

  if (loading || !movie) {
    return (
      <div className="min-h-screen bg-black text-white px-4 py-10 animate-pulse">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div className="w-full h-[400px] bg-gray-800 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="w-3/4 h-10 bg-gray-700 rounded"></div>
            <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
            <div className="flex gap-2">
              <div className="w-16 h-6 bg-gray-700 rounded-full"></div>
              <div className="w-16 h-6 bg-gray-700 rounded-full"></div>
            </div>
            <div className="w-full h-24 bg-gray-700 rounded"></div>
            <div className="w-32 h-10 bg-gray-700 rounded-full"></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-16 space-y-4">
          <div className="w-40 h-6 bg-gray-700 rounded"></div>
          <div className="w-full h-28 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white px-4 py-10">
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

           {/* Comments Input */}
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
            className="self-end bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md font-semibold text-white"
          >
            Submit Comment
          </button>
        </div>
      </div>

      {/* Comment List */}
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-6">Comments ({movie.comments.length})</h2>
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
              
              <button
                className="text-purple-600 hover:text-purple-700"
                onClick={() => setReplyTo(comment.userId)}
              >
                Reply
              </button>
          
              {replyTo === comment.userId && (
                <div className="mt-2">
                  <textarea
                    value={replyToComment}
                    onChange={(e) => setReplyToComment(e.target.value)}
                    placeholder="Write your reply..."
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-600"
                    rows={2}
                  ></textarea>
                  <button
                    onClick={() => replyComment(comment.userId, replyToComment) }
                    className="mt-2 bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-md font-semibold text-white"
                  >
                    Submit Reply
                  </button>
                </div>
              )}
          
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

      {popup && <VideoPLayer onClose={() => showPopup(false)} movieId={movie._id} />}
    </div>
  )
}

export default MovieDetails
