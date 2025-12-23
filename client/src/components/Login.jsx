import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const [state, setState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();
  const { backend_url, setUser, setToken } = useContext(AppContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint =
        state === "Login" ? "/api/auth/login" : "/api/auth/register";

      const { data } = await axios.post(
        backend_url + endpoint,
        state === "Login"
          ? { email, password }
          : { name, email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        toast.success(`${state} successful`);
        navigate("/");
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-zinc-950 to-black text-white flex justify-center items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-zinc-900/70 backdrop-blur-lg border border-zinc-800 p-8 rounded-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <LogIn className="w-6 h-6 text-lime-400" />
            <h1 className="text-3xl font-semibold text-white">{state}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {state === "Sign Up" && (
            <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-3 py-3 rounded-lg focus-within:border-lime-400 transition">
              <User className="text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-3 py-3 rounded-lg focus-within:border-lime-400 transition">
            <Mail className="text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 px-3 py-3 rounded-lg focus-within:border-lime-400 transition">
            <Lock className="text-gray-400 w-5 h-5" />
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-transparent text-white placeholder-gray-400 focus:outline-none"
            />
            {showPass ? (
              <EyeOff
                onClick={() => setShowPass(false)}
                className="w-5 h-5 text-gray-400 cursor-pointer"
              />
            ) : (
              <Eye
                onClick={() => setShowPass(true)}
                className="w-5 h-5 text-gray-400 cursor-pointer"
              />
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full bg-lime-400 hover:bg-lime-300 text-black font-semibold py-3 rounded-lg transition-all"
          >
            {state === "Login" ? "Login" : "Sign Up"}
          </motion.button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-8">
          {state === "Login" ? (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-lime-400 cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-lime-400 cursor-pointer hover:underline"
              >
                Login
              </span>
            </>
          )}
        </p>
      </motion.div>
    </motion.div>
  );
}
