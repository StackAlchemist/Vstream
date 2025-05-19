import { LogIn, LogOut, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { asset } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string | null>('');
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }
  }, []);
  
  useEffect(() => {
    if (location.state?.justLoggedIn) {
      const storedName = localStorage.getItem('name');
      if (storedName) {
        setName(storedName);
      }
    }
  }, [location.state]);
  

  const logout = async ()=>{
    try {
      await axios.post(import.meta.env.VITE_API_URL + '/auth/logout')
      localStorage.clear()
      setName('')
      toast.success('Logout Successful')
    } catch (error) {
      console.log(error)
      toast.error('Logout failed')
    }
  }

  return (
    <nav className="bg-black text-white px-6 py-4 flex items-center justify-between ">
      {/* Logo */}
      <div className="flex items-center pl-6">
        <h2 className="special text-white">Vstream</h2>
        <img className="w-10" src={asset.logo1} alt="" />
      </div>

      {/* Desktop Links */}
      <ul className="hidden md:flex gap-8 text-sm font-medium">
        <Link to="/" className="hover:text-red-500 cursor-pointer">
          Home
        </Link>
        <Link to="/tv-shows" className="hover:text-red-500 cursor-pointer">
          Series
        </Link>
        <Link to="/movies" className="hover:text-red-500 cursor-pointer">
          Movies
        </Link>
      </ul>

      {/* Profile */}{
        
      }
<div className="flex items-center gap-4">
  {name ? (
    <>
      {/* Username and Avatar */}
      <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white font-bold uppercase">
          {name.charAt(0)}
        </div>
        <p className="font-semibold text-sm text-white truncate max-w-[100px]">{name}</p>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="hover:bg-red-700 bg-red-600 text-white p-2 rounded-full transition"
        title="Logout"
      >
        <LogOut size={20} />
      </button>
    </>
  ) : (
    <button
      onClick={() => navigate('/login')}
      className="flex items-center gap-2 bg-white text-black font-semibold px-5 py-3 rounded-md shadow-md hover:bg-gray-200 transition"
    >
      <LogIn /> <span>Login</span>
    </button>
  )}
</div>


      {/* Mobile Menu Icon */}
      <div className="md:hidden">
        <button onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <ul className="absolute top-16 left-0 w-full bg-black text-white flex flex-col gap-4 px-6 py-4 z-50 md:hidden">
          <Link to="/" className="hover:text-red-500 cursor-pointer">
            Home
          </Link>
          <Link to="tv-shows" className="hover:text-red-500 cursor-pointer">
            TV Shows
          </Link>
          <Link to="/movies" className="hover:text-red-500 cursor-pointer">
            Movies
          </Link>
          <Link to="/new-and-popular" className="hover:text-red-500 cursor-pointer">
            New & Popular
          </Link>
          <Link to="/my-list" className="hover:text-red-500 cursor-pointer">
            My List
          </Link>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
