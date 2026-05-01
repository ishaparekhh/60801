import { useState } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_ID = 'connect-four';
const ROWS = 6;
const COLS = 7;

// Token SVG paths (served from /public)
const TOKEN_IMGS = {
  red:    '/assets/connect-four/red-token.svg',
  yellow: '/assets/connect-four/yellow-token.svg',
};

// ─── Helper functions ─────────────────────────────────────────────────────────

/**
 * Creates a fresh empty board: 6 rows × 7 columns, all null.
 * Each cell is null | 'red' | 'yellow'.
 */
function emptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

/**
 * Finds the lowest empty row in a column (gravity — tokens fall down).
 * Returns the row index, or -1 if the column is full.
 */
function lowestEmptyRow(board, col) {
  // Start from the bottom row (ROWS-1) and move up
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === null) return row;
  }
  return -1; // column is full
}

/**
 * Checks if the board is completely full (no null cells remain).
 * Used to detect a draw after every move.
 */
function isBoardFull(board) {
  // If row 0 (top) has any null, the board still has space
  return board[0].every((cell) => cell !== null);
}

/**
 * Checks whether the player who just placed at (row, col) has won.
 * Tests all 4 directions: horizontal, vertical, diagonal ↘, diagonal ↗.
 *
 * Strategy: for each direction, count consecutive same-colour tokens
 * that include the just-placed cell.  If count >= 4, it's a win.
 */
function checkWinner(board, row, col, player) {
  // Each direction pair is [rowDelta, colDelta]
  const directions = [
    [0, 1],   // horizontal →
    [1, 0],   // vertical ↓
    [1, 1],   // diagonal ↘
    [1, -1],  // diagonal ↗
  ];

  for (const [dr, dc] of directions) {
    let count = 1; // count the placed token itself

    // Count in the positive direction
    let r = row + dr;
    let c = col + dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      count++;
      r += dr;
      c += dc;
    }

    // Count in the negative direction (opposite end of the line)
    r = row - dr;
    c = col - dc;
    while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
      count++;
      r -= dr;
      c -= dc;
    }

    if (count >= 4) return true; // four (or more) in a row found!
  }

  return false; // no winning line through (row, col)
}

// ─── leaderboard helpers ──────────────────────────────────────────────────────

function recordWin(player) {
  // We treat 'red' as the "home" player for leaderboard wins
  // (both colours share the same game slot — one win is one win)
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  saveStoredStats({
    ...current,
    [GAME_ID]: { ...prev, plays: prev.plays + 1, wins: prev.wins + 1 },
  });
}

function recordDraw() {
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  saveStoredStats({
    ...current,
    [GAME_ID]: { ...prev, plays: prev.plays + 1, draws: prev.draws + 1 },
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConnectFour() {

  // ── State ──────────────────────────────────────────────────────────────────

  // 2D array [row][col], each cell is null | 'red' | 'yellow'
  const [board, setBoard] = useState(emptyBoard);

  // Whose turn it is ('red' starts first per spec)
  const [currentPlayer, setCurrentPlayer] = useState('red');

  // null while playing, 'red' | 'yellow' | 'draw' once game ends
  const [winner, setWinner] = useState(null);

  // Status line shown to the player
  const [message, setMessage] = useState('Red turn');

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Called when the player clicks a column (either the header button or a cell).
   * Drops a token into the lowest empty row of that column.
   */
  function handleColumnClick(col) {
    // Ignore clicks when game is already over
    if (winner) return;

    // Find where the token lands
    const row = lowestEmptyRow(board, col);

    if (row === -1) {
      // Column is full — spec: no token placed, player doesn't change
      setMessage('Column full');
      return;
    }

    // Place the token — create a deep copy so React detects the change
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);

    // ── Check win ──────────────────────────────────────────────────────────
    if (checkWinner(newBoard, row, col, currentPlayer)) {
      const msg = currentPlayer === 'red' ? 'Red wins!' : 'Yellow wins!';
      setMessage(msg);
      setWinner(currentPlayer);
      recordWin(currentPlayer);
      alert(`🎉 ${msg}`);
      return;
    }

    // ── Check draw ─────────────────────────────────────────────────────────
    if (isBoardFull(newBoard)) {
      setMessage('Draw!');
      setWinner('draw');
      recordDraw();
      alert("🤝 It's a draw!");
      return;
    }

    // ── Swap player ────────────────────────────────────────────────────────
    const nextPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
    setCurrentPlayer(nextPlayer);
    setMessage(`${nextPlayer.charAt(0).toUpperCase() + nextPlayer.slice(1)} turn`);
  }

  /**
   * Resets the board, restores red as starting player, clears game-over state.
   */
  function handleReset() {
    setBoard(emptyBoard());
    setCurrentPlayer('red');
    setWinner(null);
    setMessage('Red turn');
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    // Outer page wrapper
    <div className="cf-page">

      {/* ── Title ── */}
      <h1 className="cf-title">Connect Four</h1>

      {/* ── Current player display ── */}
      <div className="cf-player-display">
        {/* Small token icon next to the player label */}
        {!winner && (
          <>
            <img
              src={TOKEN_IMGS[currentPlayer]}
              alt={currentPlayer}
              className="cf-player-token"
            />
            <span>
              {currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn
            </span>
          </>
        )}
      </div>

      {/* ── Status message ── */}
      {/* Changes colour: green for win, neutral for draw/column full */}
      <div
        className={[
          'cf-status',
          winner === 'red'    ? 'cf-status--red'    : '',
          winner === 'yellow' ? 'cf-status--yellow' : '',
          winner === 'draw'   ? 'cf-status--draw'   : '',
        ].join(' ')}
        aria-live="polite"
      >
        {message}
      </div>

      {/* ── Board + column drop buttons ── */}
      <div className="cf-board-wrapper">

        {/* Column click buttons sit above each column */}
        <div className="cf-col-buttons">
          {Array.from({ length: COLS }, (_, col) => (
            <button
              key={col}
              id={`col-btn-${col}`}
              className="cf-col-btn"
              onClick={() => handleColumnClick(col)}
              disabled={!!winner}
              aria-label={`Drop token in column ${col + 1}`}
            >
              ▼
            </button>
          ))}
        </div>

        {/* The 6×7 grid of cells */}
        {/* Rendered row-by-row top to bottom */}
        <div className="cf-board">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="cf-cell"
                onClick={() => handleColumnClick(colIndex)}
              >
                {/* The circular slot — empty, red, or yellow */}
                <div
                  className={[
                    'cf-token',
                    cell === 'red'    ? 'cf-token--red'    : '',
                    cell === 'yellow' ? 'cf-token--yellow' : '',
                  ].join(' ')}
                >
                  {/* Show SVG token image when cell is occupied */}
                  {cell && (
                    <img
                      src={TOKEN_IMGS[cell]}
                      alt={`${cell} token`}
                      className="cf-token-img"
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Reset button ── */}
      <button
        id="reset-button"
        className="cf-btn cf-btn--reset"
        onClick={handleReset}
      >
        Reset
      </button>

    </div>
  );
}
