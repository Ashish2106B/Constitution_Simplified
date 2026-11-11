const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Article routes are working",
  });
});

module.exports = router;