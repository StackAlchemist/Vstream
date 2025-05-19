import axios from "axios"
import { useEffect, useState } from "react"
import { Series } from "../types/Series"
import { Movies } from "../types/Movies"
import { useNavigate } from "react-router-dom"
import { SyncLoader } from "react-spinners"

const View = () => {
  const [series, setSeries] = useState<Series[]>([])
  const [movies, setMovies] = useState<Movies[]>([])
  const navigate = useNavigate()
  const authToken: string | null = localStorage.getItem('authToken')
  const userId: string | null = localStorage.getItem('userId')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchSeries = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + `/series/get/view/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        })
        setSeries(response.data.series)
      } catch (error) {
        console.error("Error fetching series", error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchMovies = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + `/movies/get/view/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        })
        setMovies(response.data.movies)
      } catch (error) {
        console.error("Error fetching movies", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
    fetchSeries()
  }, [])

  useEffect(() => {
    if (!authToken) {
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
    <div className="text-white px-6 py-10 bg-gradient-to-b from-black to-gray-900 min-h-screen">
      {/* SERIES SECTION */}
      {series.length > 0 ? (
        <section className="mb-16">
          <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Uploaded Series</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {series.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/view-series/${item._id}`)}
                className="bg-gray-800 hover:bg-gray-700 hover:scale-[1.02] transition-all duration-300 ease-in-out p-4 rounded-xl cursor-pointer shadow-lg"
              >
                <img
                  src={item.coverImg}
                  alt={item.title}
                  className="w-full h-52 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold mb-1">{item.title}</h2>
                <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-gray-400 text-center mb-16">No series uploaded yet.</p>
      )}

      {/* MOVIES SECTION */}
      {movies.length > 0 ? (
        <section>
          <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Uploaded Movies</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {movies.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/view/${item._id}`)}
                className="bg-gray-800 hover:bg-gray-700 hover:scale-[1.02] transition-all duration-300 ease-in-out p-4 rounded-xl cursor-pointer shadow-lg"
              >
                <img
                  src={item.coverImg}
                  alt={item.title}
                  className="w-full h-52 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold mb-1">{item.title}</h2>
                <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <p className="text-gray-400 text-center">No movies uploaded yet.</p>
      )}
    </div>
  )
}

export default View
