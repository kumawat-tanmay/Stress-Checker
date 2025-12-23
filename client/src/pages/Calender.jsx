import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";


export default function TaskCalendarUI() {
 const {backend_url, token} = useContext(AppContext)
  const navigate = useNavigate();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const years = Array.from({ length: 11 }, (_, i) => 2025 + i);

  const [tasks, setTasks] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/taskPlanner/taskList`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setTasks(response.data.taskList);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const totalDays = getDaysInMonth(selectedMonth, selectedYear);

  const getPriorityColor = (priority) => {
    if (priority === "High") return "from-red-600 to-red-500 text-red-100 border-red-400";
    if (priority === "Medium") return "from-yellow-600 to-yellow-500 text-yellow-100 border-yellow-400";
    return "from-green-600 to-green-500 text-green-100 border-green-400";
  };

  // Filter tasks for selected date
  const tasksForSelectedDate = tasks.filter((t) => {
    const date = new Date(t.startDate);
    return (
      date.getDate() === selectedDate &&
      date.getMonth() === selectedMonth &&
      date.getFullYear() === selectedYear
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 text-white flex flex-col items-center px-4 py-8 relative"
    >
      {/* Header */}
      <motion.h2
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="text-3xl sm:text-4xl font-extrabold text-lime-400 mb-8 flex items-center gap-3 text-center"
      >
        <CalendarDays onClick={() => navigate("/task-list")} size={32} className="text-lime-400 drop-shadow-[0_0_12px_#a3e635]" />
        Task Calendar
      </motion.h2>

      {/* Month-Year Selection */}
      <div className="flex flex-wrap justify-center gap-3 mb-8 w-full max-w-xl">
        <select
          className="bg-zinc-900/70 border border-zinc-700 rounded-xl px-4 py-2 text-zinc-200 focus:ring-2 focus:ring-lime-400 transition w-[48%] sm:w-auto backdrop-blur-md"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {months.map((month, i) => (
            <option key={i} value={i}>{month}</option>
          ))}
        </select>

        <select
          className="bg-zinc-900/70 border border-zinc-700 rounded-xl px-4 py-2 text-zinc-200 focus:ring-2 focus:ring-lime-400 transition w-[48%] sm:w-auto backdrop-blur-md"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 sm:gap-4 w-full max-w-6xl">
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const dayTasks = tasks.filter((t) => {
            const date = new Date(t.startDate);
            return (
              date.getDate() === day &&
              date.getMonth() === selectedMonth &&
              date.getFullYear() === selectedYear
            );
          });

          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.06, boxShadow: "0px 0px 18px rgba(163, 230, 53, 0.5)" }}
              onClick={() => setSelectedDate(day)}
              className={`cursor-pointer rounded-2xl flex flex-col justify-between p-4 border transition-all duration-300 min-h-[95px] sm:min-h-[110px] shadow-md
                ${dayTasks.length > 0 ? "bg-zinc-900/80 border-lime-400" : "bg-zinc-900/60 border-zinc-700"}`}
            >
              <span className="text-sm text-zinc-400 font-medium">{day}</span>
              {dayTasks.length > 0 ? (
                <div className="mt-auto">
                  {dayTasks.slice(0, 2).map((task, i) => (
                    <div key={i} className="mt-1 text-xs text-left truncate">
                      <p className="text-lime-400 font-semibold truncate">{task.title}</p>
                      <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                  {dayTasks.length > 2 && <p className="text-[10px] text-gray-400 italic">+ {dayTasks.length - 2} more</p>}
                </div>
              ) : (
                <p className="text-zinc-600 text-[11px] italic mt-auto">No Task</p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Info Line */}
      <p className="text-zinc-500 text-sm mt-6 text-center">
        Showing <span className="text-lime-400">{months[selectedMonth]}</span> {selectedYear} — {totalDays} days
      </p>

      {/* Floating Add Task Button */}
      <motion.button
        whileHover={{ scale: 1.15, rotate: 10, boxShadow: "0px 0px 20px #a3e635" }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="fixed bottom-6 right-6 bg-lime-400 text-black p-4 rounded-full shadow-xl"
        onClick={() => navigate("/add-task")}
      >
        <Plus size={26} />
      </motion.button>

      {/* Task Modal */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-zinc-900 border border-lime-400 p-6 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-md"
            >
              <h3 className="text-2xl font-bold text-lime-400 mb-4 text-center">
                {months[selectedMonth]} {selectedDate}, {selectedYear}
              </h3>

              {tasksForSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {tasksForSelectedDate.map((task, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-3 rounded-xl bg-zinc-800 border border-zinc-700 hover:border-lime-400 transition-all"
                    >
                      <p className="text-lime-400 font-semibold text-sm">{task.title}</p>
                      <span className={`inline-block text-xs px-2 py-1 rounded mt-1 border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <p className="text-zinc-300 text-xs mt-1"><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                      <p className="text-zinc-300 text-xs mt-2">{task.description}</p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 italic text-center py-4">No tasks for this date.</p>
              )}

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="mt-6 w-full py-2 bg-lime-400 text-black font-semibold rounded-lg hover:bg-lime-300 transition-all"
                onClick={() => setSelectedDate(null)}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
