import { useState, useEffect, useRef, useCallback } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_ID  = 'snake-game';
const ROWS     = 20;
const COLS     = 20;
const WIN_SCORE = 10; // score needed to win

// Snake speed in ms per tick (lower = faster)
const SPEED = { easy: 200, medium: 150, hard: 100 };

// Direction vectors: [rowDelta, colDelta]
const DIR_VECTORS = {
  up:    [-1,  0],
  down:  [ 1,  0],
  left:  [  0, -1],
  right: [  0,  1],
};

// Opposites — to block 180° reversal
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

// Asset paths
const HEAD_IMG = '/assets/snake-game/snake-head.svg';
const BODY_IMG = '/assets/snake-game/snake-body.svg';
const FOOD_IMG = '/assets/snake-game/food.svg';

// ─── Helper functions ─────────────────────────────────────────────────────────

/**
 * Initial snake: 3 segments starting near the centre, moving right.
 */
function initialSnake() {
  return [
    { row: 10, col: 11 }, // head
    { row: 10, col: 10 }, // body
    { row: 10, col: 9  }, // tail
  ];
}

/**
 * Places food on a random empty cell (not on the snake).
 */
function randomFood(snake) {
  let pos;
  do {
    pos = {
      row: Math.floor(Math.random() * ROWS),
      col: Math.floor(Math.random() * COLS),
    };
  } while (snake.some((s) => s.row === pos.row && s.col === pos.col));
  return pos;
}

// ─── Leaderboard helpers ──────────────────────────────────────────────────────

function recordResult(score, outcome) {
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  const newBest = prev.bestScore === null ? score : Math.max(prev.bestScore, score);
  saveStoredStats({
    ...current,
    [GAME_ID]: {
      ...prev,
      plays:   prev.plays + 1,
      wins:    prev.wins   + (outcome === 'win'  ? 1 : 0),
      losses:  prev.losses + (outcome === 'loss' ? 1 : 0),
      bestScore: newBest,
    },
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SnakeGame() {

  // ── State ──────────────────────────────────────────────────────────────────

  const [snake,         setSnake]         = useState(initialSnake);
  const [direction,     setDirection]     = useState('right');
  const [nextDirection, setNextDirection] = useState('right');
  const [food,          setFood]          = useState({ row: 5, col: 5 });
  const [score,         setScore]         = useState(0);
  const [isRunning,     setIsRunning]     = useState(false);
  const [gameOver,      setGameOver]      = useState(false);
  const [message,       setMessage]       = useState('Press Start to begin.');
  const [difficulty,    setDifficulty]    = useState('medium');

  // ── Refs (values needed inside setInterval without stale closure issues) ───

  const snakeRef        = useRef(snake);
  const directionRef    = useRef(direction);
  const nextDirRef      = useRef(nextDirection);
  const foodRef         = useRef(food);
  const scoreRef        = useRef(score);
  const gameOverRef     = useRef(false);
  const intervalRef     = useRef(null);

  // Keep refs in sync with state
  useEffect(() => { snakeRef.current     = snake;         }, [snake]);
  useEffect(() => { directionRef.current = direction;     }, [direction]);
  useEffect(() => { nextDirRef.current   = nextDirection; }, [nextDirection]);
  useEffect(() => { foodRef.current      = food;          }, [food]);
  useEffect(() => { scoreRef.current     = score;         }, [score]);

  // ── Keyboard handler ───────────────────────────────────────────────────────

  useEffect(() => {
    function handleKey(e) {
      // Map arrow keys and WASD to direction strings
      const keyMap = {
        ArrowUp:    'up',    w: 'up',
        ArrowDown:  'down',  s: 'down',
        ArrowLeft:  'left',  a: 'left',
        ArrowRight: 'right', d: 'right',
      };
      const newDir = keyMap[e.key];
      if (!newDir) return;

      // Block 180° reversal: don't allow pressing opposite of current direction
      if (newDir === OPPOSITE[directionRef.current]) return;

      setNextDirection(newDir);
      nextDirRef.current = newDir;
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // ── Game tick ─────────────────────────────────────────────────────────────

  /**
   * One tick of the snake movement. Uses refs to read latest values
   * without causing the interval closure to go stale.
   */
  const gameTick = useCallback(() => {
    if (gameOverRef.current) return;

    const currentSnake = snakeRef.current;
    const dir = nextDirRef.current;
    directionRef.current = dir;
    setDirection(dir);

    const [dr, dc] = DIR_VECTORS[dir];
    const head = currentSnake[0];
    const newHead = { row: head.row + dr, col: head.col + dc };

    // ── Wall collision ──────────────────────────────────────────────────────
    if (newHead.row < 0 || newHead.row >= ROWS || newHead.col < 0 || newHead.col >= COLS) {
      endGame('wall');
      return;
    }

    // ── Self collision ──────────────────────────────────────────────────────
    if (currentSnake.some((seg) => seg.row === newHead.row && seg.col === newHead.col)) {
      endGame('self');
      return;
    }

    const ateFood =
      newHead.row === foodRef.current.row &&
      newHead.col === foodRef.current.col;

    // Build new snake: prepend head, remove tail only if no food eaten
    const newSnake = ateFood
      ? [newHead, ...currentSnake]           // grow: keep tail
      : [newHead, ...currentSnake.slice(0, -1)]; // no grow: remove tail

    snakeRef.current = newSnake;
    setSnake(newSnake);

    if (ateFood) {
      const newScore = scoreRef.current + 1;
      scoreRef.current = newScore;
      setScore(newScore);

      // ── Win condition ─────────────────────────────────────────────────────
      if (newScore >= WIN_SCORE) {
        endGame('win');
        return;
      }

      // Place new food on a non-snake cell
      const newFood = randomFood(newSnake);
      foodRef.current = newFood;
      setFood(newFood);
    }
  }, []);

  function endGame(reason) {
    gameOverRef.current = true;
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setGameOver(true);

    if (reason === 'win') {
      setMessage(`You win! Score: ${scoreRef.current}`);
      recordResult(scoreRef.current, 'win');
      alert(`🎉 You win! Final score: ${scoreRef.current}`);
    } else {
      setMessage(`Game over! Final score: ${scoreRef.current}`);
      recordResult(scoreRef.current, 'loss');
      alert(`😢 You lose! Final score: ${scoreRef.current}`);
    }
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleStart() {
    if (isRunning) return;
    if (gameOver) { handleReset(); return; }

    setIsRunning(true);
    setMessage('Use arrow keys or WASD to move.');
    gameOverRef.current = false;

    const speed = SPEED[difficulty];
    intervalRef.current = setInterval(gameTick, speed);
  }

  function handleReset() {
    clearInterval(intervalRef.current);
    intervalRef.current = null;

    const fresh = initialSnake();
    const freshFood = randomFood(fresh);

    snakeRef.current     = fresh;
    foodRef.current      = freshFood;
    scoreRef.current     = 0;
    gameOverRef.current  = false;
    directionRef.current = 'right';
    nextDirRef.current   = 'right';

    setSnake(fresh);
    setFood(freshFood);
    setScore(0);
    setDirection('right');
    setNextDirection('right');
    setIsRunning(false);
    setGameOver(false);
    setMessage('Press Start to begin.');
  }

  function handleDifficultyChange(e) {
    setDifficulty(e.target.value);
    if (isRunning) handleReset();
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  // Build a Set of occupied positions for fast lookup during render
  const snakeSet  = new Set(snake.map((s) => `${s.row}-${s.col}`));
  const headKey   = `${snake[0].row}-${snake[0].col}`;
  const foodKey   = `${food.row}-${food.col}`;

  return (
    <div className="sg-page">

      {/* ── Title ── */}
      <h1 className="sg-title">Snake Game</h1>

      {/* ── Score + difficulty row ── */}
      <div className="sg-top-row">
        <span className="sg-score">Score: <strong>{score}</strong> / {WIN_SCORE}</span>

        <div className="sg-diff-row">
          <label htmlFor="sg-difficulty" className="sg-label">Speed:</label>
          <select
            id="sg-difficulty"
            className="sg-select"
            value={difficulty}
            onChange={handleDifficultyChange}
            disabled={isRunning}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* ── Status message ── */}
      <div
        className={[
          'sg-status',
          gameOver && score >= WIN_SCORE ? 'sg-status--win'  : '',
          gameOver && score < WIN_SCORE  ? 'sg-status--loss' : '',
        ].join(' ')}
        aria-live="polite"
      >
        {message}
      </div>

      {/* ── Game grid ── */}
      {/* 20×20 grid rendered as a CSS grid */}
      <div
        className="sg-grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 28px)`,
          gridTemplateRows:    `repeat(${ROWS}, 28px)`,
        }}
      >
        {Array.from({ length: ROWS }, (_, row) =>
          Array.from({ length: COLS }, (_, col) => {
            const key = `${row}-${col}`;
            const isHead = key === headKey;
            const isBody = !isHead && snakeSet.has(key);
            const isFood = key === foodKey;

            return (
              <div
                key={key}
                className={[
                  'sg-cell',
                  isHead ? 'sg-cell--head' : '',
                  isBody ? 'sg-cell--body' : '',
                  isFood ? 'sg-cell--food' : '',
                ].join(' ')}
              >
                {/* Show SVG assets for head, body, and food */}
                {isHead && <img src={HEAD_IMG} alt="head" className="sg-cell-img" />}
                {isBody && <img src={BODY_IMG} alt="body" className="sg-cell-img" />}
                {isFood && <img src={FOOD_IMG} alt="food" className="sg-cell-img" />}
              </div>
            );
          })
        )}
      </div>

      {/* ── Control buttons ── */}
      <div className="sg-controls">
        <button
          id="start-button"
          className="sg-btn sg-btn--start"
          onClick={handleStart}
          disabled={isRunning}
        >
          Start
        </button>
        <button
          id="reset-button"
          className="sg-btn sg-btn--reset"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

    </div>
  );
}
