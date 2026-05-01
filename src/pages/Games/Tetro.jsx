import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";

const ROWS = 12;
const COLS = 10;

const SHAPES = [
  [
    [1, 1],
    [1, 1],
  ], // 2x2
  [[1], [1]], // 2x1
  [[1]], // 1x1
];

export default function Tetro() {
  const [board, setBoard] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
  );
  const [activeBlock, setActiveBlock] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [greenRows, setGreenRows] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([rawCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "Tetro.jsx";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const stateRef = useRef({
    board,
    activeBlock,
    isActive,
    greenRows,
    gameOver,
  });
  useEffect(() => {
    stateRef.current = { board, activeBlock, isActive, greenRows, gameOver };
  }, [board, activeBlock, isActive, greenRows, gameOver]);

  const spawnBlock = useCallback(() => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return { shape, r: 0, c: 0 };
  }, []);

  // Reset game
  const resetGame = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setActiveBlock(null);
    setIsActive(false);
    setGreenRows(0);
    setGameOver(false);
  };

  // Click the board to start
  const handleStart = () => {
    if (!isActive && !gameOver) {
      setActiveBlock(spawnBlock());
      setIsActive(true);
    }
  };

  // Collision detection
  const isValidMove = (block, b = stateRef.current.board) => {
    for (let i = 0; i < block.shape.length; i++) {
      for (let j = 0; j < block.shape[0].length; j++) {
        if (block.shape[i][j]) {
          const nr = block.r + i;
          const nc = block.c + j;
          if (nc < 0 || nc >= COLS || nr >= ROWS) return false;
          if (nr >= 0 && b[nr][nc]) return false;
        }
      }
    }
    return true;
  };

  const lockBlock = () => {
    const { board, activeBlock, greenRows } = stateRef.current;
    if (!activeBlock) return;
    const newBoard = board.map((row) => [...row]);
    let highestRow = ROWS;
    // Stamp the active block into the permanent board array
    for (let i = 0; i < activeBlock.shape.length; i++) {
      for (let j = 0; j < activeBlock.shape[0].length; j++) {
        if (activeBlock.shape[i][j]) {
          const r = activeBlock.r + i;
          const c = activeBlock.c + j;
          if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            newBoard[r][c] = 1;
            if (r < highestRow) highestRow = r;
          }
        }
      }
    }
    // Loss Condition: If the stack goes higher than the first 8 rows (enters the top 4 rows)
    if (highestRow < 4) {
      setBoard(newBoard);
      setGameOver(true);
      setIsActive(false);
      setTimeout(() => {
        alert("Failed");
        resetGame();
      }, 50);
      return;
    }

    // Win Condition
    let newGreenRows = greenRows;
    for (let r = 0; r < ROWS; r++) {
      if (newBoard[r].every((cell) => cell > 0)) {
        if (newBoard[r][0] !== 2) {
          newGreenRows++;
          for (let c = 0; c < COLS; c++) {
            newBoard[r][c] = 2;
          }
        }
      }
    }

    setBoard(newBoard);

    // Check if there's a win!
    if (newGreenRows >= 5) {
      setGreenRows(newGreenRows);
      setGameOver(true);
      setIsActive(false);
      setTimeout(() => {
        alert("Congrats!");
        resetGame();
      }, 50);
      return;
    }

    setGreenRows(newGreenRows);
    setActiveBlock(spawnBlock());
  };

  // Gravity
  useEffect(() => {
    const interval = setInterval(() => {
      const { activeBlock, isActive, gameOver } = stateRef.current;
      if (!isActive || gameOver || !activeBlock) return;

      const nextBlock = { ...activeBlock, r: activeBlock.r + 1 };

      if (isValidMove(nextBlock)) {
        setActiveBlock(nextBlock);
      } else {
        lockBlock();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard Controls
  const handleKeyDown = (e) => {
    if (!isActive || gameOver || !activeBlock) return;

    let nextBlock = null;
    if (e.key === "ArrowLeft") {
      nextBlock = { ...activeBlock, c: activeBlock.c - 1 };
    } else if (e.key === "ArrowRight") {
      nextBlock = { ...activeBlock, c: activeBlock.c + 1 };
    } else if (e.key === "ArrowDown") {
      // Quality of life feature: pressing down moves it faster!
      nextBlock = { ...activeBlock, r: activeBlock.r + 1 };
    }
    if (nextBlock && isValidMove(nextBlock)) {
      e.preventDefault();
      setActiveBlock(nextBlock);
    }
  };

  // Correct colour rendering
  const getCellDisplay = (r, c) => {
    if (board[r][c] === 2) return "bg-[rgb(0,255,0)]";
    if (board[r][c] === 1) return "bg-primary";

    if (activeBlock) {
      const dr = r - activeBlock.r;
      const dc = c - activeBlock.c;
      if (
        dr >= 0 &&
        dr < activeBlock.shape.length &&
        dc >= 0 &&
        dc < activeBlock.shape[0].length
      ) {
        if (activeBlock.shape[dr][dc])
          return "bg-primary shadow-[0_0_15px_rgba(139,61,255,0.8)]"; // Cool glow effect!
      }
    }

    return "bg-transparent";
  };

  return (
    <div
      className="flex-1 flex  relative focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* 10 x 12 grid fills the main body */}
      <div
        className="flex-1 grid cursor-pointer"
        style={{
          margin: "20px 20px 100px 20px",
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
        onClick={handleStart}
      >
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((_, c) => (
            <div
              key={`${r}-${c}`}
              className={`border border-[#333333] ${getCellDisplay(r, c)} transition-colors duration-100`}
            />
          )),
        )}
      </div>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <Button onClick={resetGame} variant="outline" className="w-[200px]">
          Reset
        </Button>
      </div>
      <Button
        onClick={handleDownload}
        className="fixed bottom-[60px] right-6 z-50"
      >
        Code for file
      </Button>
    </div>
  );
}
