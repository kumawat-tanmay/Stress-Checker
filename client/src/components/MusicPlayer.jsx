import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import YouTube from "react-youtube";
import { AppContext } from "../context/AppContext";
import { Play, Pause, SkipBack, SkipForward, Music, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MusicPlayer() {
  const { token, backend_url } = useContext(AppContext);
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastMood, setLastMood] = useState("");
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get(`${backend_url}/api/moodTracker/suggested-songs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setSongs(res.data.songs);
          setLastMood(res.data.lastMood || res.data.message?.split(": ")[1] || "Unknown");
        }
      } catch (err) {
        console.error("Error fetching suggested songs:", err);
      }
    };
    fetchSongs();
  }, [backend_url, token]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    if (isPlaying) event.target.playVideo();
  };

  const opts = {
    width: "100%",
    height: "100%",
    playerVars: { autoplay: 1 },
  };

  const controlVariants = {
    tap: { scale: 0.9 },
    hover: { scale: 1.05, boxShadow: "0 0 10px rgba(163, 230, 53, 0.6)" },
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100 flex flex-col items-center px-3 sm:px-6 py-8">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 text-center flex items-center gap-2 sm:gap-3">
        <Music size={28} className="text-lime-400" /> Mood Mix Player
      </h1>

      {/* Mood Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-6 text-base sm:text-lg font-medium bg-zinc-800 px-4 py-2 rounded-full shadow-md border border-lime-400/50"
      >
        <span className="text-gray-400">Current Vibe:</span>{" "}
        <span className="capitalize text-lime-400 font-bold">{lastMood}</span>
      </motion.div>

      {/* Player Section */}
      {songs.length > 0 ? (
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center w-full max-w-sm sm:max-w-md md:max-w-lg p-4 sm:p-6 bg-zinc-800 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.7)] border border-zinc-700/50"
        >
          {/* YouTube Player */}
          <AnimatePresence mode="wait">
            <motion.div
              key={songs[currentIndex]?.id}
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full relative pt-[56.25%] rounded-xl overflow-hidden shadow-lg border border-lime-500/20"
            >
              <div className="absolute top-0 left-0 w-full h-full">
                <YouTube
                  videoId={songs[currentIndex].id}
                  opts={opts}
                  onReady={onReady}
                  onEnd={handleNext}
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Song Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={songs[currentIndex]?.id + "title"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="mt-3 text-center w-full"
            >
              <p className="text-sm text-gray-400">Now Playing</p>
              <h3 className="font-extrabold text-lg sm:text-xl text-white mt-1">
                {songs[currentIndex]?.title}
              </h3>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-4 flex gap-6 sm:gap-8 items-center justify-center">
            <motion.button
              onClick={handlePrev}
              variants={controlVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-zinc-700 hover:bg-zinc-600 p-3 sm:p-4 rounded-full transition"
            >
              <SkipBack size={22} color="white" />
            </motion.button>

            <motion.button
              onClick={togglePlayPause}
              whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(163, 230, 53, 0.8)" }}
              whileTap="tap"
              className="bg-lime-500 hover:bg-lime-400 p-4 sm:p-5 rounded-full shadow-lg transition"
            >
              {isPlaying ? <Pause size={26} color="black" /> : <Play size={26} color="black" />}
            </motion.button>

            <motion.button
              onClick={handleNext}
              variants={controlVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-zinc-700 hover:bg-zinc-600 p-3 sm:p-4 rounded-full transition"
            >
              <SkipForward size={22} color="white" />
            </motion.button>
          </div>

          {/* Queue Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 w-full text-center text-xs sm:text-sm text-gray-500 border-t border-zinc-700 pt-3"
          >
            <p>
              Queue: {currentIndex + 1} of {songs.length} songs
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          className="mt-12 p-6 bg-zinc-800 rounded-2xl text-center text-gray-400 border border-zinc-700 shadow-2xl max-w-sm sm:max-w-md"
        >
          <Info size={30} className="mx-auto mb-2 text-lime-400" />
          <p className="text-base sm:text-lg font-semibold text-white">
            No suggested songs available.
          </p>
          <p className="text-sm mt-2 text-gray-400">
            Please capture your current mood to get a personalized playlist.
          </p>
        </motion.div>
      )}
    </div>
  );
}
