const express = require("express");
const articleRoutes = require("./routes/articleRoutes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Nagrik Aur Samvidhan Backend is Running");
});

app.use("/api/articles", articleRoutes);

const PORT = process.env.PORT || 5050;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
