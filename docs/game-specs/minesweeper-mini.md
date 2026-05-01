# 1.4.10 Game 10 - Minesweeper Mini - 32 marks

This game is based on revealing safe grid squares while avoiding hidden mines.

## Route and page purpose

This page exists on route `/minesweeper-mini`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Minesweeper Mini`. (0.5)

## Required assets

The following assets are provided:

- `/assets/minesweeper-mini/mine.svg`
- `/assets/minesweeper-mini/flag.svg`

## Layout requirements

The page shall contain a square grid. (1)

The grid size shall depend on difficulty:

| Difficulty | Grid size | Mines |
|---|---:|---:|
| Easy | 4 x 4 | 3 |
| Medium | 5 x 5 | 5 |
| Hard | 6 x 6 | 8 |

The page shall contain:

- A difficulty selector. (1)
- A mine counter. (1)
- A revealed-cell counter. (1)
- A reset button with the text `Reset:`. (0.5)
- A status message. (1)

Each cell shall:

- Be clickable. (1)
- Show nothing while hidden. (0.5)
- Show a number when revealed and adjacent to mines. (2)
- Show a mine image if the player loses. (1)
- Optionally show a flag image when right-clicked or long-clicked. (1)

## Game setup

When the game starts:

- Mines are randomly placed on the board. (3)
- The number of mines matches the selected difficulty. (1)
- Each non-mine cell stores the number of adjacent mines. (3)
- All cells begin hidden. (1)
- The game is active. (0.5)

## Gameplay

Clicking a hidden safe cell reveals it. (1)

Clicking a hidden mine causes an immediate loss. (2)

If a revealed safe cell has adjacent mines, it displays the adjacent mine count. (1)

If a revealed safe cell has 0 adjacent mines, the app may reveal connected zero cells and their surrounding number cells. (3)

The user should not be able to reveal cells after the game is over. (1)

## Win condition

The player wins when every non-mine cell has been revealed. (3)

When the player wins:

- The message says `Correct!`. (1)
- One leaderboard win is recorded. (1)
- The time taken or number of revealed cells can be stored as the game metric. (1)

## Loss condition

When the player clicks a mine:

- The message says `Game over!`. (1)
- All mines are revealed. (1)
- One leaderboard loss is recorded. (1)

## Suggested cell object

```js
{
  id: '0-0',
  row: 0,
  col: 0,
  isMine: false,
  adjacentMines: 1,
  isRevealed: false,
  isFlagged: false,
}
```

## Helper functions required

Create helper functions for:

- Generating mine positions. (2)
- Counting adjacent mines. (2)
- Checking whether the user has won. (2)
- Revealing connected zero cells if implemented. (2)

## Reset behaviour

Changing difficulty or clicking `Reset:` generates a new board and clears the game state. (1)
