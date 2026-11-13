require("dotenv").config();
const express = require("express");
const articleRoutes = require("./routes/articleRoutes");
const authRoutes = require("./routes/authRoutes");
const topicRoutes = require("./routes/topicRoutes");
const quizRoutes = require("./routes/quizRoutes");
const progressRoutes = require("./routes/progressRoutes");
const gameRoutes = require("./routes/gameRoutes");
const streakRoutes = require("./routes/streakRoutes");

const app = express();

app.use(express.json());

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

const PORT = process.env.PORT || 5050;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
