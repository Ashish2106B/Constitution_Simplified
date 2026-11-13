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

const submitQuizAnswers = async (req, res) => {
  try {
    const articleId = Number(req.params.articleId);
    const { answers } = req.body || {};

    if (!Number.isInteger(articleId) || articleId <= 0) {
      return res.status(400).json({
        message: "Invalid article ID",
      });
    }

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        message: "Answers must be a non-empty array",
      });
    }

    const validOptions = ["A", "B", "C", "D"];
    const invalidAnswer = answers.some((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return true;
      }

      if (typeof item.answer !== "string" || item.answer.trim() === "") {
        return true;
      }

      return !validOptions.includes(item.answer.trim().toUpperCase());
    });

    if (invalidAnswer) {
      return res.status(400).json({
        message: "Each answer must include a valid option identifier (A, B, C, or D)",
      });
    }

    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      select: {
        id: true,
        questions: {
          select: {
            id: true,
            correctAnswer: true,
            explanation: true,
          },
        },
      },
    });

    if (!article) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    const questionIds = answers.map((item) => item.questionId);

    if (
      questionIds.some(
        (id) => !Number.isInteger(id) || id <= 0
      ) ||
      new Set(questionIds).size !== questionIds.length
    ) {
      return res.status(400).json({
        message: "Invalid or duplicate question IDs",
      });
    }

    const articleQuestionIds = new Set(
      article.questions.map((question) => question.id)
    );

    const invalidQuestion = answers.some(
      (item) => !articleQuestionIds.has(item.questionId)
    );

    if (invalidQuestion) {
      return res.status(400).json({
        message: "Some questions do not belong to this article",
      });
    }

    const questionMap = new Map(
      article.questions.map((question) => [
        question.id,
        question,
      ])
    );

    let correctCount = 0;

    const results = answers.map((item) => {
      const question = questionMap.get(item.questionId);

      const isCorrect =
        String(item.answer).trim().toUpperCase() ===
        question.correctAnswer.trim().toUpperCase();

      if (isCorrect) {
        correctCount++;
      }

      return {
        questionId: question.id,
        selectedAnswer: item.answer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const totalQuestions = answers.length;

    const percentage = Math.round(
      (correctCount / totalQuestions) * 100
    );

    if (percentage >= 60) {
      const userId = req.user.userId;
      const completedAt = new Date();

      await prisma.userProgress.upsert({
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
    }

    return res.status(200).json({
      articleId,
      totalQuestions,
      correctCount,
      incorrectCount: totalQuestions - correctCount,
      percentage,
      results,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to submit quiz answers",
    });
  }
};

module.exports = {
  getQuestionsByArticle,
  submitQuizAnswers,
};
