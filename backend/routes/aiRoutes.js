const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { explainArticleQuestion } = require("../controllers/aiController");

const router = express.Router();

router.post("/explain", authMiddleware, explainArticleQuestion);

module.exports = router;
