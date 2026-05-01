import { useState, useEffect, useRef } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

const GAME_ID = 'typing-speed-test';

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function calcWpm(sentence, elapsedSeconds) {
  if (elapsedSeconds === 0) return 0;
  const words = sentence.trim().split(/\s+/).length;
  return Math.round(words / (elapsedSeconds / 60));
}

function calcAccuracy(typed, target) {
  if (typed.length === 0) return 0;
  const correct = typed.split('').filter((ch, i) => ch === target[i]).length;
  return Math.round((correct / typed.length) * 100);
}

function recordWin(wpm, elapsedSeconds) {
  const current = getStoredStats();
  const prev = current[GAME_ID] || { plays: 0, wins: 0, losses: 0, draws: 0, bestScore: null, bestTimeSeconds: null };
  saveStoredStats({
    ...current,
    [GAME_ID]: {
      ...prev,
      plays: prev.plays + 1,
      wins: prev.wins + 1,
      bestScore: prev.bestScore === null ? wpm : Math.max(prev.bestScore, wpm),
      bestTimeSeconds: prev.bestTimeSeconds === null ? elapsedSeconds : Math.min(prev.bestTimeSeconds, elapsedSeconds),
    },
  });
}

export default function TypingSpeedTest() {
  const [sentences, setSentences] = useState([]);
  const [targetSentence, setTargetSentence] = useState('Loading...');
  const [typedText, setTypedText] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState('Press Start to begin.');

  const recordedRef = useRef(false);
  const timerRef = useRef(null);
  const startedAtRef = useRef(null);

  useEffect(() => {
    fetch('/data/typing-sentences.json')
      .then((r) => r.json())
      .then((data) => { setSentences(data); setTargetSentence(pickRandom(data)); });
  }, []);

  useEffect(() => { return () => clearInterval(timerRef.current); }, []);

  function startTimer() {
    const now = performance.now();
    startedAtRef.current = now;
    setIsRunning(true);
    setMessage('Type the sentence above!');
    timerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((performance.now() - startedAtRef.current) / 1000));
    }, 500);
  }

  function handleStart() {
    if (isRunning || gameOver) return;
    startTimer();
  }

  function handleInput(e) {
    const value = e.target.value;
    if (!isRunning && !gameOver && value.length === 1) startTimer();
    if (gameOver) return;
    setTypedText(value);

    if (value === targetSentence && !recordedRef.current) {
      recordedRef.current = true;
      clearInterval(timerRef.current);
      setIsRunning(false);
      setGameOver(true);
      const elapsed = Math.max((performance.now() - startedAtRef.current) / 1000, 0.1);
      const finalWpm = calcWpm(targetSentence, elapsed);
      const finalAcc = calcAccuracy(value, targetSentence);
      setElapsedSeconds(Math.round(elapsed));
      setWpm(finalWpm);
      setAccuracy(finalAcc);
      setMessage(`Done! ${finalWpm} WPM — ${finalAcc}% accuracy`);
      recordWin(finalWpm, Math.round(elapsed));
      alert(`🎉 Done! ${finalWpm} WPM with ${finalAcc}% accuracy.`);
    }
  }

  function handleReset() {
    clearInterval(timerRef.current);
    recordedRef.current = false;
    const next = sentences.length > 0 ? pickRandom(sentences) : targetSentence;
    setTargetSentence(next);
    setTypedText('');
    startedAtRef.current = null;
    setElapsedSeconds(0);
    setWpm(null);
    setAccuracy(null);
    setGameOver(false);
    setIsRunning(false);
    setMessage('Press Start to begin.');
  }

  function renderHighlighted() {
    return targetSentence.split('').map((char, i) => {
      let cls = 'tst-char';
      if (i < typedText.length) {
        cls += typedText[i] === char ? ' tst-char--correct' : ' tst-char--wrong';
      }
      return <span key={i} className={cls}>{char}</span>;
    });
  }

  const liveAcc = typedText.length > 0 ? calcAccuracy(typedText, targetSentence) : null;

  return (
    <div className="tst-page">
      <h1 className="tst-title">Typing Speed Test</h1>
      <div className="tst-sentence">{renderHighlighted()}</div>
      <div className="tst-stats">
        <span className="tst-stat">⏱ <strong>{elapsedSeconds}s</strong></span>
        <span className="tst-stat">WPM: <strong>{wpm !== null ? wpm : '—'}</strong></span>
        <span className="tst-stat">Accuracy: <strong>{liveAcc !== null ? `${liveAcc}%` : '—'}</strong></span>
      </div>
      <div className={['tst-status', gameOver ? 'tst-status--done' : ''].join(' ')} aria-live="polite">
        {message}
      </div>
      <textarea
        id="typing-input"
        className={['tst-input', gameOver ? 'tst-input--done' : ''].join(' ')}
        value={typedText}
        onChange={handleInput}
        disabled={gameOver}
        placeholder="Start typing here..."
        rows={3}
        spellCheck={false}
        autoComplete="off"
      />
      <div className="tst-controls">
        <button id="start-button" className="tst-btn tst-btn--start" onClick={handleStart} disabled={isRunning || gameOver}>Start</button>
        <button id="reset-button" className="tst-btn tst-btn--reset" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
}
