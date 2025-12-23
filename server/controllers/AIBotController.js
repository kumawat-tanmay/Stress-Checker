import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPEN_API, // ✅ Correct ENV variable name
});

export const aiChat = async (req, res) => {
  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({
        success: false,
        message: "Message required",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
      max_tokens: 250,
    });

    const botReply = completion.choices[0].message.content;

    res.json({ success: true, botReply });

  } catch (error) {
    console.error("Full AI Error:", error);
    console.error("Error response data:", error.response?.data);
    res.status(500).json({ success: false, message: "AI server error" });
  }
};
