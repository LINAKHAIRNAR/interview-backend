import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/api/askAI", async (req, res) => {
  try {
    const { answer, question } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are an interview evaluator. Score the answer out of 10.
Question: ${question}
User Answer: ${answer}

Return in this exact format:
SCORE: x/10
WEAKNESS: ...
IMPROVEMENT: ...
BETTER ANSWER: ...
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    res.json({ feedback: responseText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send("AI backend is running");
});

app.listen(3000, () => console.log("Server running"));
