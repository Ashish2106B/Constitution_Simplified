const prisma = require("../lib/prisma");

const getArticleById = async (req, res) => {
  try {
    const articleId = Number(req.params.id);

    if (!Number.isInteger(articleId) || articleId <= 0) {
      return res.status(400).json({
        message: "Invalid article ID",
      });
    }

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      include: {
        topic: true,
      },
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    return res.status(200).json({
      article,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch article",
    });
  }
};

module.exports = {
  getArticleById,
};
