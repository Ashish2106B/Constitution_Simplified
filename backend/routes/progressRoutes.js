const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMyProgress,
  markArticleCompleted,
} = require("../controllers/progressController");

const router = express.Router();

router.get("/", authMiddleware, getMyProgress);
router.patch(
  "/article/:articleId/complete",
  authMiddleware,
  markArticleCompleted
);

module.exports = router;
