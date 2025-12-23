import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, HelpCircle, Smile, CalendarCheck, ClipboardList, Bot } from "lucide-react";

const Dashboard = () => {
  const { user } = useContext(AppContext);

  const modules = [
    {
      name: "Profile",
      path: "/profile",
      description: "Manage and update your personal info securely.",
      color: "text-cyan-400 hover:shadow-cyan-500/40",
      bgColor: "border-cyan-400/50 hover:bg-cyan-900/10",
      icon: User,
    },
    {
      name: "Stress Quiz",
      path: "/quiz",
      description: "Quick self-assessment to measure your stress level.",
      color: "text-emerald-400 hover:shadow-emerald-500/40",
      bgColor: "border-emerald-400/50 hover:bg-emerald-900/10",
      icon: HelpCircle,
    },
    {
      name: "Mood Tracker",
      path: "/mood",
      description: "Keep track of your moods and emotional wellbeing.",
      color: "text-pink-400 hover:shadow-pink-500/40",
      bgColor: "border-pink-400/50 hover:bg-pink-900/10",
      icon: Smile,
    },
    {
      name: "Time & Task Management",
      path: "/add-task",
      description: "Organize tasks, set priorities, and stay on schedule.",
      color: "text-amber-400 hover:shadow-amber-500/40",
      bgColor: "border-amber-400/50 hover:bg-amber-900/10",
      icon: CalendarCheck,
    },
    {
      name: "AI Chatbot",
      path: "/chatbot",
      description: "Instant stress relief tips with AI assistant.",
      color: "text-indigo-400 hover:shadow-indigo-500/40",
      bgColor: "border-indigo-400/50 hover:bg-indigo-900/10",
      icon: Bot,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-900 pt-16">
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        
        <p className="text-gray-400 mb-8">
          Explore your dashboard and manage tasks, stress, and mood efficiently.
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {modules.map((m, index) => {
            const IconComponent = m.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Link
                  to={m.path}
                  className={`bg-transparent border-2 rounded-xl p-6 h-full flex flex-col
                             ${m.bgColor} 
                             hover:scale-105 hover:shadow-lg transition-all duration-300 ease-in-out`}
                  style={{ boxShadow: `0 0 0 rgba(0,0,0,0)` }} // initial shadow transparent
                >
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className={`w-12 h-12 ${m.color.split(' ')[0]}`} strokeWidth={1.5} />
                  </div>
                  <h2 className={`text-2xl underline font-semibold mb-2 ${m.color.split(' ')[0]}`}>
                    {m.name}
                  </h2>
                  <p className="text-gray-300 text-sm flex-grow">{m.description}</p>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
