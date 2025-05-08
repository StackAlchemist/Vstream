
const fetchSeries = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/series/get")
      setSeries(response.data.series)
    } catch (error) {
      console.log(error, "error fetching series")
    }
  }

  const fetchMovies = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_API_URL + "/movies/get")
      setMovies(response.data)
    } catch (error) {
      console.log(error, "error fetching movies")
    }
  }