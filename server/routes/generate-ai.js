// generate-ai.js
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Route to generate blog
router.post("/generate-blog", async (req, res) => {
  try {
    const { title, subTitle, category } = req.body;

    if (!title || !subTitle || !category) {
      return res.status(400).json({ error: "Title, subtitle, and category are required" });
    }

    const prompt = `
      Write a detailed, informative, and engaging blog with the following:
      - Title: ${title}
      - Subtitle: ${subTitle}
      - Category: ${category}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const response = await model.generateContent(prompt);

    let generatedBlog = "";

    if (response.response?.candidates?.length > 0) {
      const parts = response.response.candidates[0].content?.parts;
      if (parts && parts.length > 0) {
        generatedBlog = parts.map((p) => p.text || "").join("\n");
      }
    }

    if (!generatedBlog && response.response?.candidates?.[0]?.output) {
      generatedBlog = response.response.candidates[0].output;
    }

    if (!generatedBlog && response.response?.text) {
      generatedBlog = response.response.text;
    }

    if (!generatedBlog) {
      return res.status(500).json({ error: "No blog content generated" });
    }

    res.json({ content: generatedBlog });
  } catch (error) {
    console.error("❌ Error generating blog:", error);
    res.status(500).json({ error: "Something went wrong while generating blog" });
  }
});

export default router;
