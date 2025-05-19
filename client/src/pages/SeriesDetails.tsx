import { NavigateFunction, useNavigate, useParams } from "react-router-dom"
import { Series } from "../types/Series"
import { useEffect, useState } from "react"
import axios from "axios"
import { FaPlay } from "react-icons/fa"
import { toast } from "react-toastify"
import { SyncLoader } from "react-spinners"
import VideoPlayer from "../components/VideoPLayer"

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [serie, setSerie] = useState<Series | null>(null)
  const navigate: NavigateFunction = useNavigate()
  const authToken: string | null = localStorage.getItem('authToken')
  const [popup, showPopup] = useState<boolean>(false)
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState<number | null>(null)
const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState<number | null>(null)

  const fetchSeries = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + `/series/get/${id}`,
        {
          headers:{
            'Authorization': `Bearer ${authToken}`
          }
        }
      )
      setSerie(response.data.series)
      console.log(response.data)
    } catch (error) {
      console.error("Failed to fetch series:", error)
    }
  }

  useEffect(() => {
    fetchSeries()
  }, [id])

  if (!serie)
    return <div className="text-center text-white mt-10 h-screen mx-auto justify-center items-center flex flex-col gap-2">
        <SyncLoader color="#9810fa" />
        Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        <img
          src={serie.coverImg}
          alt={serie.title}
          className="w-full h-auto rounded-2xl shadow-2xl"
        />

        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-3">{serie.title}</h1>
            <p className="text-gray-300 leading-relaxed">
              {serie.description}
            </p>
          </div>

          <div className="space-y-10">
            {serie.seasons.map((season, seasonIndex) => (
              <div key={seasonIndex}>
                <h2 className="text-2xl font-semibold mb-2">
                  {season.season_title}
                </h2>

                <div className="space-y-4">
                  {season.episodes.map((episode, episodeIndex) => (
                    <div
                      key={episodeIndex}
                      className="flex gap-5 items-start bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-2xl p-4"
                    >
                      <img
                        src={serie.coverImg}
                        alt={episode.episode_title}
                        className="w-24 h-32 object-cover rounded-lg shadow-md"
                      />
                      <div className="flex flex-col space-y-2">
                        <h3 className="text-lg font-semibold">
                          {episode.episode_title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-snug">
                          {episode.description.slice(0, 100)}...
                        </p>
                        <button onClick={() => {
                              setSelectedSeasonIndex(seasonIndex)
                              setSelectedEpisodeIndex(episodeIndex)
                          showPopup(!popup)}} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 transition-colors duration-200 px-4 py-2 rounded-full w-fit text-sm mt-1">
                          <FaPlay /> Play
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {popup && <VideoPlayer onClose={() => showPopup(false)} movieId={""} seriesId={serie._id}
    seasonIndex={selectedSeasonIndex}
    episodeIndex={selectedEpisodeIndex}/>}
    </div>
  )
}

export default SeriesDetails
