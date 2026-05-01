# 1.4.8 Game 8 - Whack-a-Mole - 26 marks

This game is based on clicking a mole that appears randomly in a grid before the timer expires.

## Route and page purpose

This page exists on route `/whack-a-mole`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Whack-a-Mole`. (0.5)

## Required assets

The following assets are provided:

- `/assets/whack-a-mole/mole.svg`
- `/assets/whack-a-mole/hole.svg`

## Layout requirements

The page shall contain a 3 x 3 grid of holes. (2)

Each grid cell shall:

- Display the hole asset when no mole is present. (1)
- Display the mole asset when the mole is present. (1)
- Be clickable. (1)

The page shall also contain:

- A timer display. (1)
- A score display. (1)
- A start button with the text `Start:`. (0.5)
- A reset button with the text `Reset:`. (0.5)
- A status message. (1)

## Game setup

When the page first loads:

- The score is 0. (0.5)
- The timer is 30 seconds. (0.5)
- No mole is active until the user starts the game. (1)

## Gameplay

When `Start:` is clicked:

- The timer begins counting down by 1 every second. (2)
- A mole appears in a random grid cell. (2)
- The mole changes position repeatedly during the game. (2)

When the user clicks the active mole:

- The score increases by 1. (1)
- The mole immediately moves to another random cell. (1)
- The status message says something like `Hit!`. (0.5)

When the user clicks a hole without a mole:

- The score does not increase. (1)
- The status message says something like `Miss!`. (0.5)

## Timing rules

The mole should move automatically every 800 to 1200 milliseconds, or at a fixed interval such as 1000 milliseconds. (2)

The timer should stop at 0 and not go below 0. (1)

All intervals must be cleared when the component unmounts or the game stops. (2)

## End condition

When the timer reaches 0:

- The game stops. (1)
- The mole disappears or becomes unclickable. (1)
- A message shows the final score. (1)
- A leaderboard result is recorded. (1)

A win may be recorded if the player reaches a target score such as 15; otherwise record the final score as `bestScore`. (1)

## Suggested React state

```js
const [activeCell, setActiveCell] = useState(null);
const [score, setScore] = useState(0);
const [timeLeft, setTimeLeft] = useState(30);
const [isRunning, setIsRunning] = useState(false);
const [message, setMessage] = useState('Press Start to begin.');
```

## Reset behaviour

When `Reset:` is clicked, score, timer, active mole, running state, and message reset. (1)
