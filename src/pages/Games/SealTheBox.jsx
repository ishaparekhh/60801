import { useState } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_ID = 'seal-the-box';

// All nine tiles in the game
const ALL_TILES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// Sum of all tiles: 1+2+…+9 = 45
const TOTAL_SUM = 45;

// Dice SVG paths — index [1..6] maps to dice-1.svg..dice-6.svg
const DICE_IMGS = {
  1: '/assets/seal-the-box/dice-1.svg',
  2: '/assets/seal-the-box/dice-2.svg',
  3: '/assets/seal-the-box/dice-3.svg',
  4: '/assets/seal-the-box/dice-4.svg',
  5: '/assets/seal-the-box/dice-5.svg',
  6: '/assets/seal-the-box/dice-6.svg',
};

// ─── Helper functions ─────────────────────────────────────────────────────────

/**
 * Rolls a single die: returns a random integer 1–6.
 */
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

/**
 * Checks whether any subset of `openTiles` sums to `target`.
 *
 * Uses a power-set approach: iterates over all 2^n subsets using bitmask.
 * For n ≤ 9 this is fast (at most 512 iterations).
 *
 * Returns true if at least one valid combination exists.
 */
function hasValidCombination(openTiles, target) {
  const n = openTiles.length;
  const total = 1 << n; // 2^n subsets

  for (let mask = 1; mask < total; mask++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      // If bit i is set in mask, include openTiles[i] in this subset
      if (mask & (1 << i)) {
        sum += openTiles[i];
      }
    }
    if (sum === target) return true;
  }
  return false; // no subset matched
}

// ─── Leaderboard helpers ──────────────────────────────────────────────────────

/**
 * Win: all tiles sealed → remaining score is 0. Lower is better (Math.min).
 */
function recordWin() {
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  // Best score = 0 on a win (all tiles sealed)
  const newBest = prev.bestScore === null ? 0 : Math.min(prev.bestScore, 0);
  saveStoredStats({
    ...current,
    [GAME_ID]: { ...prev, plays: prev.plays + 1, wins: prev.wins + 1, bestScore: newBest },
  });
}

/**
 * Loss: remaining open tile total stored as score. Lower is better.
 */
function recordLoss(remainingScore) {
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  const newBest = prev.bestScore === null
    ? remainingScore
    : Math.min(prev.bestScore, remainingScore);
  saveStoredStats({
    ...current,
    [GAME_ID]: {
      ...prev,
      plays: prev.plays + 1,
      losses: prev.losses + 1,
      bestScore: newBest,
    },
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SealTheBox() {

  // ── State ──────────────────────────────────────────────────────────────────

  // Which tiles are still open (can be clicked/selected)
  const [openTiles, setOpenTiles] = useState([...ALL_TILES]);

  // Which tiles have been permanently closed this game
  const [closedTiles, setClosedTiles] = useState([]);

  // Which open tiles the player has clicked to select for this roll
  const [selectedTiles, setSelectedTiles] = useState([]);

  // The two dice values — null means not yet rolled
  const [dice, setDice] = useState([null, null]);

  // The sum of the two dice — null until first roll
  const [targetTotal, setTargetTotal] = useState(null);

  // Message / error displayed below the controls
  const [message, setMessage] = useState('Roll the dice to begin.');

  // True once the game ends (win or no-moves loss)
  const [gameOver, setGameOver] = useState(false);

  // True after rolling — must seal before rolling again
  // (blocks Roll while there are selected tiles OR dice have been rolled but not sealed)
  const [hasRolled, setHasRolled] = useState(false);

  // ── Derived values ─────────────────────────────────────────────────────────

  // Sum of all currently open tiles (displayed as "score")
  const openScore = openTiles.reduce((sum, t) => sum + t, 0);

  // Sum of tiles the player has selected this turn
  const selectedSum = selectedTiles.reduce((sum, t) => sum + t, 0);

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Roll: generate two dice, compute target, clear previous selection.
   * Guard: cannot roll again once rolled (must seal first).
   */
  function handleRoll() {
    if (gameOver) return;

    // Block re-rolling if dice have already been rolled this turn
    if (hasRolled) {
      setMessage('Seal your selection before rolling again.');
      return;
    }

    const d1 = rollDie();
    const d2 = rollDie();
    const total = d1 + d2;

    setDice([d1, d2]);
    setTargetTotal(total);
    setSelectedTiles([]); // clear previous turn's selections

    // Check whether any valid combination of open tiles exists
    if (!hasValidCombination(openTiles, total)) {
      // No moves available — game over (loss), unless all tiles are already closed
      const remaining = openScore;
      if (remaining === 0) {
        // This shouldn't happen (win triggers before roll) but handle gracefully
        setMessage('You sealed the box! Correct!');
      } else {
        setMessage(`No moves left! Final score: ${remaining}`);
        setGameOver(true);
        recordLoss(remaining);
        alert(`😢 You lose! No moves left. Final score: ${remaining}`);
      }
      return;
    }

    setHasRolled(true);
    setMessage(`Dice total: ${total}. Select tiles that add up to ${total}, then press Seal.`);
  }

  /**
   * Tile click: toggle selection of an open tile.
   * Closed and game-over tiles are ignored.
   * Shows a warning if selected sum would exceed the target.
   */
  function handleTileClick(tile) {
    if (gameOver) return;
    if (!hasRolled) {
      setMessage('Roll the dice first!');
      return;
    }
    if (closedTiles.includes(tile)) return; // closed tiles cannot be selected

    if (selectedTiles.includes(tile)) {
      // Deselect the tile
      setSelectedTiles((prev) => prev.filter((t) => t !== tile));
      setMessage(`Dice total: ${targetTotal}. Keep selecting tiles.`);
    } else {
      // Would adding this tile exceed the target?
      if (selectedSum + tile > targetTotal) {
        setMessage(`Adding ${tile} would exceed the target of ${targetTotal}!`);
        return;
      }
      setSelectedTiles((prev) => [...prev, tile]);
      setMessage(`Selected total: ${selectedSum + tile} / ${targetTotal}`);
    }
  }

  /**
   * Seal: permanently close all selected tiles if their sum equals the target.
   */
  function handleSeal() {
    if (gameOver) return;

    // Must have rolled before sealing
    if (!hasRolled || targetTotal === null) {
      setMessage('Roll the dice before sealing!');
      return;
    }

    // Selected sum must match the dice total exactly
    if (selectedSum !== targetTotal) {
      setMessage(`Selected total (${selectedSum}) must equal dice total (${targetTotal}).`);
      return;
    }

    // Close the selected tiles permanently
    const newClosed = [...closedTiles, ...selectedTiles];
    const newOpen   = openTiles.filter((t) => !selectedTiles.includes(t));

    setClosedTiles(newClosed);
    setOpenTiles(newOpen);
    setSelectedTiles([]);
    setHasRolled(false); // must roll again before sealing more

    // ── Check win: all tiles closed ────────────────────────────────────────
    if (newOpen.length === 0) {
      alert('Correct!');
      recordWin();
      // Reset after win
      handleReset();
      return;
    }

    setMessage(`Tiles sealed! Roll again. Remaining score: ${newOpen.reduce((s, t) => s + t, 0)}`);
  }

  /**
   * Reset: reopens all tiles, clears everything back to initial state.
   */
  function handleReset() {
    setOpenTiles([...ALL_TILES]);
    setClosedTiles([]);
    setSelectedTiles([]);
    setDice([null, null]);
    setTargetTotal(null);
    setMessage('Roll the dice to begin.');
    setGameOver(false);
    setHasRolled(false);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="stb-page">

      {/* ── Title ── */}
      <h1 className="stb-title">Seal the Box</h1>

      {/* ── Instructions ── */}
      <p className="stb-instructions">
        Roll two dice and close tiles whose numbers add up to the dice total.
        Seal all 9 tiles to win!
      </p>

      {/* ── Tiles 1–9 ── */}
      <div className="stb-tiles">
        {ALL_TILES.map((tile) => {
          const isClosed   = closedTiles.includes(tile);
          const isSelected = selectedTiles.includes(tile);
          return (
            <div
              key={tile}
              id={`tile-${tile}`}
              className={[
                'stb-tile',
                isClosed   ? 'stb-tile--closed'   : '',
                isSelected ? 'stb-tile--selected' : '',
                !isClosed && !isSelected ? 'stb-tile--open' : '',
              ].join(' ')}
              onClick={() => handleTileClick(tile)}
              role="button"
              aria-label={`Tile ${tile}${isClosed ? ' (closed)' : ''}`}
            >
              {tile}
            </div>
          );
        })}
      </div>

      {/* ── Score display ── */}
      <p className="stb-score">
        Open tile score: <strong>{openScore}</strong>
        {targetTotal !== null && selectedTiles.length > 0 && (
          <span className="stb-selected-sum">
            {' '}| Selected: <strong>{selectedSum}</strong> / {targetTotal}
          </span>
        )}
      </p>

      {/* ── Dice display area ── */}
      <div className="stb-dice-area">
        {dice.map((val, i) => (
          <div key={i} className="stb-die">
            {val !== null ? (
              <img
                src={DICE_IMGS[val]}
                alt={`Dice showing ${val}`}
                className="stb-die-img"
              />
            ) : (
              // Blank placeholder before first roll
              <div className="stb-die-placeholder">?</div>
            )}
          </div>
        ))}
      </div>

      {/* ── Status message ── */}
      <div
        className={[
          'stb-message',
          gameOver ? 'stb-message--loss' : '',
        ].join(' ')}
        aria-live="polite"
      >
        {message}
      </div>

      {/* ── Control buttons ── */}
      <div className="stb-controls">
        {/* Roll button — disabled after rolling until sealed, and after game over */}
        <button
          id="roll-button"
          className="stb-btn stb-btn--roll"
          onClick={handleRoll}
          disabled={gameOver || hasRolled}
        >
          Roll
        </button>

        {/* Seal button — disabled before rolling or after game over */}
        <button
          id="seal-button"
          className="stb-btn stb-btn--seal"
          onClick={handleSeal}
          disabled={gameOver || !hasRolled}
        >
          Seal
        </button>

        {/* Reset — always available */}
        <button
          id="reset-button"
          className="stb-btn stb-btn--reset"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

    </div>
  );
}
