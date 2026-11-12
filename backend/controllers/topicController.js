const prisma = require("../lib/prisma");

const getAllTopics = async (req, res) => {
  try {
    const topics = await prisma.topic.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json({
      count: topics.length,
      topics,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch topics",
    });
  }
};

const getTopicArticles = async (req, res) => {
  try {
    const topicId = Number(req.params.id);

    if (!Number.isInteger(topicId) || topicId <= 0) {
      return res.status(400).json({
        message: "Invalid topic ID",
      });
    }

    const topic = await prisma.topic.findUnique({
      where: {
        id: topicId,
      },
      include: {
        articles: {
          orderBy: {
            id: "asc",
          },
        },
      },
    });

    if (!topic) {
      return res.status(404).json({
        message: "Topic not found",
      });
    }

    return res.status(200).json({
      topic: topic.name,
      count: topic.articles.length,
      articles: topic.articles,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch topic articles",
    });
  }
};

module.exports = {
  getAllTopics,
  getTopicArticles,
};
