require("dotenv").config();
const express = require("express");
const cors = require("cors");
const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/authRoutes");
const topicRoutes = require("./routes/topicRoutes");
const quizRoutes = require("./routes/quizRoutes");
const progressRoutes = require("./routes/progressRoutes");
const gameRoutes = require("./routes/gameRoutes");
const streakRoutes = require("./routes/streakRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

const allowedOrigins = (
  process.env.FRONTEND_URL ||
  "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(express.json());
app.use(cors({ origin: allowedOrigins }));

app.get("/", (req, res) => {
  res.send("Nagrik Aur Samvidhan Backend is Running");
});

app.use("/api/articles", articleRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5050;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
