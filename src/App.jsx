import { Navigate, Route, Routes } from "react-router-dom";
import { gameCatalog } from "./data/gameCatalog.js";
import HomePage from "./pages/HomePage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import GamePlaceholder from "./pages/GamePlaceholder.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      {gameCatalog.map((game) => (
        <Route
          key={game.id}
          path={game.route}
          element={<GamePlaceholder game={game} />}
        />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
