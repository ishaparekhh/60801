import { useState } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_ID = 'tic-tac-toe';

// All 8 possible winning lines (indices into the flat 9-cell board array)
const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
];

const X_IMG = '/assets/tic-tac-toe/x.svg';
const O_IMG = '/assets/tic-tac-toe/o.svg';

// ─── Helper: check 8 lines for a winner ──────────────────────────────────────

/**
 * Returns 'X', 'O', or null depending on whether there is a winner.
 * Checks all 8 possible winning lines.
 */
function calculateWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // 'X' or 'O'
    }
  }
  return null;
}

// ─── Leaderboard helpers ──────────────────────────────────────────────────────

function recordResult(outcome) {
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  saveStoredStats({
    ...current,
    [GAME_ID]: {
      ...prev,
      plays:   prev.plays + 1,
      wins:    prev.wins   + (outcome === 'win'  ? 1 : 0),
      losses:  prev.losses + (outcome === 'loss' ? 1 : 0),
      draws:   prev.draws  + (outcome === 'draw' ? 1 : 0),
    },
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TicTacToe() {

  // ── State ──────────────────────────────────────────────────────────────────

  // Flat 9-cell array: null | 'X' | 'O'
  const [board, setBoard] = useState(Array(9).fill(null));

  // Whose turn it is
  const [currentPlayer, setCurrentPlayer] = useState('X');

  // Winner ('X' | 'O') or null
  const [winner, setWinner] = useState(null);

  // True if all 9 cells filled and no winner
  const [isDraw, setIsDraw] = useState(false);

  // Status line
  const [message, setMessage] = useState('X turn');

  // Session scoreboard (persists until browser refresh)
  const [sessionScore, setSessionScore] = useState({ X: 0, O: 0, draws: 0 });

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Cell click: place the current player's symbol, then check for win/draw.
   */
  function handleCellClick(index) {
    // Block clicks on filled cells or after game over
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    // Check for a winner after this move
    const w = calculateWinner(newBoard);
    if (w) {
      setWinner(w);
      setMessage(`${w} wins!`);
      // X treated as user (win), O treated as opponent (loss)
      const outcome = w === 'X' ? 'win' : 'loss';
      recordResult(outcome);
      setSessionScore((prev) => ({ ...prev, [w]: prev[w] + 1 }));
      alert(w === 'X' ? '🎉 You win!' : '😢 You lose!');
      return;
    }

    // Check for draw: all cells filled, no winner
    if (newBoard.every((cell) => cell !== null)) {
      setIsDraw(true);
      setMessage('Draw!');
      recordResult('draw');
      setSessionScore((prev) => ({ ...prev, draws: prev.draws + 1 }));
      alert("🤝 It's a draw!");
      return;
    }

    // Switch player
    const next = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(next);
    setMessage(`${next} turn`);
  }

  /**
   * Reset: clear board, reset to X's turn, keep session score.
   */
  function handleReset() {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setIsDraw(false);
    setMessage('X turn');
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="ttt-page">

      {/* ── Title ── */}
      <h1 className="ttt-title">Tic Tac Toe</h1>

      {/* ── Session scoreboard ── */}
      <div className="ttt-scoreboard">
        <span className="ttt-score ttt-score--x">X: {sessionScore.X}</span>
        <span className="ttt-score ttt-score--draw">Draw: {sessionScore.draws}</span>
        <span className="ttt-score ttt-score--o">O: {sessionScore.O}</span>
      </div>

      {/* ── Status message ── */}
      <div
        className={[
          'ttt-status',
          winner === 'X'  ? 'ttt-status--x'    : '',
          winner === 'O'  ? 'ttt-status--o'    : '',
          isDraw          ? 'ttt-status--draw'  : '',
        ].join(' ')}
        aria-live="polite"
      >
        {message}
      </div>

      {/* ── 3×3 board ── */}
      <div className="ttt-board">
        {board.map((cell, index) => (
          <div
            key={index}
            id={`cell-${index}`}
            className={[
              'ttt-cell',
              cell ? 'ttt-cell--filled' : 'ttt-cell--empty',
            ].join(' ')}
            onClick={() => handleCellClick(index)}
            role="button"
            aria-label={`Cell ${index + 1}: ${cell || 'empty'}`}
          >
            {cell === 'X' && <img src={X_IMG} alt="X" className="ttt-symbol" />}
            {cell === 'O' && <img src={O_IMG} alt="O" className="ttt-symbol" />}
          </div>
        ))}
      </div>

      {/* ── Reset button ── */}
      <button
        id="reset-button"
        className="ttt-btn ttt-btn--reset"
        onClick={handleReset}
      >
        Reset
      </button>

    </div>
  );
}
