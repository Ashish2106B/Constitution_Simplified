const express = require("express");

const {
  getAllTopics,
  getTopicArticles,
} = require("../controllers/topicController");

const router = express.Router();

router.get("/", getAllTopics);
router.get("/:id/articles", getTopicArticles);

module.exports = router;
