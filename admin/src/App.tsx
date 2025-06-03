import { Route, Routes } from "react-router-dom"
import Auth from "./pages/Auth"
import Home from "./pages/Home"
import { ToastContainer } from "react-toastify"
import UploadMovies from "./pages/UploadMovies"
import UploadSeries from "./pages/UploadSeries"
import View from "./pages/View"
import MovieDetails from "./pages/movieDetails"
import SeriesDetails from "./pages/SeriesDetails"
import EditSeries from "./pages/EditSeries"
import AddSeason from "./pages/AddSeason"

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
        <Route path="/view-series/:id" element={<SeriesDetails />} />
        <Route path="/edit/:id" element={<EditSeries />} />
        <Route path="/add-season/:id" element={<AddSeason />} />
      </Routes>
    </div>
  )
}
export default App