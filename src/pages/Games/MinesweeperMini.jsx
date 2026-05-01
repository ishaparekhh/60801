import { useState } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_ID = 'minesweeper-mini';

// Difficulty config: grid size and mine count
const DIFFICULTY_CONFIG = {
  easy:   { size: 4, mines: 3 },
  medium: { size: 5, mines: 5 },
  hard:   { size: 6, mines: 8 },
};

// Asset paths (served from /public)
const MINE_IMG = '/assets/minesweeper-mini/mine.svg';
const FLAG_IMG = '/assets/minesweeper-mini/flag.svg';

// Colour for each adjacent-mine count (classic Minesweeper colours)
const COUNT_COLOURS = {
  1: '#2563eb', // blue
  2: '#16a34a', // green
  3: '#dc2626', // red
  4: '#1e40af', // dark blue
  5: '#9f1239', // dark red
  6: '#0891b2', // cyan
  7: '#7c3aed', // purple
  8: '#374151', // dark grey
};

// ─── Helper functions ─────────────────────────────────────────────────────────

/**
 * Returns all valid [r, c] neighbour coordinates around (row, col).
 * Filters out out-of-bounds positions automatically.
 */
function getNeighbours(row, col, size) {
  const neighbours = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue; // skip the cell itself
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < size && c >= 0 && c < size) {
        neighbours.push([r, c]);
      }
    }
  }
  return neighbours;
}

/**
 * Randomly places `mineCount` mines on a `size × size` grid.
 * Returns a Set of strings like "row-col" for fast lookup.
 */
function generateMinePositions(size, mineCount) {
  const mineSet = new Set();
  while (mineSet.size < mineCount) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);
    mineSet.add(`${row}-${col}`);
  }
  return mineSet;
}

/**
 * Counts how many of the 8 neighbours of (row, col) are mines.
 */
function countAdjacentMines(row, col, size, mineSet) {
  return getNeighbours(row, col, size).filter(
    ([r, c]) => mineSet.has(`${r}-${c}`)
  ).length;
}

/**
 * Builds a full grid of cell objects based on the current difficulty.
 * Each cell follows the suggested shape from the spec.
 */
function buildGrid(difficulty) {
  const { size, mines } = DIFFICULTY_CONFIG[difficulty];
  const mineSet = generateMinePositions(size, mines);

  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => ({
      id: `${row}-${col}`,
      row,
      col,
      isMine: mineSet.has(`${row}-${col}`),
      adjacentMines: countAdjacentMines(row, col, size, mineSet),
      isRevealed: false,
      isFlagged: false,
    }))
  );
}

/**
 * Checks whether the player has won:
 * every non-mine cell must be revealed.
 */
function checkWin(grid) {
  return grid.every((row) =>
    row.every((cell) => cell.isMine || cell.isRevealed)
  );
}

/**
 * Flood-fill (BFS) reveal: when a zero-adjacent cell is clicked,
 * recursively reveal all connected zero cells AND their numbered neighbours.
 * Returns a new grid with the affected cells revealed.
 */
function floodReveal(grid, startRow, startCol, size) {
  // Deep-copy the grid so we don't mutate state directly
  const newGrid = grid.map((row) => row.map((cell) => ({ ...cell })));

  const queue = [[startRow, startCol]];
  const visited = new Set([`${startRow}-${startCol}`]);

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    newGrid[r][c].isRevealed = true;

    // Only spread to neighbours if this cell has 0 adjacent mines
    if (newGrid[r][c].adjacentMines === 0) {
      for (const [nr, nc] of getNeighbours(r, c, size)) {
        const key = `${nr}-${nc}`;
        if (!visited.has(key) && !newGrid[nr][nc].isMine && !newGrid[nr][nc].isRevealed) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
  }

  return newGrid;
}

// ─── Leaderboard helpers ──────────────────────────────────────────────────────

function recordWin(revealedCount) {
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  // bestScore = most cells revealed in a win (higher = better)
  const newBest = prev.bestScore === null
    ? revealedCount
    : Math.max(prev.bestScore, revealedCount);
  saveStoredStats({
    ...current,
    [GAME_ID]: { ...prev, plays: prev.plays + 1, wins: prev.wins + 1, bestScore: newBest },
  });
}

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

export default function MinesweeperMini() {

  // ── State ──────────────────────────────────────────────────────────────────

  // Selected difficulty: 'easy' | 'medium' | 'hard'
  const [difficulty, setDifficulty] = useState('easy');

  // 2D array of cell objects
  const [grid, setGrid] = useState(() => buildGrid('easy'));

  // 'playing' | 'won' | 'lost'
  const [gameState, setGameState] = useState('playing');

  // Hint message shown to the player
  const [message, setMessage] = useState('Click a cell to start!');

  // ── Derived values ─────────────────────────────────────────────────────────

  const { size, mines: totalMines } = DIFFICULTY_CONFIG[difficulty];

  // How many cells have been revealed so far
  const revealedCount = grid.flat().filter((c) => c.isRevealed).length;

  // How many flags have been placed (to show remaining mine count)
  const flagCount = grid.flat().filter((c) => c.isFlagged).length;

  // Remaining mines = total mines − flags placed
  const remainingMines = totalMines - flagCount;

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Resets the board with a fresh randomly-generated grid.
   * Called on difficulty change or Reset button click.
   */
  function handleReset(newDifficulty = difficulty) {
    setGrid(buildGrid(newDifficulty));
    setGameState('playing');
    setMessage('Click a cell to start!');
  }

  /**
   * Difficulty selector change — rebuilds the board for the new difficulty.
   */
  function handleDifficultyChange(e) {
    const newDiff = e.target.value;
    setDifficulty(newDiff);
    handleReset(newDiff);
  }

  /**
   * Left-click: reveal a hidden, unflagged cell.
   * - If mine → game over, reveal all mines.
   * - If 0 adjacent → flood-fill reveal neighbours.
   * - Otherwise → reveal just this cell.
   */
  function handleCellClick(row, col) {
    if (gameState !== 'playing') return; // block clicks after game ends

    const cell = grid[row][col];
    if (cell.isRevealed || cell.isFlagged) return; // ignore revealed/flagged cells

    if (cell.isMine) {
      // ── Loss: reveal all mines ──────────────────────────────────────────
      const newGrid = grid.map((r) =>
        r.map((c) => ({ ...c, isRevealed: c.isMine ? true : c.isRevealed }))
      );
      setGrid(newGrid);
      setGameState('lost');
      setMessage('Game over!');
      recordLoss();
      alert('💥 You lose! You hit a mine.');
      return;
    }

    // ── Safe cell: reveal via flood-fill (handles 0-adjacent cascade) ────
    const newGrid = floodReveal(grid, row, col, size);
    setGrid(newGrid);

    // Check win after revealing
    if (checkWin(newGrid)) {
      const revealed = newGrid.flat().filter((c) => c.isRevealed).length;
      setGameState('won');
      setMessage('Correct!');
      recordWin(revealed);
      alert('🎉 You win! All safe cells revealed.');
    } else {
      setMessage('Keep going!');
    }
  }

  /**
   * Right-click: toggle a flag on a hidden cell.
   * Prevents browser context menu with e.preventDefault().
   */
  function handleRightClick(e, row, col) {
    e.preventDefault(); // stop the browser right-click menu
    if (gameState !== 'playing') return;

    const cell = grid[row][col];
    if (cell.isRevealed) return; // can't flag a revealed cell

    const newGrid = grid.map((r) =>
      r.map((c) =>
        c.id === cell.id ? { ...c, isFlagged: !c.isFlagged } : c
      )
    );
    setGrid(newGrid);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="ms-page">

      {/* ── Title ── */}
      <h1 className="ms-title">Minesweeper Mini</h1>

      {/* ── Difficulty selector ── */}
      <div className="ms-controls-top">
        <label htmlFor="difficulty-select" className="ms-label">Difficulty:</label>
        <select
          id="difficulty-select"
          className="ms-select"
          value={difficulty}
          onChange={handleDifficultyChange}
        >
          <option value="easy">Easy (4×4, 3 mines)</option>
          <option value="medium">Medium (5×5, 5 mines)</option>
          <option value="hard">Hard (6×6, 8 mines)</option>
        </select>
      </div>

      {/* ── Stats row: mine counter + revealed counter ── */}
      <div className="ms-stats">
        {/* Mine counter: remaining unflagged mines */}
        <span className="ms-stat">
          <img src={MINE_IMG} alt="mines" className="ms-stat-icon" />
          <strong>{remainingMines}</strong> mines left
        </span>
        {/* Revealed cells counter */}
        <span className="ms-stat">
          ✓ <strong>{revealedCount}</strong> revealed
        </span>
      </div>

      {/* ── Status message ── */}
      <div
        className={[
          'ms-status',
          gameState === 'won'  ? 'ms-status--win'  : '',
          gameState === 'lost' ? 'ms-status--loss' : '',
        ].join(' ')}
        aria-live="polite"
      >
        {message}
      </div>

      {/* ── Grid ── */}
      {/* Dynamic grid-template-columns based on the current difficulty size */}
      <div
        className="ms-grid"
        style={{ gridTemplateColumns: `repeat(${size}, 56px)` }}
      >
        {grid.map((row) =>
          row.map((cell) => {

            // Decide what content to show inside the cell
            let content = null;

            if (cell.isRevealed) {
              if (cell.isMine) {
                // Show mine SVG when revealed on loss
                content = <img src={MINE_IMG} alt="mine" className="ms-cell-icon" />;
              } else if (cell.adjacentMines > 0) {
                // Show the adjacent mine count with the classic colour
                content = (
                  <span style={{ color: COUNT_COLOURS[cell.adjacentMines] || '#000' }}>
                    {cell.adjacentMines}
                  </span>
                );
              }
              // adjacentMines === 0 → blank (empty revealed cell)
            } else if (cell.isFlagged) {
              // Show flag SVG when flagged (right-clicked)
              content = <img src={FLAG_IMG} alt="flag" className="ms-cell-icon" />;
            }

            return (
              <div
                key={cell.id}
                id={`cell-${cell.id}`}
                className={[
                  'ms-cell',
                  cell.isRevealed ? 'ms-cell--revealed' : 'ms-cell--hidden',
                  cell.isRevealed && cell.isMine ? 'ms-cell--mine' : '',
                ].join(' ')}
                onClick={() => handleCellClick(cell.row, cell.col)}
                onContextMenu={(e) => handleRightClick(e, cell.row, cell.col)}
                role="button"
                aria-label={`Cell ${cell.id}`}
              >
                {content}
              </div>
            );
          })
        )}
      </div>

      {/* ── Reset button ── */}
      <button
        id="reset-button"
        className="ms-btn ms-btn--reset"
        onClick={() => handleReset()}
      >
        Reset
      </button>

    </div>
  );
}
