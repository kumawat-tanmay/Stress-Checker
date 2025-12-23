import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { CalendarDays } from "lucide-react";

export default function AddTask() {
  const { backend_url, token } = useContext(AppContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!title || !description || !startDate || !dueDate) {
      toast.warn("Please fill all fields before adding a task!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        backend_url + "/api/taskPlanner/add",
        { title, description, startDate, dueDate, priority },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success("✅ Task added successfully!");
        setTitle("");
        setDescription("");
        setStartDate("");
        setDueDate("");
        setPriority("Low");
      } else {
        toast.error(res.data.message || "Failed to add task");
      }
    } catch (error) {
      toast.error("Server error, please try again!");
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    navigate("/task-list");
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-zinc-950 to-zinc-900 flex justify-center items-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form
        onSubmit={submitHandler}
        className="bg-zinc-900/90 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-zinc-800 w-full max-w-md space-y-6"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-lime-400">
            📝 Add Task
          </h2>

          <motion.div
            onClick={nextPage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <CalendarDays
              size={28}
              className="text-lime-400 hover:text-lime-300 transition"
            />
            <span className="text-sm sm:text-base text-lime-400 font-medium hover:text-lime-300">
              View All Tasks
            </span>
          </motion.div>
        </div>

        <p className="text-zinc-400 text-sm border-b border-zinc-700 pb-3">
          Add your tasks with clear goals and deadlines ✨
        </p>

        {/* Title */}
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Task Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Enter your task title"
            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-lime-400 text-zinc-200 placeholder-zinc-500 transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write task details..."
            rows="3"
            className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-lime-400 text-zinc-200 placeholder-zinc-500 resize-none transition"
          ></textarea>
        </div>

        {/* Dates */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col w-full sm:w-1/2">
            <label className="text-sm text-zinc-400 mb-1">Start Date</label>
            <input
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-lime-400 text-zinc-200 transition"
            />
          </div>

          <div className="flex flex-col w-full sm:w-1/2">
            <label className="text-sm text-zinc-400 mb-1">Due Date</label>
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-lime-400 text-zinc-200 transition"
            />
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="text-sm text-zinc-400 mb-1 block">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={`w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 text-zinc-200 transition ${
              priority === "High"
                ? "focus:ring-red-400 text-red-400"
                : priority === "Medium"
                ? "focus:ring-yellow-400 text-yellow-400"
                : "focus:ring-lime-400 text-lime-400"
            }`}
          >
            <option className="text-lime-400">Low</option>
            <option className="text-yellow-400">Medium</option>
            <option className="text-red-400">High</option>
          </select>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          disabled={loading}
          className={`w-full py-3 font-bold rounded-xl transition-all text-black ${
            loading
              ? "bg-zinc-600 cursor-not-allowed"
              : "bg-lime-400 hover:bg-lime-500 active:scale-95"
          }`}
        >
          {loading ? "Adding Task..." : "➕ Add Task"}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}
