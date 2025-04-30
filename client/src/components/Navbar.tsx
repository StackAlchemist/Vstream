import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { asset } from "../assets/assets";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string | null>(localStorage.getItem('name'));

  useEffect(() => {
    const listener = () => {
      setName(localStorage.getItem('name'));
    };
    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('storage', listener);
    };
  }, []);

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

      {/* Profile */}
      <div className="flex items-center gap-2">
        <p>{name}</p>
      <div className="hidden md:block w-8 h-8 bg-gray-500 rounded-full"></div>
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
