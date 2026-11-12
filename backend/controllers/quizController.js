const prisma = require("../lib/prisma");

const getQuestionsByArticle = async (req, res) => {
  try {
    const articleId = Number(req.params.articleId);

    if (!Number.isInteger(articleId) || articleId <= 0) {
      return res.status(400).json({
        message: "Invalid article ID",
      });
    }

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      select: {
        id: true,
        title: true,
        questions: {
          select: {
            id: true,
            questionText: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            difficulty: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    return res.status(200).json({
      articleId: article.id,
      articleTitle: article.title,
      count: article.questions.length,
      questions: article.questions,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch quiz questions",
    });
  }
};

module.exports = {
  getQuestionsByArticle,
};
