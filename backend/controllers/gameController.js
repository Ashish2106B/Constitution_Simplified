const prisma = require("../lib/prisma");

const getAllGames = async (req, res) => {
  try {
    const games = await prisma.game.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        gameType: true,
      },
      orderBy: { id: "asc" },
    });

    return res.status(200).json({ count: games.length, games });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch games" });
  }
};

const submitGameScore = async (req, res) => {
  try {
    const gameId = Number(req.params.gameId);
    const { score, totalScore } = req.body || {};

    if (!Number.isInteger(gameId) || gameId <= 0) {
      return res.status(400).json({ message: "Invalid game ID" });
    }

    if (
      !Number.isInteger(score) ||
      !Number.isInteger(totalScore) ||
      totalScore <= 0 ||
      score < 0 ||
      score > totalScore
    ) {
      return res.status(400).json({
        message: "Score and totalScore must be valid integers, with 0 <= score <= totalScore",
      });
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { id: true },
    });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    const gameScore = await prisma.gameScore.create({
      data: {
        score,
        totalScore,
        userId: req.user.userId,
        gameId,
      },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            gameType: true,
          },
        },
      },
    });

    return res.status(201).json({ gameScore });
  } catch (error) {
    return res.status(500).json({ message: "Failed to submit game score" });
  }
};

const getMyGameHistory = async (req, res) => {
  try {
    const history = await prisma.gameScore.findMany({
      where: { userId: req.user.userId },
      select: {
        id: true,
        score: true,
        totalScore: true,
        playedAt: true,
        game: {
          select: {
            title: true,
            gameType: true,
          },
        },
      },
      orderBy: { playedAt: "desc" },
    });

    return res.status(200).json({ count: history.length, history });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch game history" });
  }
};

module.exports = {
  getAllGames,
  submitGameScore,
  getMyGameHistory,
};
