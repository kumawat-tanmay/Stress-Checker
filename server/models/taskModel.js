import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    startDate: {type: Date, required: true},
    dueDate: {type: Date, required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model("Task", taskSchema);