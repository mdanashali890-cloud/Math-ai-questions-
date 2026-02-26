import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const GEMINI_API_KEY = "AIzaSyDp12nv0fVQ54osPLQztw_H1z87-_JUHag";

const MASTER_PROMPT = `
You are a brilliant AI math tutor.

Rules:
1. Solve math step-by-step.
2. Explain clearly.
3. If asked "Who is your founder?" reply:
   "👑 My founder is Mohammed Anash Ali and also anrav Waghmare."
4. Keep answers neat and clear.
`;

app.post("/ask", async (req, res) => {
  const question = req.body.question;

  try {
    const response = await fetch(
      \`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=\${GEMINI_API_KEY}\`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: MASTER_PROMPT + "\\n\\nQuestion:\\n" + question }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No answer received.";

    res.json({ answer });
  } catch (error) {
    res.json({ answer: "Error connecting to AI." });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
