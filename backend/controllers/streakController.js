const prisma = require("../lib/prisma");

const getMyStreak = async (req, res) => {
  try {
    const streak = await prisma.streak.findUnique({
      where: { userId: req.user.userId },
      select: {
        currentStreak: true,
        longestStreak: true,
        lastActiveDate: true,
      },
    });

    return res.status(200).json(
      streak || {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch streak" });
  }
};

const recordActivity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const now = new Date();
    const todayUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );

    const existing = await prisma.streak.findUnique({ where: { userId } });

    if (!existing) {
      const streak = await prisma.streak.upsert({
        where: { userId },
        update: {
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: todayUtc,
        },
        create: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: todayUtc,
        },
      });

      return res.status(200).json({ message: "Activity recorded", streak });
    }

    const lastActiveUtc = existing.lastActiveDate
      ? new Date(
          Date.UTC(
            existing.lastActiveDate.getUTCFullYear(),
            existing.lastActiveDate.getUTCMonth(),
            existing.lastActiveDate.getUTCDate()
          )
        )
      : null;

    const daysSinceActivity = lastActiveUtc
      ? Math.floor((todayUtc.getTime() - lastActiveUtc.getTime()) / 86400000)
      : null;

    if (daysSinceActivity !== null && daysSinceActivity <= 0) {
      return res.status(200).json({
        message: "Activity already recorded today",
        streak: existing,
      });
    }

    const currentStreak =
      daysSinceActivity === 1 ? existing.currentStreak + 1 : 1;
    const longestStreak = Math.max(existing.longestStreak, currentStreak);

    const streak = await prisma.streak.upsert({
      where: { userId },
      update: { currentStreak, longestStreak, lastActiveDate: todayUtc },
      create: { userId, currentStreak, longestStreak, lastActiveDate: todayUtc },
    });

    return res.status(200).json({ message: "Activity recorded", streak });
  } catch (error) {
    return res.status(500).json({ message: "Failed to record activity" });
  }
};

module.exports = { getMyStreak, recordActivity };
