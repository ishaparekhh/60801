import { useState, useRef, useEffect } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_ID = 'simon-says';

// The four colours, in order
const COLOURS = ['red', 'blue', 'green', 'yellow'];

// SVG asset for each colour button (shown as the button background/icon)
const COLOUR_IMGS = {
  red:    '/assets/simon-says/red.svg',
  blue:   '/assets/simon-says/blue.svg',
  green:  '/assets/simon-says/green.svg',
  yellow: '/assets/simon-says/yellow.svg',
};

// How long each colour highlights during sequence playback (ms)
const FLASH_DURATION = 500;
// Gap between flashes (ms)
const FLASH_GAP = 200;

// Win at this level (reaching level 8 = win)
const WIN_LEVEL = 8;

// ─── Helper ───────────────────────────────────────────────────────────────────

function randomColour() {
  return COLOURS[Math.floor(Math.random() * COLOURS.length)];
}

// ─── Leaderboard helpers ──────────────────────────────────────────────────────

function recordResult(level, outcome) {
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  // bestScore = highest level reached
  const newBest = prev.bestScore === null ? level : Math.max(prev.bestScore, level);
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

export default function SimonSays() {

  // ── State ──────────────────────────────────────────────────────────────────

  // The growing sequence of colours to remember
  const [sequence, setSequence] = useState([]);

  // Index into the sequence the player is currently expected to click
  const [playerIndex, setPlayerIndex] = useState(0);

  // The colour currently being highlighted during playback (null = none)
  const [activeColour, setActiveColour] = useState(null);

  // True while the app is playing back the sequence (buttons disabled)
  const [isShowingSequence, setIsShowingSequence] = useState(false);

  // Current round level (starts at 0, increments each round)
  const [level, setLevel] = useState(0);

  // True after a wrong input or after a win
  const [gameOver, setGameOver] = useState(false);

  // Status line
  const [message, setMessage] = useState('Press Start to begin.');

  // Whether the game has been started at all
  const [started, setStarted] = useState(false);

  // Ref to cancel any pending timeouts when resetting
  const timeoutsRef = useRef([]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────

  useEffect(() => {
    return () => timeoutsRef.current.forEach(clearTimeout);
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────

  /**
   * Clears all pending timeouts — called on reset or early game-over.
   */
  function clearAllTimeouts() {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }

  /**
   * Plays back `seq` one colour at a time with flash/gap timing.
   * After playback finishes, enables the player's turn.
   */
  function playSequence(seq) {
    setIsShowingSequence(true);
    setMessage('Watch the sequence...');
    setPlayerIndex(0);

    seq.forEach((colour, i) => {
      // Highlight each colour for FLASH_DURATION ms, with gaps between
      const flashStart = i * (FLASH_DURATION + FLASH_GAP);

      const tOn = setTimeout(() => {
        setActiveColour(colour);
      }, flashStart);

      const tOff = setTimeout(() => {
        setActiveColour(null);
      }, flashStart + FLASH_DURATION);

      timeoutsRef.current.push(tOn, tOff);
    });

    // After all flashes, hand control to the player
    const totalTime = seq.length * (FLASH_DURATION + FLASH_GAP);
    const tDone = setTimeout(() => {
      setIsShowingSequence(false);
      setMessage('Your turn! Repeat the sequence.');
    }, totalTime);

    timeoutsRef.current.push(tDone);
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Start: generates the first colour and begins the game.
   */
  function handleStart() {
    if (started && !gameOver) return; // already running
    clearAllTimeouts();

    const firstColour = randomColour();
    const newSeq = [firstColour];

    setSequence(newSeq);
    setLevel(1);
    setPlayerIndex(0);
    setGameOver(false);
    setStarted(true);

    playSequence(newSeq);
  }

  /**
   * Player clicks a colour button during their turn.
   */
  function handleColourClick(colour) {
    // Block during sequence playback or when game is over / not started
    if (isShowingSequence || gameOver || !started) return;

    const expected = sequence[playerIndex];

    if (colour !== expected) {
      // ── Wrong colour: game over ─────────────────────────────────────────
      setGameOver(true);
      setMessage(`Game over. You reached level ${level}.`);
      recordResult(level, level >= WIN_LEVEL ? 'win' : 'loss');
      alert(`😢 You lose! You reached level ${level}.`);
      return;
    }

    const newIndex = playerIndex + 1;

    if (newIndex === sequence.length) {
      // ── Full sequence correct → check win or next round ─────────────────
      if (level >= WIN_LEVEL) {
        setGameOver(true);
        setMessage(`You win! You reached level ${level}!`);
        recordResult(level, 'win');
        alert(`🎉 You win! You completed all ${level} levels!`);
        return;
      }

      // Advance to next round: add one more colour, increment level
      const nextColour = randomColour();
      const newSeq = [...sequence, nextColour];
      const nextLevel = level + 1;

      setSequence(newSeq);
      setLevel(nextLevel);
      setPlayerIndex(0);
      setMessage('Correct! Watch the next sequence...');

      // Small delay before showing next sequence
      const t = setTimeout(() => playSequence(newSeq), 600);
      timeoutsRef.current.push(t);
    } else {
      // Correct but sequence not finished — continue
      setPlayerIndex(newIndex);
      setMessage(`Good! ${sequence.length - newIndex} more to go.`);
    }
  }

  /**
   * Reset: clears everything back to initial state.
   */
  function handleReset() {
    clearAllTimeouts();
    setSequence([]);
    setPlayerIndex(0);
    setActiveColour(null);
    setIsShowingSequence(false);
    setLevel(0);
    setGameOver(false);
    setStarted(false);
    setMessage('Press Start to begin.');
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="ss-page">

      {/* ── Title ── */}
      <h1 className="ss-title">Simon Says</h1>

      {/* ── Level display ── */}
      <p className="ss-level">Level: <strong>{level}</strong></p>

      {/* ── Status message ── */}
      <div
        className={[
          'ss-status',
          gameOver && level >= WIN_LEVEL ? 'ss-status--win'  : '',
          gameOver && level < WIN_LEVEL  ? 'ss-status--loss' : '',
        ].join(' ')}
        aria-live="polite"
      >
        {message}
      </div>

      {/* ── Four colour buttons arranged in a 2×2 grid ── */}
      <div className="ss-grid">
        {COLOURS.map((colour) => (
          <button
            key={colour}
            id={`colour-${colour}`}
            className={[
              'ss-colour-btn',
              `ss-colour-btn--${colour}`,
              activeColour === colour ? 'ss-colour-btn--active' : '',
            ].join(' ')}
            onClick={() => handleColourClick(colour)}
            disabled={isShowingSequence || gameOver || !started}
            aria-label={colour}
          >
            {/* SVG icon for each colour */}
            <img
              src={COLOUR_IMGS[colour]}
              alt={colour}
              className="ss-colour-img"
            />
          </button>
        ))}
      </div>

      {/* ── Control buttons ── */}
      <div className="ss-controls">
        <button
          id="start-button"
          className="ss-btn ss-btn--start"
          onClick={handleStart}
          disabled={started && !gameOver}
        >
          Start
        </button>
        <button
          id="reset-button"
          className="ss-btn ss-btn--reset"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

    </div>
  );
}
