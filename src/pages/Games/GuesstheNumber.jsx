import { useState, useEffect, useRef } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_ID = 'guess-the-number';

// Difficulty only controls the time limit — the number is always 1–100
const DIFFICULTY_CONFIG = {
  easy:   { timeLimit: 60 },
  medium: { timeLimit: 45 },
  hard:   { timeLimit: 30 },
};

// ─── Helper functions (outside component so they don't get re-created) ────────

/**
 * Returns a random whole number between 1 and 100 (inclusive).
 */
function randomNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

/**
 * Records a win in localStorage.
 * For this game, bestScore = fewest guesses and bestTimeSeconds = fastest win.
 * Uses Math.min so the best (lowest) value is always kept.
 */
function recordWin(guessCount, timeSeconds) {
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };

  // Keep the fewest guesses as the best score
  const newBestScore = prev.bestScore === null
    ? guessCount
    : Math.min(prev.bestScore, guessCount);

  // Keep the fastest time (lowest seconds)
  const newBestTime = prev.bestTimeSeconds === null
    ? timeSeconds
    : Math.min(prev.bestTimeSeconds, timeSeconds);

  const updated = {
    ...current,
    [GAME_ID]: {
      ...prev,
      plays: prev.plays + 1,
      wins: prev.wins + 1,
      bestScore: newBestScore,
      bestTimeSeconds: newBestTime,
    },
  };
  saveStoredStats(updated);
}

/**
 * Records a loss in localStorage.
 */
function recordLoss() {
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  const updated = {
    ...current,
    [GAME_ID]: { ...prev, plays: prev.plays + 1, losses: prev.losses + 1 },
  };
  saveStoredStats(updated);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GuesstheNumber() {

  // ── State ──────────────────────────────────────────────────────────────────

  // Which difficulty the player has chosen
  const [difficulty, setDifficulty] = useState('easy');

  // The secret random number the player is trying to guess (1–100)
  const [secretNumber, setSecretNumber] = useState(
    () => randomNumber() // lazy init: only runs once on mount
  );

  // Seconds remaining on the countdown timer
  const [timeLeft, setTimeLeft] = useState(60);

  // The value currently typed in the input box
  const [guess, setGuess] = useState('');

  // All guesses the player has made so far (stored as numbers)
  const [previousGuesses, setPreviousGuesses] = useState([]);

  // The hint / result message shown below the input
  const [message, setMessage] = useState('Enter your first guess.');

  // True once the game ends (win or timeout) — disables input and submit
  const [gameOver, setGameOver] = useState(false);

  // True while the timer is paused — stops the countdown without ending the game
  const [paused, setPaused] = useState(false);

  // Guard flag: ensures we only record one result per game (no double recording)
  const hasRecordedResult = useRef(false);

  // Track when the game started so we can calculate time taken on a win
  const startTimeRef = useRef(Date.now());

  // ── Timer (useEffect) ──────────────────────────────────────────────────────

  useEffect(() => {
    // Don't tick if the game is over or the player has paused
    if (gameOver || paused) return;

    // setInterval calls the function every 1000ms (1 second)
    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        // If we've reached 1 second, this tick brings it to 0 → time's up
        if (prev <= 1) {
          clearInterval(intervalId); // stop the interval immediately

          // Only record a loss if we haven't already recorded a result
          // (guards against recording a loss at the same moment a correct guess is processed)
          if (!hasRecordedResult.current) {
            hasRecordedResult.current = true;
            setGameOver(true);
            // We need secretNumber here — use a ref-based approach via the setter callback
            setSecretNumber((secret) => {
              recordLoss();
              alert(`Time is up! The number was ${secret}.`);
              return secret; // return unchanged — we just needed to read it
            });
          }
          return 0; // set timeLeft to 0, don't go negative
        }
        return prev - 1; // subtract 1 second
      });
    }, 1000);

    // Cleanup: React calls this when the component unmounts, or when gameOver/paused changes.
    // Without this, multiple intervals would stack up on each render.
    return () => clearInterval(intervalId);
  }, [gameOver, paused]); // re-run when either gameOver or paused changes

  // ── Derived values ─────────────────────────────────────────────────────────

  // Pull the time limit for the current difficulty
  const { timeLimit } = DIFFICULTY_CONFIG[difficulty];

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Called when the difficulty select changes.
   * Generates a new number for the chosen difficulty and resets everything.
   */
  function handleDifficultyChange(e) {
    const newDiff = e.target.value;
    const config = DIFFICULTY_CONFIG[newDiff];
    setDifficulty(newDiff);
    setSecretNumber(randomNumber());
    setTimeLeft(config.timeLimit);
    setGuess('');
    setPreviousGuesses([]);
    setMessage('Enter your first guess.');
    setGameOver(false);
    setPaused(false); // always unpause when switching difficulty
    hasRecordedResult.current = false;
    startTimeRef.current = Date.now();
  }

  /**
   * Called when Reset is clicked.
   * Generates a fresh number with the SAME difficulty and resets all state.
   */
  function handleReset() {
    setSecretNumber(randomNumber());
    setTimeLeft(timeLimit);
    setGuess('');
    setPreviousGuesses([]);
    setMessage('Enter your first guess.');
    setGameOver(false);
    setPaused(false); // always unpause on reset
    hasRecordedResult.current = false;
    startTimeRef.current = Date.now();
  }

  /**
   * Toggles the timer between paused and running.
   * Has no effect once the game is over.
   */
  function handlePauseToggle() {
    if (gameOver) return;
    setPaused((prev) => !prev);
  }

  /**
   * Called when Guess is clicked (or Enter is pressed).
   * Validates the input, then checks if it's correct / too low / too high.
   */
  function handleGuessSubmit() {
    // Don't allow guessing if game is over
    if (gameOver) return;

    // Trim whitespace and check the input isn't empty
    if (guess.trim() === '') {
      setMessage('Please enter a number before guessing.');
      return;
    }

    // Convert the string from the input to a number
    const parsed = Number(guess);

    // Check it's actually a valid number (NaN check)
    if (isNaN(parsed) || !Number.isInteger(parsed)) {
      setMessage('Please enter a valid whole number.');
      return;
    }

    // ── Valid guess: add to the previous guesses list ──────────────────────
    const newGuesses = [...previousGuesses, parsed];
    setPreviousGuesses(newGuesses);
    setGuess(''); // clear the input field after each guess

    // ── Check if correct ───────────────────────────────────────────────────
    if (parsed === secretNumber) {
      // Calculate how many seconds were used
      const timeTaken = timeLimit - timeLeft;

      // Guard: only record once (prevents double-recording if timer fires simultaneously)
      if (!hasRecordedResult.current) {
        hasRecordedResult.current = true;
        recordWin(newGuesses.length, timeTaken);
      }

      setMessage('Correct! 🎉 You guessed the number!');
      setGameOver(true); // disables input and submit button
      alert('Correct!');
      return;
    }

    // ── Too low or too high ────────────────────────────────────────────────
    if (parsed < secretNumber) {
      setMessage('Too low — try a higher number.');
    } else {
      setMessage('Too high — try a lower number.');
    }
  }

  /**
   * Allows the user to press Enter in the input box instead of clicking Guess.
   */
  function handleKeyDown(e) {
    if (e.key === 'Enter') handleGuessSubmit();
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    // Outer page wrapper — centres everything and adds spacing
    <div className="gtn-page">

      {/* ── Page title ── */}
      <h1 className="gtn-title">Guess the Number</h1>

      {/* ── Instructions ── */}
      <p className="gtn-instructions">
        A secret number has been chosen. Guess what it is before the timer
        reaches zero! After each guess you will be told if your guess was too
        low or too high.
      </p>

      {/* ── Controls row: difficulty + reset ── */}
      <div className="gtn-controls">

        {/* Difficulty selector — changing this restarts the game */}
        <label className="gtn-label">
          Difficulty:&nbsp;
          <select
            id="difficulty-select"
            className="gtn-select"
            value={difficulty}
            onChange={handleDifficultyChange}
          >
            <option value="easy">Easy (60s)</option>
            <option value="medium">Medium (45s)</option>
            <option value="hard">Hard (30s)</option>
          </select>
        </label>

        {/* Pause/Resume button — freezes the timer without ending the game */}
        <button
          id="pause-button"
          className={`gtn-btn ${paused ? 'gtn-btn--resume' : 'gtn-btn--pause'}`}
          onClick={handlePauseToggle}
          disabled={gameOver}
        >
          {paused ? '▶ Resume' : '⏸ Pause'}
        </button>

        {/* Reset button — regenerates number, resets timer and guesses */}
        <button
          id="reset-button"
          className="gtn-btn gtn-btn--reset"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {/* ── Timer display ── */}
      {/* Changes colour to red when under 10 seconds to warn the player */}
      <div className={`gtn-timer ${timeLeft <= 10 ? 'gtn-timer--danger' : ''}`}>
        ⏱ {timeLeft}s
      </div>

      {/* ── Status message ── */}
      {/* Tells the player the hint (too low / too high) or the final result */}
      <div
        className={[
          'gtn-status',
          message.includes('Correct') ? 'gtn-status--win' : '',
          message.includes('up') ? 'gtn-status--loss' : '',   // "Time is up"
        ].join(' ')}
        aria-live="polite"
      >
        {message}
      </div>

      {/* ── Guess input row ── */}
      <div className="gtn-input-row">

        {/* Number input — disabled once the game ends */}
        <input
          id="guess-input"
          type="number"
          className="gtn-input"
          placeholder="1 – 100"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={gameOver}
        />

        {/* Submit button — disabled once the game ends */}
        <button
          id="guess-button"
          className="gtn-btn gtn-btn--primary"
          onClick={handleGuessSubmit}
          disabled={gameOver}
        >
          Guess
        </button>
      </div>

      {/* ── Previous guesses list ── */}
      {/* Only shown if at least one guess has been made */}
      {previousGuesses.length > 0 && (
        <div className="gtn-guesses">
          <h2 className="gtn-guesses-title">
            Previous guesses ({previousGuesses.length})
          </h2>
          {/* Map each past guess to a small badge */}
          <div className="gtn-guesses-list">
            {previousGuesses.map((g, index) => (
              <span key={index} className="gtn-guess-badge">
                {g}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}