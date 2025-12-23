import taskModel from "../models/taskModel.js";
import mongoose from "mongoose";

// ✅ Add Task
export const addTask = async (req, res) =>{
    try {

        const {startDate, dueDate, title, priority, description} = req.body
        const userId = new mongoose.Types.ObjectId(req.user.id);        

        const task = await taskModel.create({
            userId,
            title,
            description,
            startDate,
            dueDate,
            priority
        })

        res.status(201).json({ success: true, message: "Task added successfully", task });
        
    } catch (error) {
        console.error("❌ Add Task Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// ✅ Get All Tasks
export const getTasks = async (req, res) =>{
    try {

        const userId = new mongoose.Types.ObjectId(req.user.id)
        const taskList = await taskModel.find({ userId }).sort({ dueDate: 1 })
        res.json({success: true, taskList})
        
    } catch (error) {
        console.error("❌ Get Tasks Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// ✅ 🗑️ Delete Task
export const deleteTask = async (req, res)=>{
    try {

        const { id } = req.params

        const task = await taskModel.findByIdAndDelete(id)

        if(!task){
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        
        res.json({ success: true, message: "Task deleted successfully" });

    } catch (error) {
        console.error("❌ Delete Task Error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

// ✅ Mark task as completed
// controllers/taskController.js
export const completeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const updatedTask = await taskModel.findOneAndUpdate(
      { _id: id, userId },
      { status: "Completed" }, // ✅ update status field
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not authorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task marked as completed successfully!",
      task: updatedTask,
    });
  } catch (error) {
    console.error("❌ completeTask Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while completing task!",
    });
  }
};

