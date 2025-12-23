import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  reverse: { type: Boolean, default: false }, 
  order: { type: Number, default: 0 }
});

export default mongoose.model("Question", questionSchema);
