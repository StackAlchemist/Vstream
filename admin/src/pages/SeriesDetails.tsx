import { useParams } from "react-router-dom"
import { Series } from "../types/Series"
import { useEffect, useState } from "react"
import axios from "axios"
import { FaPlay } from "react-icons/fa"

const SeriesDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [serie, setSerie] = useState<Series | null>(null)

  const fetchMovie = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + `/series/get/${id}`
      )
      setSerie(response.data.series)
      console.log(response.data)
    } catch (error) {
      console.error("Failed to fetch movie:", error)
    }
  }

  useEffect(() => {
    fetchMovie()
  }, [id])

  if (!serie)
    return <p className="text-center text-white mt-10">Loading...</p>

  return (
    <div className="text-white min-h-screen py-10 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        <img
          src={serie.coverImg}
          alt={serie.title}
          className="w-full h-auto rounded-2xl shadow-2xl"
        />
        <div className="flex flex-col space-y-4">
          <h2 className="font-bold text-4xl">{serie.title}</h2>
          <p className="text-gray-300 leading-relaxed">{serie.description}</p>

          <div className="space-y-6">
            {serie.seasons.map((season, seasonIndex) => (
              <div key={seasonIndex}>
                <select className="w-full bg-white/10 text-white backdrop-blur-md rounded-md px-4 py-2">
                  <option className="text-black" value="">
                    {season.season_title}
                  </option>
                </select>

                <div className="mt-4 space-y-4">
                  {season.episodes.map((episode, episodeIndex) => (
                    <div
                      key={episodeIndex}
                      className="flex gap-4 items-start bg-white/5 hover:bg-white/10 transition-colors duration-200 rounded-xl p-4"
                    >
                      <img
                        src={serie.coverImg}
                        alt="episode"
                        className="w-24 h-auto rounded-lg object-cover"
                      />
                      <div className="flex flex-col space-y-2">
                        <h3 className="text-lg font-semibold">
                          {episode.episode_title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {episode.description.slice(0, 100)}...
                        </p>
                        <button className="inline-flex items-center gap-2 self-start mt-2 text-sm bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full transition-colors duration-200">
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
      {/* Debug ID (optional) */}
      {/* <p className="text-xs text-gray-600 text-center mt-10">Series ID: {id}</p> */}
    </div>
  )
}

export default SeriesDetails
