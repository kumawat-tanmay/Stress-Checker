import mongoose from "mongoose";

const moodEntrySchema = new mongoose.Schema({
  expression: { type: String, required: true },
  scores: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now },
});

const moodHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  history: [moodEntrySchema],
});

export default mongoose.model("MoodHistory", moodHistorySchema);
