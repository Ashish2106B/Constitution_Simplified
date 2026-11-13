const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const {
  getQuestionsByArticle,
  submitQuizAnswers,
} = require("../controllers/quizController");

router.get("/article/:articleId", getQuestionsByArticle);

router.post("/article/:articleId/submit", authMiddleware, submitQuizAnswers);

module.exports = router;
