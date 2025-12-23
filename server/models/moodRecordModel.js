import mongoose from "mongoose";

const moodRecordSchema = new mongoose.Schema ({
    userId: { type: String, required: true },
    expression: { type: String, required: true },
    scores: { type: Object }, 
    timestamp: { type: Date, default: Date.now }
})

export default mongoose.model('moodrecord', moodRecordSchema)