import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const prompt = `
      You are Aivana, a kind and intelligent AI health assistant.
      Keep your replies clear, professional, and friendly.
      Do NOT write more than 7 sentences.
      Avoid emojis, lists, or long intros.
      Here’s the user message: ${message}
    `;

    const result = await model.generateContent(prompt);
    let reply = result.response.text().trim();

    // Optional: clean out markdown artifacts
    reply = reply.replace(/\*\*/g, "").replace(/\*/g, "");

    res.json({ reply });
  } catch (error) {
    console.error("Aivana error:", error);
    res.status(500).json({ error: "Aivana failed to respond" });
  }
});

export default router;
