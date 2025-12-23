import MoodHistory from "../models/MoodHistory.js";

// ✅ Record Mood
export const recordMood = async (req, res) => {
  try {
    const { expression, scores, timestamp } = req.body;
    const userId = req.user.id; // JWT se milta hai

    if (!userId || !expression) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const newMood = {
      expression,
      scores,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    };

    
    const updated = await MoodHistory.findOneAndUpdate(
      { userId },
      {
        $push: { history: newMood },
        $setOnInsert: { userId }, 
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: "Mood recorded successfully",
      record: updated,
    });
  } catch (error) {
    console.error("❌ recordMood Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Mood History
export const historyMood = async (req, res) => {
  try {
    const userId = req.user.id;
    const userHistory = await MoodHistory.findOne({ userId });

    res.status(200).json({
      success: true,
      history: userHistory
        ? userHistory.history.sort((a, b) => b.timestamp - a.timestamp)
        : [],
    });
  } catch (error) {
    console.error("❌ historyMood Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Clear Mood History
export const clearHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    await MoodHistory.findOneAndUpdate(
      { userId },
      { history: [] },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: "History cleared" });
  } catch (error) {
    console.error("❌ clearHistory Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
