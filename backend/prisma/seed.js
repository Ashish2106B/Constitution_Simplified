require("dotenv").config();
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

const articles = [
  {
    articleNumber: "Article 1",
    title: "Name and territory of the Union",
    topicName: "Introduction to the Constitution",
    originalText: `1. Name and territory of the Union.—(1) India, that is Bharat, shall be a Union of States.

(2) The States and the territories thereof shall be as specified in the First Schedule.

(3) The territory of India shall comprise—
(a) the territories of the States;
(b) the Union territories specified in the First Schedule; and
(c) such other territories as may be acquired.`,
    simplifiedText:
      "India, also called Bharat, is a Union of States. Its territory includes the States and Union territories listed in the First Schedule, as well as any other territories that may be acquired.",
    example:
      "A description of India's territory accounts for its States, Union territories, and any other territory included under this article.",
  },
  {
    articleNumber: "Article 12",
    title: "Definition of the State",
    topicName: "Introduction to the Constitution",
    originalText: `12. Definition.—In this Part, unless the context otherwise requires, “the State” includes the Government and Parliament of India and the Government and the Legislature of each of the States and all local or other authorities within the territory of India or under the control of the Government of India.`,
    simplifiedText:
      "For Part III, “the State” includes the Union and State governments and legislatures, and local or other authorities in India or under the control of the Government of India.",
    example:
      "When considering whether a public authority must respect a Fundamental Right, Article 12 helps define which bodies count as “the State.”",
  },
  {
    articleNumber: "Article 14",
    title: "Equality before law",
    topicName: "Fundamental Rights",
    originalText: `14. Equality before law.—The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.`,
    simplifiedText:
      "The State must provide every person equality before the law and equal protection of the laws in India.",
    example:
      "A person can expect the law to provide equal legal protection.",
  },
  {
    articleNumber: "Article 19",
    title: "Protection of certain rights regarding freedom",
    topicName: "Fundamental Rights",
    originalText: `19. Protection of certain rights regarding freedom of speech, etc.—

(1) All citizens shall have the right—
(a) to freedom of speech and expression;
(b) to assemble peaceably and without arms;
(c) to form associations or unions or co-operative societies;
(d) to move freely throughout the territory of India;
(e) to reside and settle in any part of the territory of India; and
(f) [Omitted]
(g) to practise any profession, or to carry on any occupation, trade or business.

(2) Nothing in sub-clause (a) of clause (1) shall affect the operation of any existing law, or prevent the State from making any law, in so far as such law imposes reasonable restrictions on the exercise of the right conferred by the said sub-clause in the interests of the sovereignty and integrity of India, the security of the State, friendly relations with foreign States, public order, decency or morality, or in relation to contempt of court, defamation or incitement to an offence.

(3) Nothing in sub-clause (b) of the said clause shall affect the operation of any existing law in so far as it imposes, or prevent the State from making any law imposing, in the interests of the sovereignty and integrity of India or public order, reasonable restrictions on the exercise of the right conferred by the said sub-clause.

(4) Nothing in sub-clause (c) of the said clause shall affect the operation of any existing law in so far as it imposes, or prevent the State from making any law imposing, in the interests of the sovereignty and integrity of India or public order or morality, reasonable restrictions on the exercise of the right conferred by the said sub-clause.

(5) Nothing in sub-clauses (d) and (e) of the said clause shall affect the operation of any existing law in so far as it imposes, or prevent the State from making any law imposing, reasonable restrictions on the exercise of any of the rights conferred by the said sub-clauses either in the interests of the general public or for the protection of the interests of any Scheduled Tribe.

(6) Nothing in sub-clause (g) of the said clause shall affect the operation of any existing law in so far as it imposes, or prevent the State from making any law imposing, in the interests of the general public, reasonable restrictions on the exercise of the right conferred by the said sub-clause, and, in particular, nothing in the said sub-clause shall affect the operation of any existing law in so far as it relates to, or prevent the State from making any law relating to,—
(i) the professional or technical qualifications necessary for practising any profession or carrying on any occupation, trade or business; or
(ii) the carrying on by the State, or by a corporation owned or controlled by the State, of any trade, business, industry or service, whether to the exclusion, complete or partial, of citizens or otherwise.`,
    simplifiedText:
      "Citizens have freedoms of speech and expression, peaceful assembly, association, movement, residence, and profession or business. The article also allows reasonable restrictions on these freedoms on specified grounds.",
    example:
      "A citizen may express an opinion, subject to the reasonable restrictions provided for in this article.",
  },
  {
    articleNumber: "Article 39",
    title: "Certain principles of policy",
    topicName: "Directive Principles of State Policy",
    originalText: `39. Certain principles of policy to be followed by the State.—The State shall, in particular, direct its policy towards securing—

(a) that the citizens, men and women equally, have the right to an adequate means of livelihood;

(b) that the ownership and control of the material resources of the community are so distributed as best to subserve the common good;

(c) that the operation of the economic system does not result in the concentration of wealth and means of production to the common detriment;

(d) that there is equal pay for equal work for both men and women;

(e) that the health and strength of workers, men and women, and the tender age of children are not abused and that citizens are not forced by economic necessity to enter avocations unsuited to their age or strength;

(f) that children are given opportunities and facilities to develop in a healthy manner and in conditions of freedom and dignity and that childhood and youth are protected against exploitation and against moral and material abandonment.`,
    simplifiedText:
      "The State should shape policy to support adequate livelihoods, use community resources for the common good, prevent harmful concentration of wealth, ensure equal pay, protect workers and children, and support children's healthy development. As a Directive Principle, it guides governance and is not directly enforceable by courts.",
    example:
      "A government may pursue worker-protection and child-welfare policies in line with these principles.",
  },
];

const questionData = [
  {
    topicName: "Introduction to the Constitution",
    articleNumber: "Article 1",
    questionText: "How does Article 1 describe India?",
    optionA: "As a Union of States",
    optionB: "As a group of independent countries",
    optionC: "As a single State without territories",
    optionD: "As a Union made up only of Union territories",
    correctAnswer: "A",
    explanation:
      "Article 1 describes India, also called Bharat, as a Union of States.",
    difficulty: "EASY",
  },
  {
    topicName: "Introduction to the Constitution",
    articleNumber: "Article 1",
    questionText: "Which set best matches the territory of India under Article 1?",
    optionA: "Only the States listed in the First Schedule",
    optionB: "Only the Union territories listed in the First Schedule",
    optionC: "States, listed Union territories, and other territories that may be acquired",
    optionD: "All territories of neighbouring countries",
    correctAnswer: "C",
    explanation:
      "Article 1 includes the States, the Union territories in the First Schedule, and other territories that may be acquired.",
    difficulty: "EASY",
  },
  {
    topicName: "Introduction to the Constitution",
    articleNumber: "Article 12",
    questionText:
      "For Part III, which bodies can be included in the meaning of “the State” under Article 12?",
    optionA: "Only the Government of India",
    optionB: "Union and State governments and legislatures, plus local or other authorities covered by the article",
    optionC: "Every private person and business automatically",
    optionD: "Only elected members of Parliament",
    correctAnswer: "B",
    explanation:
      "Article 12 includes Union and State governments and legislatures, as well as local or other authorities within its definition.",
    difficulty: "EASY",
  },
  {
    topicName: "Introduction to the Constitution",
    articleNumber: "Article 12",
    questionText: "Why is Article 12 useful when studying Fundamental Rights?",
    optionA: "It lists every citizen's duties",
    optionB: "It explains how States are created",
    optionC: "It sets the rules for choosing the President",
    optionD: "It helps identify which public bodies are treated as the State in Part III",
    correctAnswer: "D",
    explanation:
      "Article 12 defines “the State” for Part III, which helps show which bodies the Fundamental Rights provisions address.",
    difficulty: "EASY",
  },
  {
    topicName: "Fundamental Rights",
    articleNumber: "Article 14",
    questionText: "Who is protected by Article 14's guarantee of equality before law?",
    optionA: "Every person",
    optionB: "Only citizens who own property",
    optionC: "Only government employees",
    optionD: "Only people born in India",
    correctAnswer: "A",
    explanation:
      "Article 14 says “any person,” so its equality guarantee is not limited to citizens.",
    difficulty: "EASY",
  },
  {
    topicName: "Fundamental Rights",
    articleNumber: "Article 14",
    questionText: "Which pair best describes the protections in Article 14?",
    optionA: "Freedom of speech and peaceful assembly",
    optionB: "The right to vote and the right to work",
    optionC: "Equality before law and equal protection of the laws",
    optionD: "Freedom to travel and choose a profession",
    correctAnswer: "C",
    explanation:
      "Article 14 protects both equality before the law and equal protection of the laws within India.",
    difficulty: "EASY",
  },
  {
    topicName: "Fundamental Rights",
    articleNumber: "Article 19",
    questionText: "Which activity is expressly listed as a freedom in Article 19?",
    optionA: "Assembling peacefully and without arms",
    optionB: "Owning land in every State",
    optionC: "Receiving a government job",
    optionD: "Voting in every election worldwide",
    correctAnswer: "A",
    explanation:
      "Article 19 lists the freedom to assemble peaceably and without arms for citizens.",
    difficulty: "EASY",
  },
  {
    topicName: "Fundamental Rights",
    articleNumber: "Article 19",
    questionText: "Which statement best describes the freedoms in Article 19?",
    optionA: "They apply only to government officials and have no limits",
    optionB: "They apply to citizens and may be subject to reasonable restrictions specified in the article",
    optionC: "They apply only during elections",
    optionD: "They are the same as the Directive Principles in Part IV",
    correctAnswer: "B",
    explanation:
      "Article 19 grants specified freedoms to citizens and sets out grounds for reasonable restrictions.",
    difficulty: "EASY",
  },
  {
    topicName: "Directive Principles of State Policy",
    articleNumber: "Article 39",
    questionText: "Which goal is included among the policy principles in Article 39?",
    optionA: "Equal pay for equal work for men and women",
    optionB: "Abolishing all State governments",
    optionC: "Making every Directive Principle directly enforceable in court",
    optionD: "Limiting education to adults",
    correctAnswer: "A",
    explanation:
      "Article 39 directs State policy toward equal pay for equal work for both men and women.",
    difficulty: "EASY",
  },
  {
    topicName: "Directive Principles of State Policy",
    articleNumber: "Article 39",
    questionText: "How should Article 39 guide the State?",
    optionA: "As a rule that replaces all Fundamental Rights",
    optionB: "As a personal obligation for every citizen to enforce in court",
    optionC: "As a policy guide toward welfare goals, not directly enforceable by courts",
    optionD: "As a list of powers reserved only for local authorities",
    correctAnswer: "C",
    explanation:
      "Article 39 is part of the Directive Principles. Article 37 says these principles guide governance but are not enforceable by courts.",
    difficulty: "EASY",
  },
];

async function main() {
  try {
    const topicIds = new Map();
    for (const topic of topics) {
      const savedTopic = await prisma.topic.upsert({
        where: { name: topic.name },
        update: { description: topic.description },
        create: topic,
      });
      topicIds.set(topic.name, savedTopic.id);
    }

    const articleIds = new Map();
    for (const article of articles) {
      const { topicName, ...content } = article;
      const topicId = topicIds.get(topicName);
      const data = { ...content, topicId };
      const savedArticle = await prisma.article.upsert({
        where: {
          articleNumber_topicId: { articleNumber: article.articleNumber, topicId },
        },
        update: content,
        create: data,
      });
      articleIds.set(`${topicName}:${article.articleNumber}`, savedArticle.id);
    }

    const questions = questionData.map(
      ({ topicName, articleNumber, ...question }) => {
        const articleId = articleIds.get(`${topicName}:${articleNumber}`);
        if (!articleId) {
          throw new Error(`Article not found for ${articleNumber}`);
        }
        return { ...question, articleId };
      }
    );

    console.log(
      `Topics and articles seeded successfully; prepared ${questions.length} questions`
    );
  } catch (error) {
    console.error("Failed to seed topics and articles:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
