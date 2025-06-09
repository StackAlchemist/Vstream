import { Route, Routes, useLocation } from "react-router-dom"
import Home from './pages/Home'
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Movies from "./pages/Movies"
import TvShowPg from "./pages/TvShowPg"
import NewAndPop from "./pages/NewAndPop"
import MyListPg from './pages/MyListPg'
import { ToastContainer } from "react-toastify"
import MovieDetails from "./pages/MovieDetails"
import SeriesDetails from "./pages/SeriesDetails"
import { useEffect } from "react"
import { checkSessionAndLogout } from "../utils/session"  

const App = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/login") {
      checkSessionAndLogout();

      const interval = setInterval(() => {
        checkSessionAndLogout();
      }, 20 * 60 * 1000); // every 20 minutes

      return () => clearInterval(interval);
    }
  }, [location.pathname]);
  

  return (
  <div className="bg-gray-950">
    <Navbar />
    <ToastContainer />
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/movies" element={<Movies/>} />
      <Route path="/tv-shows" element={<TvShowPg/>} />
      <Route path="/new-and-popular" element={<NewAndPop/>} />
      <Route path="/my-list" element={<MyListPg/>} />
      <Route path="/movie/:id" element={<MovieDetails/>} />
      <Route path="/series/:id" element={<SeriesDetails/>} />
    </Routes>
    </div>
  )
}
export default App