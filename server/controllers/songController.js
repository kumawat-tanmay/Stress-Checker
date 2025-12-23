import mongoose from "mongoose";
import MoodHistory from "../models/MoodHistory.js";

export const suggestedSongs = async (req, res) => {
  try {
    // 🔥 Fix: use 'new' with ObjectId
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const userHistory = await MoodHistory.findOne({ userId });

    if (!userHistory || !userHistory.history.length) {
      return res.json({
        success: false,
        message: "No mood history found",
        songs: [],
      });
    }

    const lastMood = userHistory.history[userHistory.history.length - 1];

    const moodBasedSongs = {
  happy: [
    { title: "Sunny Vibes", id: "ZbZSe6N_BXs" },
    { title: "Good Day Sunshine", id: "Y66j_BUCBMY" },
    { title: "Carefree Melody", id: "9bZkp7q19f0" },
    { title: "Smiling Skies", id: "KQ6zr6kCPj8" },
    { title: "Golden Hour", id: "PEM9x0gN2Es" },
    { title: "Joyride", id: "y6Sxv-sUYtM" },
    { title: "Radiant Morning", id: "3GwjfUFyY6M" },
  ],
  sad: [
    { title: "Faded Memories", id: "hLQl3WQQoQ0" },
    { title: "Blue Horizon", id: "RBumgq5yVrA" },
    { title: "Tears of Rain", id: "k4V3Mo61fJM" },
    { title: "Lost Moments", id: "WbV0Xh6LxFg" },
    { title: "Empty Roads", id: "uelHwf8o7_U" },
    { title: "Echoes of Time", id: "CevxZvSJLk8" },
    { title: "Silent Heart", id: "8UVNT4wvIGY" },
  ],
  neutral: [
    { title: "Calm Breeze", id: "hT_nvWreIhg" },
    { title: "Balanced Waves", id: "2Vv-BfVoq4g" },
    { title: "Easy Flow", id: "09R8_2nJtjg" },
    { title: "Simple Days", id: "RgKAFK5djSk" },
    { title: "Smooth Ride", id: "OPf0YbXqDm0" },
    { title: "Gentle Steps", id: "ktvTqknDobU" },
    { title: "Even Flow", id: "LHCob76kigA" },
  ],
  angry: [
    { title: "Power Within", id: "eVTXPUF4Oz4" },
    { title: "Rising Fury", id: "ktvTqknDobU" },
    { title: "Unbreakable", id: "7wtfhZwyrcc" },
    { title: "Fight Back", id: "1y6smkh6c-0" },
    { title: "Rage Mode", id: "QzxT8mKj8xA" },
    { title: "Beast Unleashed", id: "pXRviuL6vMY" },
    { title: "War Cry", id: "09R8_2nJtjg" },
  ],
  surprised: [
    { title: "Unexpected Joy", id: "JGwWNGJdvx8" },
    { title: "Wonder Rush", id: "tVj0ZTS4WF4" },
    { title: "Shockwave", id: "CevxZvSJLk8" },
    { title: "Mystery Beat", id: "2Vv-BfVoq4g" },
    { title: "Bright Twist", id: "uelHwf8o7_U" },
    { title: "New Light", id: "RqcjBLMaWCg" },
    { title: "Sudden Smile", id: "iKzRIweSBLA" },
  ],
    };

    const songs = moodBasedSongs[lastMood.expression] || [];

    res.json({
      success: true,
      message: `Songs for mood: ${lastMood.expression}`,
      songs,
    });
  } catch (error) {
    console.error("❌ suggestedSongs Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
