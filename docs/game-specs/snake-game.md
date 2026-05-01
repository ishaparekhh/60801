# 1.4.15 Game 15 - Snake Game - 32 marks

This game is based on moving a snake around a grid, eating food, growing longer, and avoiding collisions.

## Route and page purpose

This page exists on route `/snake-game`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Snake Game`. (0.5)

## Required assets

The following assets are provided:

- `/assets/snake-game/snake-head.svg`
- `/assets/snake-game/snake-body.svg`
- `/assets/snake-game/food.svg`

CSS blocks are also acceptable for the snake and food. (0.5)

## Layout requirements

The page shall contain a grid-based play area. (2)

A recommended board size is 20 columns by 20 rows. (1)

The page shall contain:

- A score display. (1)
- A start button with the text `Start:`. (0.5)
- A reset button with the text `Reset:`. (0.5)
- A status message. (1)
- Optional difficulty selector controlling snake speed. (1)

## Game setup

When the game starts:

- The snake begins with 3 body segments. (1)
- The snake begins near the centre of the board. (1)
- The snake has an initial direction, such as right. (0.5)
- One food item is placed randomly on an empty cell. (2)
- The score begins at 0. (0.5)

## Movement behaviour

The snake moves automatically on a repeated interval. (2)

At each movement tick:

- A new head position is calculated from the current direction. (2)
- The new head is added to the front of the snake array. (1)
- If the snake did not eat food, the last tail segment is removed. (1)
- If the snake ate food, the tail is not removed and the snake grows. (2)

## Keyboard controls

The user shall be able to control the snake using arrow keys or WASD. (2)

The snake should not be able to immediately reverse into itself. For example, if moving right, pressing left should be ignored. (2)

## Food behaviour

When the snake head reaches the food cell:

- The score increases by 1. (1)
- The snake grows by one segment. (1)
- A new food item is randomly placed on an empty cell. (2)

Food should not spawn on the snake body. (2)

## Loss condition

The player loses if:

- The snake hits a wall. (1)
- The snake hits its own body. (1)

When the player loses:

- The game stops. (1)
- The message says `Game over!`. (1)
- A leaderboard loss or score result is recorded. (1)
- The final score is stored as `bestScore`. (1)

## Win condition option

You may define a win as reaching a target score, such as 10 food items. (1)

If this win condition is used, record a leaderboard win when the target is reached. (1)

## Suggested React state

```js
const [snake, setSnake] = useState([{ row: 10, col: 10 }, { row: 10, col: 9 }, { row: 10, col: 8 }]);
const [direction, setDirection] = useState('right');
const [nextDirection, setNextDirection] = useState('right');
const [food, setFood] = useState({ row: 5, col: 5 });
const [score, setScore] = useState(0);
const [isRunning, setIsRunning] = useState(false);
const [gameOver, setGameOver] = useState(false);
```

## Timing requirements

Use `setInterval` to move the snake at a fixed speed, such as every 150ms. (1)

Clear the interval on reset, game over, and component unmount. (2)

## Reset behaviour

When `Reset:` is clicked, the snake, food, direction, score, running state, and game-over state reset. (1)
