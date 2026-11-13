const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMyStreak,
  recordActivity,
} = require("../controllers/streakController");

const router = express.Router();

router.get("/", authMiddleware, getMyStreak);
router.post("/activity", authMiddleware, recordActivity);

module.exports = router;
