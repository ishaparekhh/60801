# 1.4.9 Game 9 - Simon Says - 28 marks

This game is based on watching a sequence of colours and repeating it in the same order.

## Route and page purpose

This page exists on route `/simon-says`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Simon Says`. (0.5)

## Required assets

The following assets are provided:

- `/assets/simon-says/red.svg`
- `/assets/simon-says/blue.svg`
- `/assets/simon-says/green.svg`
- `/assets/simon-says/yellow.svg`

## Layout requirements

The page shall contain four large colour buttons: red, blue, green, and yellow. (2)

Each colour button shall:

- Be clickable during the player's turn. (1)
- Visually highlight when it is being shown in the sequence. (1)
- Be disabled or ignored while the app is playing the sequence. (1)

The page shall also contain:

- A start button with the text `Start:`. (0.5)
- A reset button with the text `Reset:`. (0.5)
- A level display. (1)
- A status message saying whether the sequence is playing or the user should repeat it. (1)

## Game setup

When the page first loads:

- The sequence is empty. (1)
- The current level is 0. (0.5)
- The user input sequence is empty. (0.5)
- The game is not running until `Start:` is clicked. (1)

## Sequence generation

When a new round begins:

- One random colour is added to the sequence. (2)
- The level increases by 1. (1)
- The app displays the full sequence from the beginning. (2)
- The user's input is cleared. (1)

## Display behaviour

The app shall show each colour in the sequence one at a time. (2)

Each colour should visibly highlight for a short time, such as 500ms. (1)

The player should not be able to click buttons while the sequence is being displayed. (1)

## Player input behaviour

After the sequence finishes displaying, the player repeats the sequence by clicking colour buttons. (2)

After each click:

- The app checks whether the clicked colour matches the expected colour at that position. (2)
- If correct and the sequence is not finished, the player continues. (1)
- If the full sequence is repeated correctly, a new round starts. (2)
- If incorrect, the game ends. (1)

## End condition

When the player makes an incorrect click:

- The message says `Game over`. (0.5)
- The final level is displayed. (0.5)
- A leaderboard loss is recorded, or a win is recorded if the player reached a target level such as 8. (1)
- The highest level should be stored as `bestScore`. (1)

## Suggested React state

```js
const colours = ['red', 'blue', 'green', 'yellow'];
const [sequence, setSequence] = useState([]);
const [playerIndex, setPlayerIndex] = useState(0);
const [activeColour, setActiveColour] = useState(null);
const [isShowingSequence, setIsShowingSequence] = useState(false);
const [level, setLevel] = useState(0);
const [gameOver, setGameOver] = useState(false);
```

## Reset behaviour

When `Reset:` is clicked, the sequence, level, active colour, player input, and game-over state reset. (1)
