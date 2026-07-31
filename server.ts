import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Health
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", aiEnabled: !!process.env.GEMINI_API_KEY });
});

// API: Student AI Financial Advisor
app.post("/api/ai-advice", async (req, res) => {
  try {
    const { income, totalExpense, remainingBudget, categoryExpenses, language } = req.body;

    if (!ai) {
      return res.status(200).json({
        advice: language === 'bn' 
          ? "এআই পরামর্শের জন্য GEMINI_API_KEY প্রয়োজন। তবে আপনার বর্তমান বাজেট অনুযায়ী, খাদ্য ও মেস খরচে নিয়ন্ত্রণ রাখলে প্রতি মাসে ৫০০-১০০০ টাকা সঞ্চয় সম্ভব।"
          : "AI advice requires GEMINI_API_KEY. Based on your current budget, keeping food and mess costs in check can save you 500-1000 per month.",
        isFallback: true
      });
    }

    const langInstruction = language === 'bn' 
      ? "উত্তরটি বাংলায় সহজ, সহমর্মী এবং একজন বন্ধুভাবাপন্ন স্টুডেন্ট ফাইন্যান্সিয়াল গাইডের মতো দিন।"
      : "Give the response in simple, friendly, empathetic English like a supportive student financial mentor.";

    const prompt = `
You are a smart financial advisor for students. Analyze this student's monthly finances and provide 3 actionable, highly helpful tips to save money and improve budget management.

Student Financial Summary:
- Monthly Income/Allowance: ${income}
- Total Expense so far: ${totalExpense}
- Remaining Budget: ${remainingBudget}
- Category Breakdown: ${JSON.stringify(categoryExpenses)}

${langInstruction}
Keep the response structured with 3 concise bullet points and an encouraging closing sentence. Max 180 words.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    res.json({ advice: response.text || "No advice generated." });
  } catch (error: any) {
    console.error("Error generating AI advice:", error);
    res.status(500).json({
      error: "Failed to generate AI advice",
      message: error.message
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
