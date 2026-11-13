const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllGames,
  submitGameScore,
  getMyGameHistory,
} = require("../controllers/gameController");

const router = express.Router();

router.get("/", authMiddleware, getAllGames);
router.post("/:gameId/score", authMiddleware, submitGameScore);
router.get("/history", authMiddleware, getMyGameHistory);

module.exports = router;
