# Nagrik Aur Samvidhan

Nagrik Aur Samvidhan is a citizen-learning platform for exploring the Constitution of India. It pairs simplified constitutional content and quizzes with a React frontend and an authenticated Express API. The backend also provides learning progress, game scores, activity streaks, and AI-generated explanations grounded in the supplied article text.

> **Project status:** The frontend is currently the React + Vite starter scaffold. The backend APIs and AI explanation endpoint are implemented; frontend-to-backend integration is the next product step.

## Features

- Browse constitutional topics, articles, simplified explanations, and examples.
- Retrieve quiz questions without exposing answers before submission.
- Submit quiz answers and receive scores, correct answers, and explanations.
- Track article completion for authenticated users. A quiz score of 60% or higher marks an article complete.
- List games, submit scores, and view the authenticated user's game history.
- Track current and longest activity streaks using UTC calendar dates.
- Ask for English or Hindi explanations in simple, example-based, short, or detailed styles using Gemini.
- Register and log in with password hashing and JWT-based authentication.

## Technology stack

- **Frontend:** React 19, Vite 8
- **Backend:** Node.js, Express 5
- **Database and ORM:** PostgreSQL, Prisma 7
- **AI:** Google Gen AI SDK (`@google/genai`) with `gemini-2.5-flash`
- **Authentication:** JSON Web Tokens and bcrypt

## Repository structure

```text
.
├── frontend/                 # React + Vite application
│   ├── src/
│   └── package.json
└── backend/
    ├── controllers/          # Request handling
    ├── lib/                  # Shared Prisma client
    ├── middleware/           # JWT authentication
    ├── prisma/
    │   ├── migrations/       # Database migrations
    │   ├── schema.prisma     # Database models
    │   └── seed.js           # Topics, articles, and quiz questions
    ├── routes/               # Express API routes
    ├── services/             # Gemini AI service
    ├── server.js
    └── package.json
```

## Prerequisites

- Node.js 20.19+ or 22.12+ and npm
- PostgreSQL
- A Gemini API key to use the AI explanation endpoint

## Local setup

### 1. Configure the backend

Create a PostgreSQL database named `nagrik_samvidhan`, then create `backend/.env` with your own local values:

```ini
DATABASE_URL="postgresql://YOUR_POSTGRES_USER:YOUR_PASSWORD@localhost:5432/nagrik_samvidhan?schema=public"
JWT_SECRET="YOUR_LONG_RANDOM_SECRET"
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
PORT=5050
```

If your local PostgreSQL server does not require a password, remove `:YOUR_PASSWORD` from the connection URL. Keep `.env` private; it is excluded from Git.

Install dependencies, apply migrations, generate Prisma Client, and seed the learning content:

```bash
cd backend
npm install
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

The seed script is safe to rerun. It creates or updates 3 topics, 5 articles, and 10 quiz questions.

Start the backend:

```bash
npm run dev
```

The API listens on `http://localhost:5050` by default. `GET /` is a basic health response.

### 2. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

## API reference

Protected endpoints require a valid JWT in the request header:

```http
Authorization: Bearer <token>
```

| Method | Endpoint | Auth | Purpose |
|---|---|---:|---|
| `POST` | `/api/auth/register` | No | Register an account and receive a token |
| `POST` | `/api/auth/login` | No | Log in and receive a token |
| `GET` | `/api/topics` | No | List topics |
| `GET` | `/api/topics/:id/articles` | No | List articles for a topic |
| `GET` | `/api/articles/:id` | No | Get an article and its topic |
| `GET` | `/api/quiz/article/:articleId` | No | Get quiz questions without answers or explanations |
| `POST` | `/api/quiz/article/:articleId/submit` | Yes | Submit answers and calculate a score; scores of 60% or higher complete the article |
| `GET` | `/api/progress` | Yes | Get the current user's article progress |
| `PATCH` | `/api/progress/article/:articleId/complete` | Yes | Mark an article complete |
| `GET` | `/api/games` | Yes | List available games |
| `POST` | `/api/games/:gameId/score` | Yes | Record a game score for the current user |
| `GET` | `/api/games/history` | Yes | Get the current user's game history |
| `GET` | `/api/streak` | Yes | Get the current and longest activity streaks |
| `POST` | `/api/streak/activity` | Yes | Record today's activity and update the streak |
| `POST` | `/api/ai/explain` | Yes | Generate an article-grounded explanation with Gemini |

### AI explanation request

`POST /api/ai/explain` accepts:

```json
{
  "articleId": 3,
  "question": "Explain Article 14 with a simple real-life example.",
  "language": "English",
  "style": "example-based"
}
```

Supported languages are `English` and `Hindi`. Supported styles are `simple`, `example-based`, `short`, and `detailed`. Questions are limited to 1,000 characters. The Gemini API key stays on the backend and must never be sent to the frontend.

### Quiz submission request

`POST /api/quiz/article/:articleId/submit` accepts question IDs and option identifiers:

```json
{
  "answers": [
    { "questionId": 1, "answer": "A" },
    { "questionId": 2, "answer": "C" }
  ]
}
```

Valid answer identifiers are `A`, `B`, `C`, and `D` (case-insensitive). Correct answers and explanations are returned only after submission.

## Database content

The Prisma schema includes `Topic`, `Article`, `Question`, `User`, `UserProgress`, `Game`, `GameScore`, and `Streak` models. Initial seed content covers:

- Introduction to the Constitution: Articles 1 and 12
- Fundamental Rights: Articles 14 and 19
- Directive Principles of State Policy: Article 39

## Development notes

- Backend environment variables are loaded from `backend/.env` when commands are run from the `backend` directory.
- Prisma's seed command is configured in `backend/prisma7.config.ts`.
- User progress, game history, and streak APIs scope records to the authenticated user from the JWT.
- Do not commit database credentials, JWT secrets, Gemini API keys, or other secrets.
