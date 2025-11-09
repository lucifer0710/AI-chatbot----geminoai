// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // ✅ Serve index.html, style.css, script.js

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("Loaded Gemini API Key:", GEMINI_API_KEY ? "✅ Found" : "❌ Missing");

// 🔍 Dynamic model chooser
function chooseModel(prompt) {
  const p = prompt.toLowerCase();

  if (
    p.includes("draw") ||
    p.includes("image") ||
    p.includes("picture") ||
    p.includes("photo") ||
    p.includes("generate an image") ||
    p.includes("illustration")
  ) {
    return "gemini-2.0-flash-preview-image-generation";
  }

  if (
    p.includes("speak") ||
    p.includes("voice") ||
    p.includes("audio") ||
    p.includes("read this aloud")
  ) {
    return "gemini-2.5-flash-tts";
  }

  if (
    p.includes("explain") ||
    p.includes("code") ||
    p.includes("program") ||
    p.includes("algorithm") ||
    p.includes("math") ||
    p.includes("physics") ||
    p.includes("chemistry") ||
    p.includes("solve")
  ) {
    return "gemini-2.5-pro";
  }

  return "gemini-2.5-flash";
}

// ⚙️ Gemini API route
app.post("/api/gemini", async (req, res) => {
  const prompt = req.body.prompt;
  if (!prompt) return res.status(400).json({ reply: "Please enter a prompt." });

  const model = chooseModel(prompt);
  console.log(`🧩 Using model: ${model}`);

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const body =
    model.includes("image-generation")
      ? {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }
      : {
          contents: [{ parts: [{ text: prompt }] }],
        };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log("Gemini API Response:", data);

    let reply = "No response from Gemini API.";
    let imageBase64 = null;

    if (data?.candidates?.[0]?.content?.parts) {
      for (const part of data.candidates[0].content.parts) {
        if (part.text) reply = part.text;
        if (part.inlineData?.mimeType?.startsWith("image/")) {
          imageBase64 = part.inlineData.data;
        }
      }
    }

    res.json({ reply, model, image: imageBase64 });
  } catch (error) {
    console.error("❌ Error calling Gemini API:", error);
    res.status(500).json({ reply: "Server error. Please try again." });
  }
});

// ✅ Serve index.html on root route (fixes "Cannot GET /")
app.get((req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// ✅ Export for Vercel (instead of app.listen)
module.exports = app;

// ✅ Optional: allow local testing
if (require.main === module) {
  app.listen(3000, () =>
    console.log("✅ Local server running on http://localhost:3000")
  );
}
