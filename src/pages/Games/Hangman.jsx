import { useState, useEffect } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

// ─── Constants ────────────────────────────────────────────────────────────────

const GAME_ID = 'hangman';

// Maximum wrong guesses before the player loses (hangman-6.svg = fully drawn)
const MAX_WRONG = 6;

// ─── Helper functions ─────────────────────────────────────────────────────────

/**
 * Picks a random word from an array and returns it in lowercase.
 */
function pickRandom(words) {
  return words[Math.floor(Math.random() * words.length)].toLowerCase();
}

/**
 * Records a win. Score = 6 - wrongGuesses (fewer wrong = better).
 * Uses Math.max because a higher score is better here.
 */
function recordWin(wrongGuesses) {
  const score = MAX_WRONG - wrongGuesses;
  const current = getStoredStats();
  const prev = current[GAME_ID] || {
    plays: 0, wins: 0, losses: 0, draws: 0,
    bestScore: null, bestTimeSeconds: null,
  };
  const newBest = prev.bestScore === null ? score : Math.max(prev.bestScore, score);
  saveStoredStats({
    ...current,
    [GAME_ID]: { ...prev, plays: prev.plays + 1, wins: prev.wins + 1, bestScore: newBest },
  });
}

/**
 * Records a loss.
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

export default function Hangman() {

  // ── State ──────────────────────────────────────────────────────────────────

  // Full list of words fetched from the JSON file
  const [wordList, setWordList] = useState([]);

  // The secret word the player is trying to guess (lowercase)
  const [word, setWord] = useState('');

  // All letters the player has guessed so far (correct and wrong)
  const [guessedLetters, setGuessedLetters] = useState([]);

  // How many incorrect guesses have been made (0–6)
  const [wrongGuesses, setWrongGuesses] = useState(0);

  // Hint / result message shown to the player
  const [message, setMessage] = useState('Guess a letter.');

  // True once the game ends (win or loss) — disables the input
  const [gameOver, setGameOver] = useState(false);

  // The letter currently typed in the input box
  const [letterInput, setLetterInput] = useState('');

  // ── Fetch word list on mount ────────────────────────────────────────────────

  useEffect(() => {
    // Fetch the provided JSON file from the public folder
    fetch('/data/hangman-words.json')
      .then((res) => res.json())
      .then((data) => {
        setWordList(data);
        // Pick the first word once the list arrives
        setWord(pickRandom(data));
      });
  }, []); // empty array = runs once when the component first mounts

  // ── Derived values ─────────────────────────────────────────────────────────

  // Which hangman image to show — corresponds directly to wrongGuesses count
  const hangmanImage = `/assets/hangman/hangman-${wrongGuesses}.svg`;

  // The unique letters in the word that the player still needs to find
  const uniqueLetters = [...new Set(word.split(''))];

  // True when every unique letter has been guessed
  const isWon = uniqueLetters.length > 0 &&
    uniqueLetters.every((l) => guessedLetters.includes(l));

  // ── Handlers ───────────────────────────────────────────────────────────────

  /**
   * Called when the player types a letter and clicks Guess (or presses Enter).
   * Validates the input is a single a-z letter, then calls handleGuess.
   */
  function handleSubmit() {
    // Normalise to lowercase and strip whitespace
    const letter = letterInput.trim().toLowerCase();

    // Must be exactly one alphabetic character
    if (!/^[a-z]$/.test(letter)) {
      setMessage('Please type a single letter (a–z).');
      setLetterInput('');
      return;
    }

    // Already guessed — tell the player and clear the input
    if (guessedLetters.includes(letter)) {
      setMessage(`You already guessed "${letter.toUpperCase()}".`);
      setLetterInput('');
      return;
    }

    handleGuess(letter); // hand off to the main guess logic
    setLetterInput('');  // clear the input box after each guess
  }

  /**
   * Lets the player press Enter instead of clicking the Guess button.
   */
  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  /**
   * Core guess logic — shared by both the input submit and any direct calls.
   * Validates the guess then updates state accordingly.
   */
  function handleGuess(letter) {
    // Block if game is over
    if (gameOver) return;

    // Add the letter to the guessed list
    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (word.includes(letter)) {
      // ── Correct guess ──────────────────────────────────────────────────────
      // Check if the player has now revealed every unique letter
      const allFound = uniqueLetters.every((l) => newGuessed.includes(l));
      if (allFound) {
        setMessage('Correct!');
        setGameOver(true);
        recordWin(wrongGuesses);
        alert('🎉 You win! You guessed the word!');
      } else {
        setMessage('Good guess! Keep going.');
      }
    } else {
      // ── Wrong guess ────────────────────────────────────────────────────────
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);

      if (newWrong >= MAX_WRONG) {
        // Player has used all 6 chances — game over (loss)
        setMessage(`Game over! The word was ${word.toUpperCase()}.`);
        setGameOver(true);
        recordLoss();
        alert(`😢 You lose! The word was "${word.toUpperCase()}".`);
      } else {
        setMessage(`Wrong! ${MAX_WRONG - newWrong} guess${MAX_WRONG - newWrong === 1 ? '' : 'es'} remaining.`);
      }
    }
  }

  /**
   * Resets all state and picks a brand new word from the loaded list.
   */
  function handleReset() {
    setWord(pickRandom(wordList));
    setGuessedLetters([]);
    setWrongGuesses(0);
    setMessage('Guess a letter.');
    setGameOver(false);
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    // Outer page wrapper
    <div className="hm-page">

      {/* ── Title ── */}
      <h1 className="hm-title">Hangman</h1>

      {/* ── Hangman SVG image ── */}
      {/* The image src changes with each wrong guess (hangman-0 to hangman-6) */}
      <img
        src={hangmanImage}
        alt={`Hangman drawing with ${wrongGuesses} wrong guess${wrongGuesses !== 1 ? 'es' : ''}`}
        className="hm-image"
      />

      {/* ── Wrong guesses counter ── */}
      <p className="hm-wrong-count">
        Wrong guesses: <strong>{wrongGuesses} / {MAX_WRONG}</strong>
      </p>

      {/* ── Hidden word display ── */}
      {/* Each character in the word is shown as either the letter or an underscore */}
      <div className="hm-word-display">
        {word.split('').map((char, index) => (
          <span key={index} className="hm-letter-slot">
            {/* Show the letter if it has been guessed, otherwise show _ */}
            {guessedLetters.includes(char) ? char : '_'}
          </span>
        ))}
      </div>

      {/* ── Status message ── */}
      {/* Changes colour based on win/loss keywords in the message string */}
      <div
        className={[
          'hm-status',
          message === 'Correct!' ? 'hm-status--win' : '',
          message.startsWith('Game over') ? 'hm-status--loss' : '',
        ].join(' ')}
        aria-live="polite"
      >
        {message}
      </div>

      {/* ── Used letters list ── */}
      {/* Shows every letter guessed so far, whether correct or not */}
      <div className="hm-used-letters">
        <span className="hm-used-label">Used:</span>
        {/* Sort alphabetically so they're easy to scan */}
        {[...guessedLetters].sort().map((l) => (
          <span
            key={l}
            className={`hm-used-badge ${word.includes(l) ? 'hm-used-badge--correct' : 'hm-used-badge--wrong'}`}
          >
            {l.toUpperCase()}
          </span>
        ))}
      </div>

      {/* ── Letter input row ── */}
      {/* Player types a letter and presses Guess or Enter to submit */}
      <div className="hm-input-row">
        <input
          id="letter-input"
          type="text"
          className="hm-input"
          placeholder="a–z"
          maxLength={1}           /* only allow 1 character */
          value={letterInput}
          onChange={(e) => setLetterInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={gameOver}
          aria-label="Type a letter to guess"
        />
        <button
          id="guess-button"
          className="hm-btn hm-btn--primary"
          onClick={handleSubmit}
          disabled={gameOver}
        >
          Guess
        </button>
      </div>

      {/* ── Reset button ── */}
      <button
        id="reset-button"
        className="hm-btn hm-btn--reset"
        onClick={handleReset}
      >
        Reset
      </button>

    </div>
  );
}
