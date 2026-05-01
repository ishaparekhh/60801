/* Game starts - All disks are stacked on the left tower (remember difficulty sets the number of disks)
  - User selects a tower to move a disk from
  - User selects a tower to move the disk to
  - Check if the move is valid (cannot place a larger disk on a smaller disk)
  - If the move is valid, move the disk to the new tower
  - Increment the move counter
  - Check if the game is won (all disks moved to the right tower)
  - If the game is won, display a success message and record the win (pop/push, moves ++ check win condition)
  - If the game is not won, display a success message and wait for the next move (checkWin returns false, loops back to user selecting next move)

  State Management: useState, useCallback (what is useCallback doing here?)
  useCallback is used to memoize the checkWin function. This means that the checkWin function will only be recreated if its dependencies change. 
  What does use state do? -> sets up a state variable and a function to update it (useState(initialValue), returns [stateVariable, setStateVariable])
*/

import { useState, useCallback } from 'react';
import { getStoredStats, saveStoredStats } from '../../utils/gameStats';

const GAME_ID = 'tower-of-hanoi';

const DIFFICULTY_DISK_COUNT = {
  easy: 3,
  medium: 4,
  hard: 5,
};

/** Returns the initial towers state: all disks stacked on the left. */
function buildInitialTowers(diskCount) {
  const disks = []; // is disks an empty array? or does it contain numbers? Disks is an empty array.
  // for loop counts down, it fills it up with numbers. (3 is the largest disk, 1 is the smallest disk)
  for (let i = diskCount; i >= 1; i--) {
    disks.push(i);
  }
  return [disks, [], []]; // returns an array of arrays representing the 3 towers - Left (disks r here), Middle, Right
}

/** Records a win in localStorage, keeping the fewest-moves bestScore. */
function recordWin(moves) {

  // getStoredStats() retrieves the current stats from localStorage. 
  // It returns an object with the current stats. 
  // If no stats are found, it returns an empty object.
  const current = getStoredStats();
  // The || operator returns the right-hand side operand when the left-hand side operand is falsy (e.g., undefined, null, 0, "").
  // In this case, it returns an empty object with the default stats. No wins etc.
  const prev = current[GAME_ID] || {
    plays: 0,
    wins: 0,
    losses: 0,
    draws: 0,
    bestScore: null,
    bestTimeSeconds: null,
  };

  // if best score is null then it means the game is never played -> Use the current moves
  // Otherwise -> Use the minimum of the current moves and the previous best score
  const newBestScore =
    prev.bestScore === null ? moves : Math.min(prev.bestScore, moves);

  // Create an updated stats object with the new best score
  const updated = {
    ...current,
    [GAME_ID]: {
      ...prev,
      plays: prev.plays + 1,
      wins: prev.wins + 1,
      bestScore: newBestScore,
    },
  };
  // saveStoredStats() saves the updated stats to localStorage.
  // It updates the stats for the specific game ID (tower-of-hanoi in this case).
  // It does not modify any other game stats in localStorage.
  saveStoredStats(updated);
}

const TOWER_LABELS = ['Left', 'Middle', 'Right'];

// Disk width percentages mapped to disk number (1 = smallest)
const DISK_WIDTH_PERCENT = {
  1: 28,
  2: 40,
  3: 54,
  4: 68,
  5: 84,
};

// Disk colours for visual distinction
const DISK_COLORS = {
  1: '#a855f7',
  2: '#6366f1',
  3: '#3b82f6',
  4: '#10b981',
  5: '#f59e0b',
};

export default function TowerofHanoi() {
  const [difficulty, setDifficulty] = useState('easy');
  const [towers, setTowers] = useState(() => buildInitialTowers(3));
  const [selectedTower, setSelectedTower] = useState(null);
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('Select a tower to begin.');
  const [gameOver, setGameOver] = useState(false);

  const diskCount = DIFFICULTY_DISK_COUNT[difficulty];

  // ── helpers ──────────────────────────────────────────────────────────────

  function resetGame(newDifficulty = difficulty) {
    const count = DIFFICULTY_DISK_COUNT[newDifficulty];
    setTowers(buildInitialTowers(count));
    setSelectedTower(null);
    setMoves(0);
    setStatus('Select a tower to begin.');
    setGameOver(false);
  }

  const checkWin = useCallback(
    (nextTowers, diskCount) => {
      const right = nextTowers[2];
      if (right.length !== diskCount) return false;
      // Disks should be in descending order from bottom to top: [diskCount, ..., 1]
      for (let i = 0; i < right.length; i++) {
        if (right[i] !== diskCount - i) return false;
      }
      return true;
    },
    []
  );

  // ── tower click handler ───────────────────────────────────────────────────

  function handleTowerClick(towerIndex) {
    if (gameOver) return;

    // No tower selected yet — picking source
    if (selectedTower === null) {
      if (towers[towerIndex].length === 0) {
        setStatus('That tower is empty. Choose a tower with disks.'); // What does set status do? -> updates the status message displayed to the user in purple box
        return;
      }
      setSelectedTower(towerIndex);
      setStatus(`Tower ${TOWER_LABELS[towerIndex]} selected. Now pick a destination.`); // When tower is selected, update the status message
      return;
    }

    // Clicking the same tower again → cancel selection
    if (selectedTower === towerIndex) {
      setSelectedTower(null);
      setStatus('Selection cancelled. Select a tower to begin.');
      return;
    }

    // Attempt move: selectedTower → towerIndex
    const src = selectedTower;
    const dst = towerIndex;
    const srcTower = towers[src];
    const dstTower = towers[dst];

    // What are we doing here? -> Checking if the move is valid
    // Get the last element from the source tower
    const movingDisk = srcTower[srcTower.length - 1];
    // Get the last element from the destination tower
    const dstTop = dstTower[dstTower.length - 1];

    // Validate
    if (dstTower.length > 0 && dstTop < movingDisk) {
      setStatus('Invalid move — you cannot place a larger disk on a smaller one.');
      setSelectedTower(null);
      return;
    }

    // Valid move
    const nextTowers = towers.map((t) => [...t]);
    nextTowers[src].pop();
    nextTowers[dst].push(movingDisk);

    const nextMoves = moves + 1;
    setTowers(nextTowers);
    setMoves(nextMoves);
    setSelectedTower(null);

    if (checkWin(nextTowers, diskCount)) {
      setGameOver(true);
      setStatus(`🎉 You won in ${nextMoves} moves!`);
      recordWin(nextMoves);
      alert('Correct!');
    } else {
      setStatus('Good move! Select the next tower.');
    }
  }

  // ── difficulty change ─────────────────────────────────────────────────────

  function handleDifficultyChange(e) {
    const newDiff = e.target.value;
    setDifficulty(newDiff);
    resetGame(newDiff);
  }

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="toh-page">
      <h1 className="toh-title">Tower of Hanoi</h1>
      <p className="toh-instructions">
        Move all disks from the <strong>left</strong> tower to the{' '}
        <strong>right</strong> tower. You may only move one disk at a time, and
        a larger disk may never be placed on top of a smaller disk.
      </p>

      {/* Controls */}
      <div className="toh-controls">
        <label className="toh-label">
          Difficulty:&nbsp;
          <select
            value={difficulty}
            onChange={handleDifficultyChange}
            className="toh-select"
            id="difficulty-select"
          >
            <option value="easy">Easy (3 disks)</option>
            <option value="medium">Medium (4 disks)</option>
            <option value="hard">Hard (5 disks)</option>
          </select>
        </label>

        <button
          onClick={() => resetGame()}
          className="toh-reset-btn"
          id="reset-button"
        >
          Reset
        </button>

        <div className="toh-move-counter">
          Moves: <strong>{moves}</strong>
        </div>
      </div>

      {/* Status message — extra classes added for error/win states */}
      <div
        className={[
          'toh-status',
          status.includes('Invalid') ? 'toh-status--error' : '',
          gameOver ? 'toh-status--win' : '',
        ].join(' ')}
        aria-live="polite"
      >
        {status}
      </div>

      {/* Tower area */}
      <div className="toh-towers-row">
        {towers.map((tower, towerIndex) => (
          <button
            key={towerIndex}
            onClick={() => handleTowerClick(towerIndex)}
            className={`toh-tower-area${selectedTower === towerIndex ? ' toh-tower-area--selected' : ''}`}
            aria-label={`${TOWER_LABELS[towerIndex]} tower, ${tower.length} disk${tower.length !== 1 ? 's' : ''}`}
            id={`tower-${towerIndex}`}
          >
            {/* Tower label */}
            <span className="toh-tower-label">{TOWER_LABELS[towerIndex]}</span>

            {/* Disk stack + pole */}
            <div className="toh-tower-inner">
              {/* Vertical pole */}
              <div className="toh-pole" />

              {/* Disks rendered from top (smallest) to bottom (largest) visually */}
              <div className="toh-disk-stack">
                {[...tower].reverse().map((disk) => (
                  <div
                    key={`${towerIndex}-${disk}`}
                    className="toh-disk"
                    style={{
                      // These 3 are dynamic (depend on which disk number) so inline style is appropriate
                      width: `${DISK_WIDTH_PERCENT[disk]}%`,
                      backgroundColor: DISK_COLORS[disk],
                      boxShadow: `0 2px 8px ${DISK_COLORS[disk]}88`,
                    }}
                    aria-label={`Disk ${disk}`}
                  >
                    <span className="toh-disk-label">{disk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Base */}
            <div className="toh-base" />
          </button>
        ))}
      </div>
    </div>
  );
}

