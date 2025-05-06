import { Route, Routes } from "react-router-dom"
import Auth from "./pages/Auth"
import Home from "./pages/Home"
import { ToastContainer } from "react-toastify"
import UploadMovies from "./pages/UploadMovies"
import UploadSeries from "./pages/UploadSeries"
import View from "./pages/View"
import MovieDetails from "./pages/movieDetails"

const App = () => {
  return (
    <div className="bg-gray-950">
      <ToastContainer />
      <Routes>
        <Route path='/sign' element={<Auth />}/>
        <Route path='/' element={<Home />}/>
        <Route path='/upload-movie' element={<UploadMovies />}/>
        <Route path='/upload-series' element={<UploadSeries />}/>
        <Route path='/upload' element={<UploadSeries />}/>
        <Route path='/view' element={<View />}/>
        <Route path="/view/:id" element={<MovieDetails />} />
      </Routes>
    </div>
  )
}
export default App