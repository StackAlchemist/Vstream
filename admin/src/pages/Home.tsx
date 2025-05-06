import React, { useEffect, useState } from "react";
import { MonitorPlay, Film, Settings, Upload } from "lucide-react";
import UploadSelectModal from "../components/UploadSelectModal";

const Home = () => {
  const [name, setName] = useState<string | null>(localStorage.getItem('name'));
  const [isOpen, setIsOpen] = useState<boolean>(false)
  
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
        {isOpen && <UploadSelectModal isOpen={isOpen} setIsOpen={setIsOpen}/>}
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">🎬 Welcome Back, {name}!</h1>
        <p className="text-gray-300 text-lg">
          Manage content, monitor stats, and keep your movie world running smoothly.
        </p>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => setIsOpen(!isOpen)} className="bg-gray-800 hover:bg-gray-700 transition rounded-2xl p-6 shadow-lg">
          <MonitorPlay className="h-12 w-12 text-indigo-400 mb-4" />
          <h2 className="text-xl font-semibold mb-1">Manage Movies</h2>
          <p className="text-gray-400 text-sm">Add, update or remove titles from your collection.</p>
        </div>

        <div className="bg-gray-800 hover:bg-gray-700 transition rounded-2xl p-6 shadow-lg">
          <Film className="h-12 w-12 text-pink-400 mb-4" />
          <h2 className="text-xl font-semibold mb-1">Track Viewership</h2>
          <p className="text-gray-400 text-sm">Monitor which movies are trending and performing well.</p>
        </div>

        <div className="bg-gray-800 hover:bg-gray-700 transition rounded-2xl p-6 shadow-lg">
          <Settings className="h-12 w-12 text-yellow-400 mb-4" />
          <h2 className="text-xl font-semibold mb-1">Admin Settings</h2>
          <p className="text-gray-400 text-sm">Configure preferences and update system settings.</p>
        </div>
      </section>

      <footer className="mt-20 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} StreamZone Admin • All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
