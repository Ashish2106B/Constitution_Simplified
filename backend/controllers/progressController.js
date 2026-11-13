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

module.exports = {
  getMyProgress,
};
