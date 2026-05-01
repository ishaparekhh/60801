import { useState, useRef, useEffect } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_ID = 'reaction-timer';

// Random delay range: 2000ms – 5000ms (spec requirement)
const MIN_DELAY_MS = 2000;
const MAX_DELAY_MS = 5000;

// Asset paths
const ASSETS = {
  ready:   '/assets/reaction-timer/ready.svg',
  go:      '/assets/reaction-timer/go.svg',
  tooSoon: '/assets/reaction-timer/too-soon.svg',
  timer:   '/assets/shared/timer.svg',
};

// ─── Helper: generate random delay in [MIN, MAX] ──────────────────────────────

function randomDelay() {
  return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
}

// ─── Leaderboard helpers ──────────────────────────────────────────────────────

/**
 * Records a win with the reaction time (in ms converted to seconds as bestTime).
 * Lower time = better, so Math.min is used.
 */
function recordWin(reactionMs) {
  const reactionSec = reactionMs / 1000;
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  const newBest = prev.bestTimeSeconds === null
    ? reactionSec
    : Math.min(prev.bestTimeSeconds, reactionSec);
  saveStoredStats({
    ...current,
    [GAME_ID]: {
      ...prev,
      plays: prev.plays + 1,
      wins: prev.wins + 1,
      bestTimeSeconds: newBest,
    },
  });
}

/**
 * Optionally records a loss when the user clicks too soon.
 */
function recordLoss() {
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  saveStoredStats({
    ...current,
    [GAME_ID]: { ...prev, plays: prev.plays + 1, losses: prev.losses + 1 },
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReactionTimer() {

  // ── State ──────────────────────────────────────────────────────────────────

  // Game phase controls what the reaction area looks like and what clicks do:
  // 'idle'     → before first start or after reset
  // 'waiting'  → random delay is running (user must wait)
  // 'go'       → signal shown, awaiting the click
  // 'tooSoon'  → user clicked during waiting phase
  // 'finished' → valid click received, result shown
  const [phase, setPhase] = useState('idle');

  // performance.now() timestamp recorded when the GO signal appears
  const [startTime, setStartTime] = useState(null);

  // Measured reaction time in milliseconds (null until a valid click)
  const [reactionMs, setReactionMs] = useState(null);

  // Best time across all rounds this session + loaded from localStorage
  const [bestMs, setBestMs] = useState(() => {
    // Load best time from leaderboard on mount (convert seconds → ms)
    const stored = getStoredStats();
    const data = stored[GAME_ID];
    return data?.bestTimeSeconds != null ? data.bestTimeSeconds * 1000 : null;
  });

  // Status message shown above the reaction area
  const [message, setMessage] = useState('Press Start to begin.');

  // ── Refs ───────────────────────────────────────────────────────────────────

  // Holds the setTimeout ID so we can cancel it on reset or unmount
  const timeoutRef = useRef(null);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────

  // Clear any pending timeout when the component is removed from the DOM
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Start: generate a random delay, enter waiting phase.
   * Guard: only allowed from 'idle', 'tooSoon', or 'finished' — not mid-round.
   */
  function handleStart() {
    // Block if already waiting or go signal is showing (no overlapping timers)
    if (phase === 'waiting' || phase === 'go') return;

    // Clear any leftover timeout from a previous round
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setPhase('waiting');
    setReactionMs(null);
    setMessage('Wait for green...');

    // After a random delay, switch to the GO phase
    const delay = randomDelay();
    timeoutRef.current = setTimeout(() => {
      setPhase('go');
      setStartTime(performance.now()); // high-resolution timestamp
      setMessage('Click now!');
    }, delay);
  }

  /**
   * Reset: cancel any pending timeout, return to idle.
   */
  function handleReset() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setPhase('idle');
    setStartTime(null);
    setReactionMs(null);
    setMessage('Press Start to begin.');
  }

  /**
   * Click on the reaction area — behaviour depends on current phase:
   * - 'waiting' → too soon, end round
   * - 'go'      → measure time, record win
   * - anything else → ignore (idle, finished, tooSoon)
   */
  function handleAreaClick() {
    if (phase === 'waiting') {
      // ── Too soon ────────────────────────────────────────────────────────
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      setPhase('tooSoon');
      setMessage('Too soon! Wait for green.');
      recordLoss();

    } else if (phase === 'go') {
      // ── Valid click: calculate reaction time ────────────────────────────
      const elapsed = performance.now() - startTime; // ms, high precision
      const ms = Math.round(elapsed);

      setReactionMs(ms);
      setPhase('finished');
      setMessage(`Your time: ${ms} ms`);

      // Update session best
      setBestMs((prev) => (prev === null ? ms : Math.min(prev, ms)));

      // Persist to leaderboard
      recordWin(ms);
    }
    // 'idle', 'tooSoon', 'finished' → clicks on area do nothing
  }

  // ── Derived values ─────────────────────────────────────────────────────────

  // Which SVG to show in the reaction area
  const areaImage = {
    idle:     ASSETS.ready,
    waiting:  ASSETS.ready,
    go:       ASSETS.go,
    tooSoon:  ASSETS.tooSoon,
    finished: ASSETS.go,
  }[phase] || ASSETS.ready;

  // CSS modifier class for the coloured reaction area background
  const areaMod = {
    idle:     'rt-area--idle',
    waiting:  'rt-area--waiting',
    go:       'rt-area--go',
    tooSoon:  'rt-area--too-soon',
    finished: 'rt-area--finished',
  }[phase] || 'rt-area--idle';

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="rt-page">

      {/* ── Title ── */}
      <h1 className="rt-title">Reaction Timer</h1>

      {/* ── Status message ── */}
      <div
        className={[
          'rt-status',
          phase === 'tooSoon'  ? 'rt-status--bad'  : '',
          phase === 'finished' ? 'rt-status--good' : '',
          phase === 'go'       ? 'rt-status--go'   : '',
        ].join(' ')}
        aria-live="polite"
      >
        {message}
      </div>

      {/* ── Large clickable reaction area ── */}
      {/* Colour changes with phase: grey → yellow → green → red → blue */}
      <div
        id="reaction-area"
        className={`rt-area ${areaMod}`}
        onClick={handleAreaClick}
        role="button"
        aria-label="Reaction area — click when green"
      >
        {/* Phase SVG image */}
        <img
          src={areaImage}
          alt={phase}
          className="rt-area-img"
        />

        {/* Reaction time shown inside the area after a valid click */}
        {phase === 'finished' && reactionMs !== null && (
          <p className="rt-area-result">{reactionMs} ms</p>
        )}
      </div>

      {/* ── Best time display ── */}
      <div className="rt-best">
        <img src={ASSETS.timer} alt="timer" className="rt-best-icon" />
        <span>
          Best: <strong>
            {bestMs !== null ? `${bestMs} ms` : '—'}
          </strong>
        </span>
      </div>

      {/* ── Control buttons ── */}
      <div className="rt-buttons">
        {/* Start button — disabled while a round is in progress */}
        <button
          id="start-button"
          className="rt-btn rt-btn--start"
          onClick={handleStart}
          disabled={phase === 'waiting' || phase === 'go'}
        >
          Start
        </button>

        {/* Reset button — always available */}
        <button
          id="reset-button"
          className="rt-btn rt-btn--reset"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

    </div>
  );
}
