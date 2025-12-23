import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock, Flag, CheckCircle, Trash2 } from "lucide-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function TaskListUI() {
  const { backend_url, token } = useContext(AppContext);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  // 🔹 Fetch tasks from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(backend_url + "/api/taskPlanner/taskList", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          // ✅ Sort: Pending → Completed
          const sortedTasks = res.data.taskList.sort((a, b) => {
            if (a.status === "Pending" && b.status === "Completed") return -1;
            if (a.status === "Completed" && b.status === "Pending") return 1;
            return 0;
          });
          setTasks(sortedTasks);
        } else {
          toast.error(res.data.message || "Failed to fetch tasks");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Server error while fetching tasks!");
      }
    };

    fetchData();
  }, [backend_url, token]);

  // 🔹 Delete Task
  const deleteTask = async (id) => {
    try {
      const res = await axios.delete(`${backend_url}/api/taskPlanner/${id}/delete`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Task deleted successfully!");
        setTasks(tasks.filter((t) => t._id !== id));
      } else {
        toast.error("Failed to delete task!");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Server error while deleting!");
    }
  };

  // 🔹 Mark Task as Completed
  const updateTask = async (id) => {
    try {
      const res = await axios.put(
        `${backend_url}/api/taskPlanner/${id}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Task marked as completed!");
        const updatedList = tasks.map((t) =>
          t._id === id ? { ...t, status: "Completed" } : t
        );
        const sortedList = updatedList.sort((a, b) => {
          if (a.status === "Pending" && b.status === "Completed") return -1;
          if (a.status === "Completed" && b.status === "Pending") return 1;
          return 0;
        });
        setTasks(sortedList);
      } else {
        toast.error(res.data.message || "Failed to mark as completed!");
      }
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Server error while marking complete!");
    }
  };

  // 🔹 Priority Color Helper
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-400";
      case "Medium":
        return "text-yellow-400";
      default:
        return "text-green-400";
    }
  };

  return (
    <motion.div className="min-h-screen bg-zinc-950 text-white px-4 py-10 flex flex-col items-center">
      {/* ===== Header Section ===== */}
      {/* Header Section */}
      <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 text-center sm:text-left">
        {/* Title */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-lime-400 flex justify-center sm:justify-start items-center gap-2">
            <CalendarDays size={34} className="text-lime-400" />
            Task Dashboard
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Manage and track your daily work efficiently 📋
          </p>
        </div>

        {/* Calendar Button */}
        <button
          onClick={() => navigate("/calender")}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-lime-400 hover:text-black text-lime-400 px-4 py-2 rounded-full transition-all shadow-md text-sm sm:text-base w-fit"
        >
          <CalendarDays size={20} />
          <span className="font-semibold">Calendar</span>
        </button>
      </div>


      {/* ===== Task Cards Section ===== */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {tasks && tasks.length > 0 ? (
          tasks.map((task, i) =>
            task ? (
              <motion.div
                key={task._id || i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="relative p-5 border hover:bg-zinc-800 border-zinc-700 bg-zinc-900/80 backdrop-blur-sm rounded-xl flex flex-col justify-between shadow-md"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-2 flex-wrap">
                  <h3
                    className={`font-bold text-lg ${getPriorityColor(
                      task?.priority
                    )} ${
                      task?.status === "Completed"
                        ? "line-through text-zinc-500"
                        : "underline"
                    }`}
                  >
                    {task?.title || "Untitled Task"}
                  </h3>
                  <span className="text-xs text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded mt-1 sm:mt-0">
                    {task?.createdAt
                      ? new Date(task.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                {/* Description */}
                <p className="text-zinc-300 text-sm mb-3 leading-relaxed break-words">
                  {task?.description || "No description provided"}
                </p>

                {/* Dates */}
                <div className="flex flex-wrap gap-3 text-xs text-zinc-500 mb-3">
                  <p className="flex items-center gap-1">
                    <Clock size={14} /> Start:{" "}
                    {task?.startDate
                      ? new Date(task.startDate).toLocaleDateString()
                      : "—"}
                  </p>
                  <p className="flex items-center gap-1">
                    <Clock size={14} /> Due:{" "}
                    {task?.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"}
                  </p>
                </div>

                {/* Priority */}
                <div
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-lg border border-transparent ${getPriorityColor(
                    task?.priority
                  )} mb-3`}
                >
                  <Flag size={12} /> {task?.priority || "Low"} Priority
                </div>

                {/* Status + Buttons */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {task?.status === "Completed" ? (
                      <span className="text-lime-400 flex items-center gap-1">
                        <CheckCircle size={16} /> Completed
                      </span>
                    ) : (
                      <span className="text-violet-500 flex items-center gap-1">
                        <Clock size={16} /> Pending
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    {task?.status !== "Completed" && (
                      <button
                        onClick={() => updateTask(task._id)}
                        className="text-sm border border-lime-400 text-lime-400 px-3 py-1 rounded-lg hover:bg-lime-400 hover:text-black transition-all duration-300 w-full sm:w-auto"
                      >
                        Mark Done
                      </button>
                    )}

                    <button
                      onClick={() => deleteTask(task._id)}
                      className="text-red-400 hover:text-red-500 transition w-full sm:w-auto px-3 py-1 rounded-lg text-center"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : null
          )
        ) : (
          <div className="text-center text-zinc-400 col-span-full">
            No tasks found. Add a new one to get started 🚀
          </div>
        )}
      </div>

      {/* ===== Footer ===== */}
      <p className="text-zinc-500 text-sm mt-8 text-center">
        {tasks?.length > 0
          ? `You have ${tasks.length} total tasks 🚀`
          : "No tasks remaining 🎉"}
      </p>
    </motion.div>
  );
}
