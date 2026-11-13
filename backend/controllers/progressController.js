const prisma = require("../lib/prisma");

const getMyProgress = async (req, res) => {
  try {
    const userId = req.user.userId;

    const progressRecords = await prisma.userProgress.findMany({
      where: {
        userId,
      },
      include: {
        article: {
          select: {
            id: true,
            articleNumber: true,
            title: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    const progress = progressRecords.map((record) => ({
      articleId: record.article.id,
      articleNumber: record.article.articleNumber,
      articleTitle: record.article.title,
      completed: record.completed,
      completedAt: record.completedAt,
    }));

    const completedArticles = progressRecords.filter(
      (record) => record.completed
    ).length;

    return res.status(200).json({
      totalArticles: progressRecords.length,
      completedArticles,
      remainingArticles: progressRecords.length - completedArticles,
      progress,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch progress",
    });
  }
};

const markArticleCompleted = async (req, res) => {
  try {
    const userId = req.user.userId;
    const articleId = Number(req.params.articleId);

    if (!Number.isInteger(articleId) || articleId <= 0) {
      return res.status(400).json({
        message: "Invalid article ID",
      });
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: { id: true },
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    const completedAt = new Date();
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_articleId: { userId, articleId },
      },
      update: {
        completed: true,
        completedAt,
      },
      create: {
        userId,
        articleId,
        completed: true,
        completedAt,
      },
    });

    return res.status(200).json({
      message: "Article marked as completed",
      progress,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to mark article as completed",
    });
  }
};

module.exports = {
  getMyProgress,
  markArticleCompleted,
};
