const express = require("express");

const router = express.Router();

const {
  getQuestionsByArticle,
} = require("../controllers/quizController");

router.get("/article/:articleId", getQuestionsByArticle);

module.exports = router;
