import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Menu, X, LogOut, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, setUser, setToken } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsOpen(false); // close mobile menu
  };

  // Animation variants for greeting
  const greetingVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 120 } },
  };

  // Mobile menu animation
  const menuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
    exit: { height: 0, opacity: 0, transition: { duration: 0.2 } },
  };

  return (
    <nav className="bg-zinc-950 text-white px-6 py-3 fixed w-full top-0 z-50 shadow-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Greeting with motion */}
        <motion.div
          variants={greetingVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-2 text-lime-400 font-bold text-xl"
        >
          <User size={22} />
          {user ? `Hello, ${user.name} 👋` : "Hello, Guest"}
        </motion.div>

        {/* Desktop Logout */}
        <div className="hidden md:flex items-center gap-6">
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-lime-400 active:scale-95 text-black font-semibold px-4 py-2 rounded-lg hover:bg-lime-500 transition transform hover:scale-105"
            >
              <LogOut size={18} />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-lime-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu with AnimatePresence */}
      <AnimatePresence>
  {isOpen && (
    <motion.div
      className="md:hidden mt-3 space-y-3 bg-zinc-900 p-4 rounded-lg shadow-lg border border-zinc-700 origin-top overflow-hidden"
      initial={{ scaleY: 0, opacity: 0 }}
      animate={{ scaleY: 1, opacity: 1 }}
      exit={{ scaleY: 0, opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      {user && (
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 justify-center bg-lime-400 text-black font-semibold px-4 py-2 rounded-lg hover:bg-lime-500 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      )}
    </motion.div>
  )}
</AnimatePresence>

    </nav>
  );
};

export default Navbar;
