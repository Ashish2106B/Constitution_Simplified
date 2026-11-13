const prisma = require("../lib/prisma");
const { explainArticle } = require("../services/aiService");

const MAX_QUESTION_LENGTH = 1000;

const explainArticleQuestion = async (req, res) => {
  const body = req.body || {};
  const articleId =
    typeof body.articleId === "number" || typeof body.articleId === "string"
      ? Number(body.articleId)
      : NaN;
  const { question, language, style } = body;

  if (!Number.isInteger(articleId) || articleId <= 0) {
    return res.status(400).json({ message: "Invalid article ID" });
  }

  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({
      message: "Question must be a non-empty string",
    });
  }

  const trimmedQuestion = question.trim();
  if (trimmedQuestion.length > MAX_QUESTION_LENGTH) {
    return res.status(400).json({
      message: `Question must be ${MAX_QUESTION_LENGTH} characters or fewer`,
    });
  }

  try {
    const article = await prisma.article.findUnique({
      where: { id: articleId },
      select: {
        id: true,
        articleNumber: true,
        originalText: true,
      },
    });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const explanation = await explainArticle(
      article.originalText,
      trimmedQuestion,
      language,
      style
    );

    return res.status(200).json({
      articleId: article.id,
      articleNumber: article.articleNumber,
      question: trimmedQuestion,
      explanation,
      language,
      style,
    });
  } catch (error) {
    if (
      error instanceof TypeError &&
      (error.message === "language must be English or Hindi" ||
        error.message ===
          "style must be simple, example-based, short, or detailed")
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: "Failed to generate an explanation. Please try again later.",
    });
  }
};

module.exports = { explainArticleQuestion };
