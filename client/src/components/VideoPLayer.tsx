import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, X, Loader2 } from "lucide-react";

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const VideoPlayer = ({
  onClose,
  movieId,
  seriesId,
  seasonIndex,
  episodeIndex,
  onEnded,
}: {
  onClose: () => void;
  movieId: string;
  seriesId: string;
  seasonIndex: number | null;
  episodeIndex: number | null;
  onEnded: () => void;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const [showNextPopup, setShowNextPopup] = useState(false);
  const [countdown, setCountdown] = useState(5);



  const handlePlayNextNow = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    onEnded();
    setShowNextPopup(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const setVideoDuration = () => setDuration(video.duration);
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);
    const handleEnded = () => {
      setShowNextPopup(true);
      setCountdown(5);
      countdownRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current!);
            onEnded();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", setVideoDuration);
    video.addEventListener("waiting", startLoading);
    video.addEventListener("playing", stopLoading);
    video.addEventListener("loadeddata", stopLoading);
    video.addEventListener("ended", handleEnded);

    video.load();
    video.play();

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", setVideoDuration);
      video.removeEventListener("waiting", startLoading);
      video.removeEventListener("playing", stopLoading);
      video.removeEventListener("loadeddata", stopLoading);
      video.removeEventListener("ended", handleEnded);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (video?.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl bg-black rounded-lg shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 text-white hover:text-red-400"
        >
          <X size={24} />
        </button>

        <div className="relative w-full aspect-video bg-gray-900">
          {movieId ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={`${import.meta.env.VITE_API_URL}/movies/video/${movieId}`}
              autoPlay
            />
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              src={`${import.meta.env.VITE_API_URL}/series/video/${seriesId}/${seasonIndex}/${episodeIndex}`}
              autoPlay
            />
          )}

          {/* Loading spinner overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
              <Loader2 className="animate-spin text-white w-10 h-10" />
            </div>
          )}

          {/* Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-2 text-white">
            {/* Progress Bar */}
            <input
              ref={progressRef}
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleProgressChange}
              className="w-full appearance-none bg-gray-300 h-1 rounded mb-2 cursor-pointer"
            />

            {/* Controls Row */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button onClick={toggleMute}>
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
                <span>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              <button onClick={handleFullscreen}>
                <Maximize size={20} />
              </button>
            </div>
          </div>

          {/* Play Next Episode Popup */}
          {showNextPopup && (
  <div className="absolute bottom-6 right-6 z-20">
    <div className="bg-[#141414] text-white rounded-md p-5 w-72 shadow-lg animate-fade-in-up">
      <h2 className="text-lg font-bold mb-2">Up Next</h2>
      <p className="text-sm mb-4 text-gray-300">
        Playing in {countdown} second{countdown !== 1 ? "s" : ""}...
      </p>
      <button
        onClick={handlePlayNextNow}
        className="w-full bg-white text-black text-sm font-semibold py-2 rounded hover:bg-gray-200 transition"
      >
        Play Now
      </button>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
