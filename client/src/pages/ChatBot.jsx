import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { Trash2, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUsername, setShowUsername] = useState(true);
  const scrollRef = useRef();

  const { backend_url, user } = useContext(AppContext);
  

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    if (showUsername) setShowUsername(false);

    try {
      const res = await axios.post(`${backend_url}/api/chatBot/chat`, {
        userMessage: input,
      });
      const botMsg = { sender: "bot", text: res.data.botReply || "No response" };
      setTimeout(() => {
        setMessages((prev) => [...prev, botMsg]);
        setLoading(false);
      }, 800); // simulate typing delay
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Server error, please try again!" },
      ]);
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const clearChat = () => {
    setMessages([]);
    setShowUsername(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-b from-[#0a0a0a] to-[#1c1c1f] text-white p-2 sm:p-4 overflow-hidden"
    >
      {/* Header */}
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-lg sm:text-2xl font-semibold mb-2 sm:mb-4 text-center z-10 relative"
      >
        AI Stress Relief Chatbot 💬
      </motion.h2>

      {/* Chat Window */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col w-full max-w-md sm:max-w-lg h-[70vh] sm:h-[70vh] bg-black rounded-2xl overflow-hidden"
      >
        {/* Background Username */}
        <AnimatePresence>
          {showUsername && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-2"
            >
              <motion.h1
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-3xl sm:text-5xl font-extrabold bg-clip-text text-transparent text-center"
                style={{
                  backgroundImage: "linear-gradient(90deg, #ff7e5f, #feb47b)",
                  textShadow: "0 0 20px rgba(255, 126, 95, 0.5)",
                  letterSpacing: "1px",
                }}
              >
                Hi, {user.name}
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex flex-col gap-2 sm:gap-3 overflow-y-auto flex-grow px-3 py-2 hide-scrollbar">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`p-2 sm:p-3 rounded-xl max-w-[80%] break-words text-sm sm:text-base ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white rounded-br-none"
                    : "bg-zinc-700 text-gray-100 rounded-bl-none"
                }`}
              >
                {msg.text}
              </motion.div>
            </motion.div>
          ))}

          {/* AI Typing */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="bg-gray-700 text-white rounded-xl px-3 py-2 flex items-center space-x-1 text-sm sm:text-base"
              >
                <span className="text-gray-400">AI is typing</span>
                <span className="animate-bounce">.</span>
                <span className="animate-bounce delay-100">.</span>
                <span className="animate-bounce delay-200">.</span>
              </motion.div>
            </motion.div>
          )}
          <div ref={scrollRef}></div>
        </div>
      </motion.div>

      {/* Input Section */}
      <motion.div
  initial={{ y: 20, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="flex w-full max-w-md sm:max-w-lg mt-3 gap-2"
>
  {/* Input field */}
  <motion.input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={handleKeyPress}
    placeholder="Type your message..."
    whileFocus={{ scale: 1.02 }}
    className="flex-grow p-3 rounded-xl bg-[#1c1c1e] outline-none text-white placeholder-gray-400 text-sm sm:text-base border-2 border-transparent focus:border-orange-500 transition-all duration-200"
  />

  {/* Send Button */}
  <motion.button
    onClick={sendMessage}
    disabled={loading}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center justify-center px-3 sm:px-5 font-medium rounded-xl transition-all duration-200 text-sm sm:text-base ${
      loading
        ? "bg-gray-600 cursor-not-allowed"
        : "bg-gradient-to-r from-orange-600 to-amber-500 hover:from-amber-500 hover:to-yellow-500"
    }`}
  >
    {/* Mobile: icon only, Desktop: text */}
    <span>
      <Send size={18} />
    </span>
  </motion.button>

  {/* Clear Button */}
  <motion.button
    onClick={clearChat}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center justify-center px-3 sm:px-4 bg-gradient-to-r from-red-600 to-pink-700 rounded-xl hover:from-red-500 hover:to-pink-600 transition-all duration-200"
    
  >
    <Trash2 size={18} className="text-white" />
  </motion.button>
</motion.div>

    </motion.div>
  );
};

export default Chatbot;
