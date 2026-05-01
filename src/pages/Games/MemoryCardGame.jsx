import { useState, useEffect } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_ID = 'memory-card-game';

// The 6 match image paths (served from /public/assets/memory-card-game/)
const MATCH_IMAGES = [
  '/assets/memory-card-game/match-1.svg',
  '/assets/memory-card-game/match-2.svg',
  '/assets/memory-card-game/match-3.svg',
  '/assets/memory-card-game/match-4.svg',
  '/assets/memory-card-game/match-5.svg',
  '/assets/memory-card-game/match-6.svg',
];

const CARD_BACK = '/assets/memory-card-game/card-back.svg';

// ─── Helper functions ─────────────────────────────────────────────────────────

/**
 * Builds a shuffled deck of 12 cards (6 pairs).
 * Each card is an object: { id: uniqueIndex, imageIndex: 0-5 }
 * We use a unique `id` per card so React keys and state IDs are stable.
 */
function buildShuffledDeck() {
  // Create pairs: [0,0, 1,1, 2,2, 3,3, 4,4, 5,5]
  const pairs = [...MATCH_IMAGES, ...MATCH_IMAGES].map((src, i) => ({
    id: i,              // unique id for this card slot
    imageIndex: i % 6, // which of the 6 images this card shows
    src,
  }));

  // Fisher-Yates shuffle — mutates a copy
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
  }

  // Re-assign ids after shuffle so ids match array positions (0-11)
  return pairs.map((card, index) => ({ ...card, id: index }));
}

/**
 * Records a win in localStorage using the project's gameStats utility.
 * bestScore = fewest moves (lower is better), so we use Math.min.
 */
function recordWin(moves) {
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  const newBest = prev.bestScore === null ? moves : Math.min(prev.bestScore, moves);
  saveStoredStats({
    ...current,
    [GAME_ID]: { ...prev, plays: prev.plays + 1, wins: prev.wins + 1, bestScore: newBest },
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MemoryCardGame() {

  // ── State ──────────────────────────────────────────────────────────────────

  // Array of 12 card objects, randomly shuffled on start/reset
  const [cards, setCards] = useState(() => buildShuffledDeck());

  // IDs of the 1 or 2 cards currently flipped up (but not yet matched)
  const [flippedIds, setFlippedIds] = useState([]);

  // IDs of all cards that have been matched and locked face-up
  const [matchedIds, setMatchedIds] = useState([]);

  // How many pairs of cards the player has flipped (each pair = 1 move)
  const [moves, setMoves] = useState(0);

  // True while we're waiting for the mismatch delay to finish.
  // Blocks further clicks so the player can't flip a 3rd card mid-check.
  const [isChecking, setIsChecking] = useState(false);

  // True during the 1-second peek window — blocks flipping during peek
  const [isPeeking, setIsPeeking] = useState(false);

  // ── Win detection ───────────────────────────────────────────────────────────

  useEffect(() => {
    // Only check once we have all 12 cards matched
    if (cards.length > 0 && matchedIds.length === cards.length) {
      // Small delay so the last card visually flips before the alert
      setTimeout(() => {
        alert('Correct!');
        recordWin(moves);
        // After alert is dismissed, reset to a new shuffled game
        resetGame();
      }, 150);
    }
  }, [matchedIds]); // runs every time matchedIds changes

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Resets everything to a fresh game with a newly shuffled deck.
   */
  function resetGame() {
    setCards(buildShuffledDeck());
    setFlippedIds([]);
    setMatchedIds([]);
    setMoves(0);
    setIsChecking(false);
    setIsPeeking(false);
  }

  /**
   * Called when a card is clicked.
   * Guards against: already flipped, already matched, during check, during peek,
   * and already having 2 unmatched cards face-up.
   */
  function handleCardClick(id) {
    // Block clicks during mismatch delay or peek period
    if (isChecking || isPeeking) return;

    // Block if this card is already matched/locked
    if (matchedIds.includes(id)) return;

    // Block if this card is already one of the flipped cards (same card clicked twice)
    if (flippedIds.includes(id)) return;

    // Block if there are already 2 unmatched cards face-up
    if (flippedIds.length === 2) return;

    // Add this card to the flipped list
    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    // If this is the second card flipped, check for a match
    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1); // count this flip pair as one move

      const [firstId, secondId] = newFlipped;
      // Find the image index for each card to compare
      const firstCard  = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      if (firstCard.imageIndex === secondCard.imageIndex) {
        // ── Match: lock both cards face-up immediately ──────────────────────
        setMatchedIds((prev) => [...prev, firstId, secondId]);
        setFlippedIds([]); // clear flipped — matched cards stay up via matchedIds
      } else {
        // ── Mismatch: show both cards briefly, then flip back down ──────────
        setIsChecking(true); // prevent more clicks during the delay
        setTimeout(() => {
          setFlippedIds([]);    // flip both back down
          setIsChecking(false); // allow clicks again
        }, 1000); // 1 second delay so the player can see both cards
      }
    }
  }

  /**
   * Peek: show all cards for exactly 1 second, then hide unmatched ones.
   * Matched cards stay face-up after peek ends.
   */
  function handlePeek() {
    // Don't allow peek during a mismatch check or if already peeking
    if (isChecking || isPeeking) return;

    setIsPeeking(true);

    // Show ALL card IDs as "flipped" for the duration of the peek
    const allIds = cards.map((c) => c.id);
    setFlippedIds(allIds);

    setTimeout(() => {
      setFlippedIds([]);   // hide all non-matched cards again
      setIsPeeking(false); // re-enable normal card interaction
    }, 1000);
  }

  // ── Derived values ─────────────────────────────────────────────────────────

  // How many pairs have been matched (each match = 2 card ids)
  const matchedPairs = matchedIds.length / 2;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    // Outer page wrapper — centres everything vertically and horizontally
    <div className="mcg-page">

      {/* ── Title ── */}
      <h1 className="mcg-title">Memory Card Game</h1>

      {/* ── Counters row ── */}
      <div className="mcg-counters">
        {/* Move counter — increments once per pair of flips */}
        <span className="mcg-counter">Moves: <strong>{moves}</strong></span>
        {/* Matched pairs counter — increments when two cards lock */}
        <span className="mcg-counter">Matched: <strong>{matchedPairs} / 6</strong></span>
      </div>

      {/* ── 4×3 card grid ── */}
      {/* Spec: 4 columns, each card 110×110px, 1px solid #333333 border, 0px margin */}
      <div className="mcg-grid">
        {cards.map((card) => {
          // A card is "face up" if it's in the flipped list OR the matched list
          const isFaceUp = flippedIds.includes(card.id) || matchedIds.includes(card.id);

          return (
            <div
              key={card.id}
              className="mcg-card"
              onClick={() => handleCardClick(card.id)}
              role="button"
              aria-label={isFaceUp ? `Card showing match-${card.imageIndex + 1}` : 'Face-down card'}
            >
              {/* Show the matching image when face-up, card-back when face-down */}
              {isFaceUp ? (
                <img src={card.src} alt={`match-${card.imageIndex + 1}`} className="mcg-card-img" />
              ) : (
                <img src={CARD_BACK} alt="card back" className="mcg-card-img" />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Controls row: Peek on left, Reset on right ── */}
      {/* Spec: Peek on left half, Reset on right half of screen below the grid */}
      <div className="mcg-controls">
        <button
          id="peek-button"
          className="mcg-btn mcg-btn--peek"
          onClick={handlePeek}
          disabled={isChecking || isPeeking}
        >
          Peek
        </button>

        <button
          id="reset-button"
          className="mcg-btn mcg-btn--reset"
          onClick={resetGame}
        >
          Reset
        </button>
      </div>

    </div>
  );
}
