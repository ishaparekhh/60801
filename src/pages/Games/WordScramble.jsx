import { useState, useEffect } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

const GAME_ID  = 'word-scramble';
const WIN_SCORE = 5;
const MAX_ATTEMPTS = 3;

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Fisher-Yates shuffle on a string's characters.
 * Retries up to 10 times to ensure the scramble differs from the original.
 */
function scramble(word) {
  const chars = word.split('');
  let result = word;
  let tries = 0;
  while (result === word && tries < 10) {
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    result = chars.join('');
    tries++;
  }
  return result;
}

function recordResult(score, outcome) {
  const current = getStoredStats();
  const prev = current[GAME_ID] || { plays: 0, wins: 0, losses: 0, draws: 0, bestScore: null, bestTimeSeconds: null };
  saveStoredStats({
    ...current,
    [GAME_ID]: {
      ...prev,
      plays: prev.plays + 1,
      wins: prev.wins + (outcome === 'win' ? 1 : 0),
      losses: prev.losses + (outcome === 'loss' ? 1 : 0),
      bestScore: prev.bestScore === null ? score : Math.max(prev.bestScore, score),
    },
  });
}

export default function WordScramble() {
  const [words, setWords] = useState([]);
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Unscramble the word!');

  // Load words on mount
  useEffect(() => {
    fetch('/data/word-scramble-words.json')
      .then((r) => r.json())
      .then((data) => {
        setWords(data);
        const word = pickRandom(data);
        setCurrentWord(word);
        setScrambledWord(scramble(word));
      });
  }, []);

  function loadNewWord(wordList) {
    const word = pickRandom(wordList || words);
    setCurrentWord(word);
    setScrambledWord(scramble(word));
    setAnswer('');
  }

  function handleSubmit() {
    if (gameOver) return;
    const trimmed = answer.trim().toLowerCase();
    if (!trimmed) return;

    if (trimmed === currentWord.toLowerCase()) {
      // Correct
      const newScore = score + 1;
      setScore(newScore);
      setAnswer('');

      if (newScore >= WIN_SCORE) {
        setGameOver(true);
        setMessage(`Correct! You solved ${WIN_SCORE} words. You win!`);
        recordResult(newScore, 'win');
        alert(`🎉 You win! You solved ${WIN_SCORE} words!`);
        return;
      }
      setMessage('Correct! Next word...');
      loadNewWord();
    } else {
      // Wrong
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      setAnswer('');

      if (newAttempts <= 0) {
        setGameOver(true);
        setMessage(`Game over! The word was "${currentWord}".`);
        recordResult(score, 'loss');
        alert(`😢 You lose! The word was "${currentWord}".`);
      } else {
        setMessage(`Wrong! ${newAttempts} attempt${newAttempts !== 1 ? 's' : ''} left.`);
      }
    }
  }

  function handleSkip() {
    if (gameOver) return;
    setMessage('Skipped!');
    loadNewWord();
  }

  function handleReset() {
    const word = pickRandom(words);
    setCurrentWord(word);
    setScrambledWord(scramble(word));
    setAnswer('');
    setScore(0);
    setAttemptsLeft(MAX_ATTEMPTS);
    setGameOver(false);
    setMessage('Unscramble the word!');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSubmit();
  }

  return (
    <div className="ws-page">
      <h1 className="ws-title">Word Scramble</h1>

      {/* Scrambled word display */}
      <div className="ws-scrambled">{scrambledWord}</div>

      {/* Stats */}
      <div className="ws-stats">
        <span className="ws-stat ws-stat--score">Score: <strong>{score}</strong> / {WIN_SCORE}</span>
        <span className="ws-stat ws-stat--lives">Lives: <strong>{attemptsLeft}</strong></span>
      </div>

      {/* Status */}
      <div
        className={[
          'ws-status',
          gameOver && score >= WIN_SCORE ? 'ws-status--win'  : '',
          gameOver && score < WIN_SCORE  ? 'ws-status--loss' : '',
        ].join(' ')}
        aria-live="polite"
      >
        {message}
      </div>

      {/* Input */}
      <input
        id="answer-input"
        className="ws-input"
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={gameOver}
        placeholder="Type your answer..."
        autoComplete="off"
      />

      {/* Buttons */}
      <div className="ws-controls">
        <button id="submit-button" className="ws-btn ws-btn--submit" onClick={handleSubmit} disabled={gameOver}>Submit</button>
        <button id="skip-button"   className="ws-btn ws-btn--skip"   onClick={handleSkip}   disabled={gameOver}>Skip</button>
        <button id="reset-button"  className="ws-btn ws-btn--reset"  onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
