import { useEffect, useState, useCallback, useRef } from "react";
import basket from "../../assets/matcho/basket.svg";
import star from "../../assets/matcho/star.svg";
import { Button } from "../../components/ui/button";
import rawCode from "./Catcher.jsx?raw";

const ROWS = 8;
const COLS = 8;

export default function Catcher() {
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([rawCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "Catcher.jsx";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const [board, setBoard] = useState(
    Array.from({ length: ROWS }, () => Array(COLS).fill(0)),
  );
  const [activeStar, setActiveStar] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [basketPos, setBasketPos] = useState({ r: 7, c: 3 });
  const [missed, setMissed] = useState(0);
  const [caught, setCaught] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const stateRef = useRef({
    board,
    activeStar,
    basketPos,
    isActive,
    missed,
    caught,
    gameOver,
  });
  useEffect(() => {
    stateRef.current = {
      board,
      activeStar,
      missed,
      caught,
      gameOver,
      basketPos,
      isActive,
    };
  }, [board, activeStar, basketPos, isActive, missed, caught, gameOver]);

  const spawnStar = useCallback(() => {
    const r = 0;
    const c = Math.floor(Math.random() * 8);
    return { r, c };
  }, []);

  const handleStart = () => {
    if (!gameOver) {
      setActiveStar(spawnStar());
      setIsActive(true);
    }
  };

  const isValidMove = (star) => {
    if (!star) return false;
    return star.c >= 0 && star.c <= 7 && star.r < 7;
  };

  const resetGame = () => {
    setBoard(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setActiveStar(null);
    setIsActive(false);
    setMissed(0);
    setCaught(0);
    setBasketPos({ r: 7, c: 3 });
    setGameOver(false);
  };

  const catchStar = () => {
    const { board, activeStar, caught } = stateRef.current;
    if (!activeStar || !isValidMove(activeStar)) {
      return;
    }

    const newBoard = board.map((row) => [...row]);
    newBoard[activeStar.r][activeStar.c] = 0;
    setBoard(newBoard);
    setActiveStar(null);

    // Win condition
    let newCaught = caught + 1;

    // Check if there is a win
    if (newCaught >= 8) {
      setCaught(newCaught);
      setGameOver(true);
      setIsActive(false);

      setTimeout(() => {
        alert("Congrats!");
        const currentWins = parseInt(
          localStorage.getItem("gamesWon") || "0",
          10,
        );
        localStorage.setItem("gamesWon", (currentWins + 1).toString());
        resetGame();
      }, 50);
      return;
    }
    setCaught(newCaught);
    setActiveStar(spawnStar());
  };

  const missedStar = () => {
    const { board, activeStar, missed } = stateRef.current;
    if (!activeStar || !isValidMove(activeStar)) {
      return;
    }

    const newBoard = board.map((row) => [...row]);
    newBoard[activeStar.r][activeStar.c] = 0;
    setBoard(newBoard);
    setActiveStar(null);

    let newMissed = missed + 1;
    if (newMissed >= 3) {
      setMissed(newMissed);
      setGameOver(true);
      setIsActive(false);
      setTimeout(() => {
        alert("Game Over!");
        resetGame();
      }, 50);
      return;
    }
    setMissed(newMissed);
    setActiveStar(spawnStar());
  };

  const handleKey = (e) => {
    if (!isActive || gameOver) return;

    const currentCol = basketPos.c;

    if (e.key === "ArrowLeft" && currentCol > 0) {
      e.preventDefault();
      setBasketPos({ ...basketPos, c: currentCol - 1 });
    } else if (e.key === "ArrowRight" && currentCol < 7) {
      e.preventDefault();
      setBasketPos({ ...basketPos, c: currentCol + 1 });
    }
  };

  // Gravity
  useEffect(() => {
    const interval = setInterval(() => {
      const { activeStar, isActive, gameOver, basketPos } = stateRef.current;
      if (!isActive || gameOver || !activeStar || !basketPos) return;

      const nextStar = { ...activeStar, r: activeStar.r + 1 };

      if (isValidMove(nextStar)) {
        setActiveStar(nextStar);
      } else {
        if (basketPos.c === activeStar.c) {
          catchStar();
        } else {
          missedStar();
        }
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const getStarDisplay = (r, c) => {
    if (activeStar?.r === r && activeStar?.c === c) return star;
  };

  const getBasketDisplay = (r, c) => {
    if (basketPos.r === r && basketPos.c === c) return basket;
  };

  return (
    <div
      className="flex-1 flex flex-col relative focus:outline-0 pt-[20px] px-[20px] pb-[90px] h-[calc(100vh-125px)] w-full"
      tabIndex={0}
      onKeyDown={handleKey}
    >
      {/* 8 x 8 grid that fills main body */}
      <div
        className="flex-1 grid cursor-pointer min-h-0"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
        onClick={handleStart}
      >
        {Array.from({ length: ROWS }).map((_, r) =>
          Array.from({ length: COLS }).map((_, c) => {
            const imgSrc = getStarDisplay(r, c) || getBasketDisplay(r, c);
            return (
              <div
                key={`${r}-${c}`}
                className="relative border border-[#333333] bg-transparent flex items-center justify-center min-h-0 min-w-0 overflow-hidden"
              >
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt=""
                    className="absolute w-[80%] h-[80%] object-contain"
                  />
                )}
              </div>
            );
          }),
        )}
      </div>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center">
        <div className="flex gap-8 items-center text-lg">
          <p>Missed: {missed} / 3</p>
          <p>Caught: {caught} / 8</p>
          <Button onClick={() => resetGame()}>Reset</Button>
        </div>
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
