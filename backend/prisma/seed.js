const prisma = require("../lib/prisma");

const topics = [
  {
    name: "Introduction to the Constitution",
    description:
      "Learn about the Constitution's origins, structure, purpose, and foundational principles.",
  },
  {
    name: "Fundamental Rights",
    description:
      "Understand the fundamental rights guaranteed under Part III of the Constitution of India.",
  },
  {
    name: "Directive Principles of State Policy",
    description:
      "Explore the principles in Part IV that guide the State toward social and economic welfare.",
  },
];

async function main() {
  try {
    for (const topic of topics) {
      await prisma.topic.upsert({
        where: { name: topic.name },
        update: { description: topic.description },
        create: topic,
      });
    }
    console.log("Topics seeded successfully");
  } catch (error) {
    console.error("Failed to seed topics:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
