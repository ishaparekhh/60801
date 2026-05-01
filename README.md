# Exam Practice Games Repo

This repo is a React/Vite starter package for creating frontend practice-exam games. It contains a leaderboard page, sample localStorage utilities, detailed game specification files, and all placeholder assets needed for the listed games.

The repo intentionally does **not** include a required header or footer because you said you will implement that yourself. Each game page can therefore focus on the actual game body, route, state, logic, and leaderboard integration.

---

## Game list

| # | Game | Route | One-sentence description | Detailed spec |
|---|------|-------|--------------------------|---------------|
| 1 | Tower of Hanoi | `/tower-of-hanoi` | Move disks between three towers while following the rule that only one disk can move at a time and a larger disk cannot go on a smaller disk. | `docs/game-specs/tower-of-hanoi.md` |
| 2 | Guess the Number | `/guess-the-number` | Guess a randomly generated number before the timer ends, using too high or too low hints after each incorrect guess. | `docs/game-specs/guess-the-number.md` |
| 3 | Seal the Box | `/seal-the-box` | Roll dice and close numbered tiles whose values add to the dice total, trying to close as many tiles as possible before no valid moves remain. | `docs/game-specs/seal-the-box.md` |
| 4 | Tic Tac Toe | `/tic-tac-toe` | Two players take turns placing Xs and Os on a 3 by 3 grid, trying to get three in a row horizontally, vertically, or diagonally. | `docs/game-specs/tic-tac-toe.md` |
| 5 | Memory Card Game | `/memory-card-game` | Flip two face-down cards at a time and try to find all matching pairs using memory and limited attempts. | `docs/game-specs/memory-card-game.md` |
| 6 | Rock Paper Scissors | `/rock-paper-scissors` | Choose rock, paper, or scissors while the computer randomly chooses one, then compare choices to decide the winner. | `docs/game-specs/rock-paper-scissors.md` |
| 7 | Hangman | `/hangman` | Guess letters to reveal a hidden word before using up all allowed incorrect guesses. | `docs/game-specs/hangman.md` |
| 8 | Whack-a-Mole | `/whack-a-mole` | Click the mole when it appears in random grid cells to score as many points as possible before time runs out. | `docs/game-specs/whack-a-mole.md` |
| 9 | Simon Says | `/simon-says` | Watch a sequence of colours or buttons, then repeat the sequence in the correct order as it becomes longer each round. | `docs/game-specs/simon-says.md` |
| 10 | Minesweeper Mini | `/minesweeper-mini` | Reveal safe grid squares while avoiding hidden mines, using nearby mine counts to guide each move. | `docs/game-specs/minesweeper-mini.md` |
| 11 | Word Scramble | `/word-scramble` | Unscramble a shuffled word and type the correct original word before attempts or time run out. | `docs/game-specs/word-scramble.md` |
| 12 | Reaction Timer | `/reaction-timer` | Wait for a signal and click as quickly as possible, with the game measuring the reaction time. | `docs/game-specs/reaction-timer.md` |
| 13 | Connect Four | `/connect-four` | Drop pieces into columns and try to get four in a row horizontally, vertically, or diagonally before the other player does. | `docs/game-specs/connect-four.md` |
| 14 | Typing Speed Test | `/typing-speed-test` | Type a displayed sentence as quickly and accurately as possible while the game calculates speed and mistakes. | `docs/game-specs/typing-speed-test.md` |
| 15 | Snake Game | `/snake-game` | Control a snake around a grid, eat food to grow longer, and avoid hitting the walls or the snake body. | `docs/game-specs/snake-game.md` |

---

## What was added

This package includes:

- A detailed top-level `README.md`.
- A detailed markdown spec for every game in `docs/game-specs/`.
- A detailed `docs/leaderboard-spec.md`.
- An asset manifest in `docs/assets-manifest.md`.
- Placeholder SVG assets in `public/assets/`.
- Word/sentence data files in `public/data/`.
- A starter React/Vite app.
- A working starter leaderboard page at `/leaderboard`.
- A `localStorage` helper in `src/utils/gameStats.js`.

---

## Suggested repo structure

```txt
public/
  assets/
    connect-four/
    hangman/
    memory-card-game/
    minesweeper-mini/
    reaction-timer/
    rock-paper-scissors/
    seal-the-box/
    shared/
    simon-says/
    snake-game/
    tic-tac-toe/
    tower-of-hanoi/
    whack-a-mole/
  data/
    hangman-words.json
    typing-sentences.json
    word-scramble-words.json

src/
  App.jsx
  main.jsx
  styles.css
  data/
    gameCatalog.js
    sampleGameStats.js
  pages/
    HomePage.jsx
    GamePlaceholder.jsx
    LeaderboardPage.jsx
  utils/
    gameStats.js

docs/
  assets-manifest.md
  leaderboard-spec.md
  game-specs/
    tower-of-hanoi.md
    guess-the-number.md
    seal-the-box.md
    tic-tac-toe.md
    memory-card-game.md
    rock-paper-scissors.md
    hangman.md
    whack-a-mole.md
    simon-says.md
    minesweeper-mini.md
    word-scramble.md
    reaction-timer.md
    connect-four.md
    typing-speed-test.md
    snake-game.md
```

---

## Running the starter repo

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

---

## How to implement a game page

The starter app currently maps game routes to a placeholder component. To implement a real game:

1. Create a new file in `src/pages/`, for example `GuessTheNumberPage.jsx`.
2. Follow the matching spec in `docs/game-specs/`.
3. Import the page into `src/App.jsx`.
4. Replace the placeholder route with the real component.
5. Call `recordGameResult` once when the game ends.

Example leaderboard call:

```js
import { recordGameResult } from '../utils/gameStats';

recordGameResult('guess-the-number', {
  outcome: 'win',
  score: 1,
  timeSeconds: 12,
});
```

For a loss:

```js
recordGameResult('guess-the-number', {
  outcome: 'loss',
  score: 0,
  timeSeconds: 45,
});
```

For a draw:

```js
recordGameResult('tic-tac-toe', {
  outcome: 'draw',
});
```

---

## Leaderboard page

The included leaderboard page exists at:

```txt
/leaderboard
```

The leaderboard shows:

- Total plays.
- Total wins.
- Total losses.
- Total draws.
- Overall win rate.
- Per-game plays.
- Per-game win rate.
- Best score.
- Fastest time.
- Main game-specific metric.

The current version uses `localStorage`, so results remain saved in the browser after refreshing the page.

For more detail, read:

```txt
docs/leaderboard-spec.md
```

---

## Asset paths

All image assets are stored under `public/assets/`, so React can reference them directly using root-relative paths.

Example:

```jsx
<img src="/assets/memory-card-game/match-1.svg" alt="Match card 1" />
```

Data files are stored under `public/data/` and can be fetched like this:

```js
const response = await fetch('/data/hangman-words.json');
const words = await response.json();
```

For the full asset list, read:

```txt
docs/assets-manifest.md
```

---

## Implementation tips for exams

- Build the core game logic first, then add styling.
- Keep the state small and easy to inspect.
- Use arrays for grids, boards, cards, and snake body segments.
- Add reset buttons early so testing is easier.
- Use helper functions for win checking.
- Use `useEffect` cleanup functions for timers and intervals.
- Record leaderboard results only once per completed game.
- Avoid overcomplicated visuals unless the spec gives marks for them.
- Test edge cases such as repeated clicks, full boards, no valid moves, timer expiry, and reset during gameplay.

---

## Recommended implementation order

A good order for practice is:

1. Rock Paper Scissors
2. Guess the Number
3. Tic Tac Toe
4. Word Scramble
5. Memory Card Game
6. Hangman
7. Seal the Box
8. Reaction Timer
9. Whack-a-Mole
10. Simon Says
11. Tower of Hanoi
12. Connect Four
13. Typing Speed Test
14. Minesweeper Mini
15. Snake Game

This order moves from simpler state logic to harder grid/timer logic.
