import { useState, useRef, useEffect } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_ID   = 'whack-a-mole';
const GRID_SIZE = 9;      // 3×3 grid
const GAME_TIME = 30;     // seconds
const MOLE_INTERVAL = 1000; // ms between mole moves
const WIN_SCORE = 15;     // score needed to record a win

const MOLE_IMG = '/assets/whack-a-mole/mole.svg';
const HOLE_IMG = '/assets/whack-a-mole/hole.svg';

// ─── Helper ───────────────────────────────────────────────────────────────────

/**
 * Returns a random cell index different from the current one
 * to avoid the mole staying in the same hole.
 */
function randomCell(current) {
  let next;
  do {
    next = Math.floor(Math.random() * GRID_SIZE);
  } while (next === current);
  return next;
}

// ─── Leaderboard helpers ──────────────────────────────────────────────────────

function recordResult(score) {
  const outcome = score >= WIN_SCORE ? 'win' : 'loss';
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

export default function WhackAMole() {

  // ── State ──────────────────────────────────────────────────────────────────

  // Which cell (0-8) the mole is currently in, null = no mole
  const [activeCell, setActiveCell] = useState(null);
  const [score,      setScore]      = useState(0);
  const [timeLeft,   setTimeLeft]   = useState(GAME_TIME);
  const [isRunning,  setIsRunning]  = useState(false);
  const [message,    setMessage]    = useState('Press Start to begin.');

  // ── Refs ───────────────────────────────────────────────────────────────────

  // Separate intervals for the timer countdown and mole movement
  const timerIntervalRef = useRef(null);
  const moleIntervalRef  = useRef(null);

  // Ref to latest score so the end-game callback has the current value
  const scoreRef = useRef(0);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      clearInterval(timerIntervalRef.current);
      clearInterval(moleIntervalRef.current);
    };
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────

  function stopGame(finalScore) {
    clearInterval(timerIntervalRef.current);
    clearInterval(moleIntervalRef.current);
    setIsRunning(false);
    setActiveCell(null); // mole disappears at game end
    setMessage(`Game over! Final score: ${finalScore}`);
    recordResult(finalScore);
    alert(finalScore >= WIN_SCORE ? `🎉 You win! Score: ${finalScore}` : `😢 You lose! Final score: ${finalScore}`);
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleStart() {
    if (isRunning) return;

    // Reset score before starting
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(GAME_TIME);
    setIsRunning(true);
    setMessage('Whack the mole!');

    // Place mole immediately in a random cell
    setActiveCell(Math.floor(Math.random() * GRID_SIZE));

    // ── Timer: count down every second ─────────────────────────────────────
    let remaining = GAME_TIME;
    timerIntervalRef.current = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);
      if (remaining <= 0) {
        stopGame(scoreRef.current);
      }
    }, 1000);

    // ── Mole movement: change position every MOLE_INTERVAL ms ──────────────
    moleIntervalRef.current = setInterval(() => {
      setActiveCell((prev) => randomCell(prev));
    }, MOLE_INTERVAL);
  }

  /**
   * Cell click: check if the mole is there.
   */
  function handleCellClick(index) {
    if (!isRunning) return;

    if (index === activeCell) {
      // ── Hit ──────────────────────────────────────────────────────────────
      const newScore = scoreRef.current + 1;
      scoreRef.current = newScore;
      setScore(newScore);
      setMessage('Hit! 🎉');
      // Immediately move the mole to a new cell
      setActiveCell((prev) => randomCell(prev));
    } else {
      // ── Miss ─────────────────────────────────────────────────────────────
      setMessage('Miss!');
    }
  }

  function handleReset() {
    clearInterval(timerIntervalRef.current);
    clearInterval(moleIntervalRef.current);
    scoreRef.current = 0;
    setActiveCell(null);
    setScore(0);
    setTimeLeft(GAME_TIME);
    setIsRunning(false);
    setMessage('Press Start to begin.');
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="wam-page">

      {/* ── Title ── */}
      <h1 className="wam-title">Whack-a-Mole</h1>

      {/* ── Stats row ── */}
      <div className="wam-stats">
        <span className="wam-stat">⏱ <strong>{timeLeft}s</strong></span>
        <span className="wam-stat">🔨 Score: <strong>{score}</strong></span>
      </div>

      {/* ── Status message ── */}
      <div className="wam-status" aria-live="polite">{message}</div>

      {/* ── 3×3 grid ── */}
      <div className="wam-grid">
        {Array.from({ length: GRID_SIZE }, (_, i) => {
          const hasMole = isRunning && i === activeCell;
          return (
            <div
              key={i}
              id={`cell-${i}`}
              className={['wam-cell', hasMole ? 'wam-cell--mole' : ''].join(' ')}
              onClick={() => handleCellClick(i)}
              role="button"
              aria-label={hasMole ? 'Mole!' : 'Empty hole'}
            >
              <img
                src={hasMole ? MOLE_IMG : HOLE_IMG}
                alt={hasMole ? 'mole' : 'hole'}
                className="wam-cell-img"
              />
            </div>
          );
        })}
      </div>

      {/* ── Buttons ── */}
      <div className="wam-controls">
        <button
          id="start-button"
          className="wam-btn wam-btn--start"
          onClick={handleStart}
          disabled={isRunning}
        >
          Start
        </button>
        <button
          id="reset-button"
          className="wam-btn wam-btn--reset"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

    </div>
  );
}
