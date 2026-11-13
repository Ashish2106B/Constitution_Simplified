const express = require("express");

const router = express.Router();

const {
  getQuestionsByArticle,
  submitQuizAnswers,
} = require("../controllers/quizController");

router.get("/article/:articleId", getQuestionsByArticle);

router.post("/article/:articleId/submit", submitQuizAnswers);

module.exports = router;
