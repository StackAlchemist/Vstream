import { FilmIcon, ClapperboardIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UploadSelectModal = ({isOpen, setIsOpen}:  {isOpen: boolean, setIsOpen: (isOpen: boolean)=>void}) => {
    const navigate = useNavigate()
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-zinc-900 to-black border border-zinc-700 rounded-3xl p-8 w-full max-w-md shadow-2xl relative animate-fadeIn">
            
            {/* <button className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition">
              <X className="w-5 h-5" />
            </button> */}
    
            <h2 className="text-2xl font-bold text-center text-white mb-6">Select Upload Type</h2>
    
            <div className="flex flex-col gap-5">
              <button onClick={()=>navigate('/upload-movie')} className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 px-5 rounded-xl shadow transition duration-200">
                <FilmIcon className="w-5 h-5" />
                <span className="text-lg font-medium">Upload Single Movie</span>
              </button>
    
              <button onClick={()=>navigate('/upload-series')} className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white py-3 px-5 rounded-xl shadow transition duration-200">
                <ClapperboardIcon className="w-5 h-5" />
                <span className="text-lg font-medium">Upload Series</span>
              </button>
            </div>
    
            <p onClick={()=>setIsOpen(false)} className="mt-6 text-center text-sm text-zinc-500 hover:text-white cursor-pointer transition">
              Cancel
            </p>
          </div>
        </div>
      );
};

export default UploadSelectModal;
