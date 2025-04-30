import { Route, Routes } from "react-router-dom"
import Auth from "./pages/Auth"

const App = () => {
  return (
    <div className="bg-gray-950">
      <Routes>
        <Route path='/sign' element={<Auth />}/>
      </Routes>
    </div>
  )
}
export default App