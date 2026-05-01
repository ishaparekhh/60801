import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Import all 8 Shrek squares from the assets folder
import p1 from "../../assets/slido/1.png";
import p2 from "../../assets/slido/2.png";
import p3 from "../../assets/slido/3.png";
import p4 from "../../assets/slido/4.png";
import p5 from "../../assets/slido/5.png";
import p6 from "../../assets/slido/6.png";
import p7 from "../../assets/slido/7.png";
import p8 from "../../assets/slido/8.png";

const IMAGES = {
  1: p1,
  2: p2,
  3: p3,
  4: p4,
  5: p5,
  6: p6,
  7: p7,
  8: p8,
};
const SOLVED_STATE = [1, 2, 3, 4, 5, 6, 7, 8, null];

export default function Slido() {
  const [board, setBoard] = useState([]);
  const [movesMade, setMovesMade] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([rawCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "Slido.jsx";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const getValidMoves = (emptyIndex) => {
    const moves = [];
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;

    if (row > 0) moves.push(emptyIndex - 3);
    if (row < 2) moves.push(emptyIndex + 3);
    if (col > 0) moves.push(emptyIndex - 1);
    if (col < 2) moves.push(emptyIndex + 1);
    return moves;
  };

  const checkWin = (currentBoard) => {
    for (let i = 0; i < SOLVED_STATE.length; i++) {
      if (currentBoard[i] !== SOLVED_STATE[i]) return false;
    }
    return true;
  };

  const startNewGame = () => {
    const newBoard = [...SOLVED_STATE];
    let emptyIndex = 8;
    let lastMove = -1;

    // Setting the board by simulating 150 random valid moves
    for (let i = 0; i < 150; i++) {
      const validMoves = getValidMoves(emptyIndex).filter(
        (m) => m !== lastMove,
      );
      const nextMove =
        validMoves.length > 0
          ? validMoves[Math.floor(Math.random() * validMoves.length)]
          : getValidMoves(emptyIndex)[0];

      newBoard[emptyIndex] = newBoard[nextMove];
      newBoard[nextMove] = null;
      lastMove = emptyIndex;
      emptyIndex = nextMove;
    }

    if (checkWin(newBoard)) {
      const moves = getValidMoves(emptyIndex);
      const nextMove = moves[0];
      newBoard[emptyIndex] = newBoard[nextMove];
      newBoard[nextMove] = null;
    }

    setBoard(newBoard);
    setMovesMade(0);
    setIsSolved(false);
  };

  // Run on mount
  useEffect(() => {
    startNewGame();
  }, []);

  const handleSwap = (indexToSwap) => {
    // if (isSolved) return; // This locks the board if it is solved already

    const emptyIndex = board.indexOf(null);
    const validMoves = getValidMoves(emptyIndex);

    if (validMoves.includes(indexToSwap)) {
      const newBoard = [...board];
      newBoard[emptyIndex] = newBoard[indexToSwap];
      newBoard[indexToSwap] = null;

      setBoard(newBoard);
      setMovesMade((prev) => prev + 1);

      setIsSolved(false);
      if (checkWin(newBoard)) {
        setIsSolved(true);
        setTimeout(() => {
          alert("Correct!");
          const currentWins = parseInt(
            localStorage.getItem("gamesWon") || "0",
            10,
          );
          localStorage.setItem("gamesWon", (currentWins + 1).toString());
          startNewGame();
        }, 100);
      }
    }
  };

  const handleKeyDown = (e) => {
    // if (isSolved) return; // This locks the board if it is solved already
    const emptyIndex = board.indexOf(null);
    const row = Math.floor(emptyIndex / 3);
    const col = emptyIndex % 3;

    let targetIndex = -1;

    if (e.key === "ArrowDown" && row > 0) targetIndex = emptyIndex - 3;
    if (e.key === "ArrowUp" && row < 2) targetIndex = emptyIndex + 3;
    if (e.key === "ArrowRight" && col > 0) targetIndex = emptyIndex - 1;
    if (e.key === "ArrowLeft" && col < 2) targetIndex = emptyIndex + 1;

    if (targetIndex !== -1) {
      e.preventDefault();
      handleSwap(targetIndex);
    }
  };

  // Auto-solver
  const handleSolve = () => {
    setBoard([...SOLVED_STATE]);
    setIsSolved(true);
  };

  if (board.length === 0) return null;

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-8 focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="grid grid-cols-3 border border-[#333] select-none bg-[#333] w-[452px] gap-0">
        {board.map((cell, i) => (
          <div
            key={i}
            onClick={() => handleSwap(i)}
            className="w-[150px] h-[150px] border border-[#333] bg-background flex items-center justify-center m-0 cursor-pointer overflow-hidden"
          >
            {cell !== null && (
              <img
                src={IMAGES[cell]}
                alt={`Shrek square ${cell}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between w-[450px]">
        {/* Solved button */}
        <Button
          onClick={handleSolve}
          disabled={isSolved}
          variant="default"
          className="w-[150px]"
        >
          Solve:
        </Button>

        {/* Reset Button */}
        <Button
          onClick={startNewGame}
          disabled={!isSolved && movesMade === 0}
          variant="outline"
          className="w-[150px]"
        >
          Reset:
        </Button>
        <Button
          onClick={handleDownload}
          className="fixed bottom-[60px] right-6 z-50"
        >
          Code for file
        </Button>
      </div>
    </div>
  );
}
