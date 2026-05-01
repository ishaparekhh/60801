# 1.4.12 Game 12 - Reaction Timer - 24 marks

This game is based on waiting for a signal and clicking as quickly as possible.

## Route and page purpose

This page exists on route `/reaction-timer`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Reaction Timer`. (0.5)

## Required assets

The following assets are provided:

- `/assets/reaction-timer/ready.svg`
- `/assets/reaction-timer/go.svg`
- `/assets/reaction-timer/too-soon.svg`
- `/assets/shared/timer.svg`

## Layout requirements

The page shall contain:

- A large clickable reaction area. (2)
- A start button with the text `Start:`. (0.5)
- A reset button with the text `Reset:`. (0.5)
- A message showing `Waiting`, `Click now`, `Too soon`, or the measured time. (1)
- A best-time display. (1)

## Game setup

When the page first loads:

- The game is idle. (1)
- No reaction time is shown. (0.5)
- The best time is loaded from current state or local leaderboard data if available. (0.5)

## Start behaviour

When `Start:` is clicked:

- The message says `Wait for green`. (1)
- The reaction area enters a waiting state. (1)
- A random delay is generated between 2 and 5 seconds. (2)
- The user must not know exactly when the signal will appear. (1)

After the random delay:

- The reaction area changes to the go state. (1)
- The message says `Click now!`. (0.5)
- The app stores the start timestamp using `Date.now()` or `performance.now()`. (2)

## Click behaviour

If the user clicks before the go signal:

- The result is `Too soon`. (1)
- The current round ends. (1)
- A leaderboard loss may be recorded. (0.5)

If the user clicks after the go signal:

- The reaction time is calculated in milliseconds. (2)
- The reaction time is displayed. (1)
- The best reaction time updates if the new result is lower. (1)
- A leaderboard win is recorded with `bestTimeSeconds` or score data. (1)

## Suggested React state

```js
const [phase, setPhase] = useState('idle'); // idle, waiting, ready, tooSoon, finished
const [startTime, setStartTime] = useState(null);
const [reactionMs, setReactionMs] = useState(null);
const [bestMs, setBestMs] = useState(null);
const [message, setMessage] = useState('Press Start to begin.');
```

## Timing requirements

Use a timeout for the random delay and clear it if the component unmounts or the user resets. (2)

Use `performance.now()` for more accurate millisecond timing if possible. (1)

## Reset behaviour

When `Reset:` is clicked, clear pending timeouts and return the game to the idle state. (1)

## Edge cases to handle

- The user should not be able to start multiple overlapping timers. (1)
- Clicking after a round is finished should not change the recorded result. (1)
- The best time should only update from valid clicks after the signal. (1)
