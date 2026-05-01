import { useState } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_ID = 'rock-paper-scissors';

// The three valid choices (lowercase — capitalised in the UI via CSS/template literals)
const CHOICES = ['rock', 'paper', 'scissors'];

// Asset paths for each choice
const CHOICE_IMGS = {
  rock:     '/assets/rock-paper-scissors/rock.svg',
  paper:    '/assets/rock-paper-scissors/paper.svg',
  scissors: '/assets/rock-paper-scissors/scissors.svg',
};

// ─── Helper functions ─────────────────────────────────────────────────────────

/**
 * Picks a random choice for the computer from the three options.
 */
function computerPick() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

/**
 * Compares player and computer choices.
 * Returns 'win' | 'loss' | 'draw'.
 *
 * Win rules:
 *   rock beats scissors
 *   scissors beats paper
 *   paper beats rock
 */
function getResult(player, computer) {
  if (player === computer) return 'draw';

  // Map each choice to what it beats
  const beats = {
    rock:     'scissors',
    scissors: 'paper',
    paper:    'rock',
  };

  return beats[player] === computer ? 'win' : 'loss';
}

// ─── Leaderboard helpers ──────────────────────────────────────────────────────

function recordResult(outcome) {
  // outcome is 'win' | 'loss' | 'draw'
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  saveStoredStats({
    ...current,
    [GAME_ID]: {
      ...prev,
      plays:  prev.plays + 1,
      wins:   prev.wins   + (outcome === 'win'  ? 1 : 0),
      losses: prev.losses + (outcome === 'loss' ? 1 : 0),
      draws:  prev.draws  + (outcome === 'draw' ? 1 : 0),
    },
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RockPaperScissors() {

  // ── State ──────────────────────────────────────────────────────────────────

  // Latest choices — null before first round
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);

  // Result of the latest round: 'win' | 'loss' | 'draw' | null
  const [result, setResult] = useState(null);

  // How many rounds have been played this session
  const [rounds, setRounds] = useState(0);

  // Session score counters
  const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Called when the player clicks one of the three choice buttons.
   * Each click creates a new independent round.
   */
  function handleChoice(choice) {
    // Computer picks randomly — new pick every single round
    const comp = computerPick();
    const outcome = getResult(choice, comp);

    // Update choices and result
    setPlayerChoice(choice);
    setComputerChoice(comp);
    setResult(outcome);

    // Increment round counter
    setRounds((prev) => prev + 1);

    // Update session score for this outcome
    setScore((prev) => ({
      ...prev,
      wins:   prev.wins   + (outcome === 'win'  ? 1 : 0),
      losses: prev.losses + (outcome === 'loss' ? 1 : 0),
      draws:  prev.draws  + (outcome === 'draw' ? 1 : 0),
    }));

    // Persist to leaderboard — one entry per round
    recordResult(outcome);
    if (outcome === 'win')  alert('🎉 You win this round!');
    else if (outcome === 'loss') alert('😢 You lose this round!');
    else alert("🤝 It's a draw!");
  }

  /**
   * Resets all session state: choices, result, rounds, and session score.
   * Does NOT clear the leaderboard (that's persisted separately).
   */
  function handleReset() {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setRounds(0);
    setScore({ wins: 0, losses: 0, draws: 0 });
  }

  // ── Derived display values ─────────────────────────────────────────────────

  // Human-readable result message — spec-exact strings
  const resultMessage = {
    win:  'You win!',
    loss: 'You lose!',
    draw: 'Draw!',
  }[result] ?? 'Choose an option.';

  // Capitalise first letter of a choice for display (e.g. 'rock' → 'Rock')
  const cap = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '—';

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="rps-page">

      {/* ── Title ── */}
      <h1 className="rps-title">Rock Paper Scissors</h1>

      {/* ── Round counter ── */}
      <p className="rps-rounds">Round: <strong>{rounds}</strong></p>

      {/* ── Session score row ── */}
      <div className="rps-score-row">
        <span className="rps-score rps-score--win">You: {score.wins}</span>
        <span className="rps-score rps-score--draw">Draw: {score.draws}</span>
        <span className="rps-score rps-score--loss">CPU: {score.losses}</span>
      </div>

      {/* ── Three choice buttons ── */}
      {/* Each shows the SVG asset + the choice label */}
      <div className="rps-choices">
        {CHOICES.map((choice) => (
          <button
            key={choice}
            id={`choice-${choice}`}
            className={[
              'rps-choice-btn',
              playerChoice === choice ? 'rps-choice-btn--active' : '',
            ].join(' ')}
            onClick={() => handleChoice(choice)}
            aria-label={cap(choice)}
          >
            <img
              src={CHOICE_IMGS[choice]}
              alt={choice}
              className="rps-choice-img"
            />
            {/* Choice label below the icon */}
            <span>{cap(choice)}</span>
          </button>
        ))}
      </div>

      {/* ── Latest choices display ── */}
      {/* Shows what both player and computer picked this round */}
      <div className="rps-picks">

        {/* Player's pick */}
        <div className="rps-pick">
          <p className="rps-pick-label">You</p>
          {playerChoice ? (
            <img
              src={CHOICE_IMGS[playerChoice]}
              alt={playerChoice}
              className="rps-pick-img"
            />
          ) : (
            <div className="rps-pick-empty">?</div>
          )}
          <p className="rps-pick-name">{cap(playerChoice)}</p>
        </div>

        {/* VS divider */}
        <span className="rps-vs">VS</span>

        {/* Computer's pick */}
        <div className="rps-pick">
          <p className="rps-pick-label">CPU</p>
          {computerChoice ? (
            <img
              src={CHOICE_IMGS[computerChoice]}
              alt={computerChoice}
              className="rps-pick-img"
            />
          ) : (
            <div className="rps-pick-empty">?</div>
          )}
          <p className="rps-pick-name">{cap(computerChoice)}</p>
        </div>

      </div>

      {/* ── Result message ── */}
      <div
        className={[
          'rps-result',
          result === 'win'  ? 'rps-result--win'  : '',
          result === 'loss' ? 'rps-result--loss' : '',
          result === 'draw' ? 'rps-result--draw' : '',
        ].join(' ')}
        aria-live="polite"
      >
        {resultMessage}
      </div>

      {/* ── Reset button ── */}
      <button
        id="reset-button"
        className="rps-btn rps-btn--reset"
        onClick={handleReset}
      >
        Reset
      </button>

    </div>
  );
}
