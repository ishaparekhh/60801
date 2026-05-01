import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Decode from "./pages/Games/Decode";
import Matcho from "./pages/Games/Matcho";
import Catcher from "./pages/Games/Catcher";
import TowerofHanoi from "./pages/Games/TowerofHanoi";
import GuesstheNumber from "./pages/Games/GuesstheNumber";
import Hangman from "./pages/Games/Hangman";
import MemoryCardGame from "./pages/Games/MemoryCardGame";
import ConnectFour from "./pages/Games/ConnectFour";
import MinesweeperMini from "./pages/Games/MinesweeperMini";
import ReactionTimer from "./pages/Games/ReactionTimer";
import RockPaperScissors from "./pages/Games/RockPaperScissors";
import SealTheBox from "./pages/Games/SealTheBox";
import SimonSays from "./pages/Games/SimonSays";
import SnakeGame from "./pages/Games/SnakeGame";
import TicTacToe from "./pages/Games/TicTacToe";
import WhackAMole from "./pages/Games/WhackAMole";
import TypingSpeedTest from "./pages/Games/TypingSpeedTest";
import WordScramble from "./pages/Games/WordScramble";
import Blanko from "./pages/Games/Blanko";
import Slido from "./pages/Games/Slido";
import Tetro from "./pages/Games/Tetro";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/decode" element={<Decode />} />
          <Route path="/matcho" element={<Matcho />} />
          <Route path="/catcher" element={<Catcher />} />
          <Route path="/blanko" element={<Blanko />} />
          <Route path="/slido" element={<Slido />} />
          <Route path="/tetro" element={<Tetro />} />
          <Route path="/tower-of-hanoi" element={<TowerofHanoi />} />
          <Route path="/guess-the-number" element={<GuesstheNumber />} />
          <Route path="/hangman" element={<Hangman />} />
          <Route path="/memory-card-game" element={<MemoryCardGame />} />
          <Route path="/connect-four" element={<ConnectFour />} />
          <Route path="/minesweeper-mini" element={<MinesweeperMini />} />
          <Route path="/reaction-timer" element={<ReactionTimer />} />
          <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
          <Route path="/seal-the-box" element={<SealTheBox />} />
          <Route path="/simon-says" element={<SimonSays />} />
          <Route path="/snake-game" element={<SnakeGame />} />
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/whack-a-mole" element={<WhackAMole />} />
          <Route path="/typing-speed-test" element={<TypingSpeedTest />} />
          <Route path="/word-scramble" element={<WordScramble />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
