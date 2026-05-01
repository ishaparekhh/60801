# Assets Manifest

All provided assets are simple placeholder SVG or JSON files placed under `public/`, so they can be used in React with paths like `/assets/memory-card-game/match-1.svg`.

## Game assets

| Game | Required assets provided |
|---|---|
| Tower of Hanoi | `/assets/tower-of-hanoi/tower.svg`, `/assets/tower-of-hanoi/disk-1.svg` to `/disk-5.svg` |
| Guess the Number | `/assets/shared/timer.svg`, `/assets/shared/question-mark.svg` |
| Seal the Box | `/assets/seal-the-box/dice-1.svg` to `/dice-6.svg` |
| Tic Tac Toe | `/assets/tic-tac-toe/x.svg`, `/assets/tic-tac-toe/o.svg` |
| Memory Card Game | `/assets/memory-card-game/card-back.svg`, `/assets/memory-card-game/match-1.svg` to `/match-6.svg` |
| Rock Paper Scissors | `/assets/rock-paper-scissors/rock.svg`, `/paper.svg`, `/scissors.svg` |
| Hangman | `/assets/hangman/hangman-0.svg` to `/hangman-6.svg`, `/data/hangman-words.json` |
| Whack-a-Mole | `/assets/whack-a-mole/mole.svg`, `/assets/whack-a-mole/hole.svg` |
| Simon Says | `/assets/simon-says/red.svg`, `/blue.svg`, `/green.svg`, `/yellow.svg` |
| Minesweeper Mini | `/assets/minesweeper-mini/mine.svg`, `/assets/minesweeper-mini/flag.svg` |
| Word Scramble | `/data/word-scramble-words.json` |
| Reaction Timer | `/assets/reaction-timer/ready.svg`, `/go.svg`, `/too-soon.svg` |
| Connect Four | `/assets/connect-four/red-token.svg`, `/assets/connect-four/yellow-token.svg` |
| Typing Speed Test | `/data/typing-sentences.json` |
| Snake Game | `/assets/snake-game/snake-head.svg`, `/snake-body.svg`, `/food.svg` |
| Shared leaderboard/status | `/assets/shared/trophy.svg`, `/timer.svg`, `/reset.svg`, `/win.svg`, `/loss.svg` |

## Notes

These files are intentionally simple so they are safe to edit, recolour, or replace. In an exam-style implementation, you can also draw many of these elements using CSS instead of images, but the assets are provided so the game specs can refer to concrete files.
