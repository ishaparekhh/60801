# 1.4.13 Game 13 - Connect Four - 32 marks

This game is based on dropping tokens into a 7 by 6 board and trying to connect four in a row.

## Route and page purpose

This page exists on route `/connect-four`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Connect Four`. (0.5)

## Required assets

The following assets are provided:

- `/assets/connect-four/red-token.svg`
- `/assets/connect-four/yellow-token.svg`

Text, circles, or CSS backgrounds are also acceptable. (0.5)

## Layout requirements

The page shall contain a Connect Four board with 7 columns and 6 rows. (3)

Each board cell shall:

- Show empty, red, or yellow state. (1)
- Have a visible circular slot style. (1)
- Be updated when a token is dropped into its column. (1)

The page shall contain:

- Column controls or clickable columns. (2)
- A current-player display. (1)
- A reset button with the text `Reset:`. (0.5)
- A status message. (1)

## Game setup

When the game starts:

- The board is 6 rows high and 7 columns wide. (1)
- Every cell is empty. (1)
- Red starts first. (0.5)
- No winner exists. (0.5)

## Gameplay

When a player chooses a column:

- The token falls to the lowest available empty cell in that column. (3)
- The cell becomes the current player's colour. (1)
- The app checks whether that move creates four in a row. (3)
- If there is no winner, the current player changes. (1)

If the chosen column is full:

- No token is placed. (1)
- The current player does not change. (1)
- A message says `Column full`. (0.5)

## Win logic

A player wins if they connect four tokens:

- Horizontally. (1)
- Vertically. (1)
- Diagonally down-right. (1)
- Diagonally up-right. (1)

When a player wins:

- The message says `Red wins!` or `Yellow wins!`. (1)
- No more tokens can be placed. (1)
- A leaderboard result is recorded. (1)

If the board fills with no winner:

- The message says `Draw!`. (1)
- A leaderboard draw is recorded. (1)

## Suggested React state

```js
const ROWS = 6;
const COLS = 7;
const [board, setBoard] = useState(
  Array.from({ length: ROWS }, () => Array(COLS).fill(null))
);
const [currentPlayer, setCurrentPlayer] = useState('red');
const [winner, setWinner] = useState(null);
const [message, setMessage] = useState('Red turn');
```

## Helper function requirements

Create helper functions for:

- Finding the lowest empty row in a column. (2)
- Checking four-in-a-row from the latest placed token. (4)
- Checking whether the board is full. (1)

## Reset behaviour

When `Reset:` is clicked, the board clears, red becomes the starting player, and game-over state resets. (1)
