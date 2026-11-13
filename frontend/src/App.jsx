import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Topics from "./pages/Topics";
import Article from "./pages/Article";
import AIAssistant from "./pages/AIAssistant";
import Quiz from "./pages/Quiz";
import QuizResult from "./pages/QuizResult";
import Progress from "./pages/Progress";
import Games from "./pages/Games";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/articles/:articleId" element={<Article />} />
        <Route path="/articles/:articleId/ai" element={<AIAssistant />} />
        <Route path="/articles/:articleId/quiz" element={<Quiz />} />
        <Route path="/quiz/result" element={<QuizResult />} />

        <Route path="/progress" element={<Progress />} />
        <Route path="/games" element={<Games />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
