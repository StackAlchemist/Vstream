import { Route, Routes } from "react-router-dom"
import Home from './pages/Home'
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Movies from "./pages/Movies"
import TvShowPg from "./pages/TvShowPg"
import NewAndPop from "./pages/NewAndPop"
import MyListPg from './pages/MyListPg'
import { ToastContainer } from "react-toastify"

const App = () => {
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
    </Routes>
    </div>
  )
}
export default App