# 1.4.4 Game 4 - Tic Tac Toe - 24 marks

This game is based on a two-player 3 by 3 noughts and crosses board.

## Route and page purpose

This page exists on route `/tic-tac-toe`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Tic Tac Toe`. (0.5)

## Required assets

The following assets are provided and may be used inside board cells:

- `/assets/tic-tac-toe/x.svg`
- `/assets/tic-tac-toe/o.svg`

Text characters `X` and `O` are also acceptable if you want to keep the implementation simpler. (0.5)

## Layout requirements

The page shall contain a 3 x 3 grid of cells. (2)

Each cell shall:

- Be the same width and height. (0.5)
- Have a visible border. (0.5)
- Display either `X`, `O`, or nothing. (1)
- Be clickable when empty and when the game is not over. (1)

The page shall also contain:

- A status message showing whose turn it is. (1)
- A reset button with the text `Reset:`. (0.5)
- A scoreboard showing X wins, O wins, and draws for the current browser session. (2)

## Game setup

When the game starts:

- The board contains 9 empty cells. (1)
- Player X always starts first. (1)
- The game status says `X turn` or equivalent. (0.5)
- No winner is selected. (0.5)

## Gameplay

Clicking an empty cell places the current player's symbol in that cell. (2)

After a valid click:

- The app checks whether the current player has won. (2)
- If no one has won, the turn changes to the other player. (1)
- The user should not be able to overwrite a filled cell. (1)
- The user should not be able to place more symbols after the game is over. (1)

## Win and draw logic

A player wins if they have three symbols in a row:

- Horizontally. (1)
- Vertically. (1)
- Diagonally. (1)

If all 9 cells are filled and no player has won, the game is a draw. (2)

When X wins:

- The message says `X wins!`. (0.5)
- One win is recorded for Tic Tac Toe if the current player is treated as the user. (1)

When O wins:

- The message says `O wins!`. (0.5)
- One loss may be recorded if O is treated as the opponent, or one win may be recorded if this is local two-player mode. (1)

When a draw occurs:

- The message says `Draw!`. (0.5)
- One draw is recorded in the leaderboard. (1)

## Suggested React state

```js
const [board, setBoard] = useState(Array(9).fill(null));
const [currentPlayer, setCurrentPlayer] = useState('X');
const [winner, setWinner] = useState(null);
const [isDraw, setIsDraw] = useState(false);
const [message, setMessage] = useState('X turn');
```

## Helper function requirement

Create a function such as `calculateWinner(board)` that checks the 8 possible winning lines. (3)

Example winning lines:

```js
const lines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];
```

## Reset behaviour

When `Reset:` is clicked, the board clears, X becomes the current player, and the win/draw state is cleared. (1)
