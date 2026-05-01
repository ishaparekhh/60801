# 1.4.2 Game 2 - Guess the Number - 26 marks

This game is based on a timed random-number guessing game.

## Route and page purpose

This page exists on route `/guess-the-number`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Guess the Number`. (0.5)

The page shall contain instructions explaining that the user must guess the secret number before the timer reaches zero. (0.5)

## Required assets

The following assets are provided and may be used:

- `/assets/shared/timer.svg`
- `/assets/shared/question-mark.svg`
- `/assets/shared/win.svg`
- `/assets/shared/loss.svg`

These assets are optional visual helpers; the game can also be implemented using text and buttons only. (0.5)

## Difficulty requirements

The page shall contain three difficulty buttons or a select menu with the options `Easy`, `Medium`, and `Hard`. (1)

The difficulty shall control both the number range and the timer length:

| Difficulty | Random number range | Time limit |
|---|---:|---:|
| Easy | 1 to 20 | 60 seconds |
| Medium | 1 to 50 | 45 seconds |
| Hard | 1 to 100 | 30 seconds |

When a difficulty is selected:

- A new random number is generated inside the correct range. (2)
- The timer resets to the correct time limit. (1)
- The previous guesses are cleared. (1)
- The hint message resets. (0.5)

## Layout requirements

The page shall contain:

- A difficulty selector. (1)
- A visible timer. (1)
- A text or number input for the user's guess. (1)
- A submit button with the text `Guess:`. (0.5)
- A reset button with the text `Reset:`. (0.5)
- A status message showing hints and final result. (1)
- A list or counter showing previous guesses. (1)

## Game start behaviour

When the page first loads:

- The default difficulty shall be `Easy`. (0.5)
- A random number between 1 and 20 shall be generated. (1)
- The timer shall start at 60 seconds. (1)
- The status message shall say something like `Enter your first guess.` (0.5)

## Timer behaviour

The timer shall count down by 1 every second while the game is active. (2)

When the timer reaches 0:

- The input and guess button become disabled. (1)
- A pop-up or alert appears saying `Time is up! The number was X.` where `X` is the secret number. (2)
- One new loss is added to the leaderboard for Guess the Number. (1)
- The timer stops and does not continue below zero. (1)

## Guessing behaviour

When the user submits a guess:

- Empty input should not count as a guess. (0.5)
- Non-numeric input should not count as a guess. (0.5)
- A number outside the current difficulty range should show an error message. (1)
- A valid incorrect guess is stored in the previous guesses list. (1)

If the guess is too low, the message shall say `Too low`. (1)

If the guess is too high, the message shall say `Too high`. (1)

If the guess is correct:

- The message shall say `Correct!`. (1)
- The timer stops. (1)
- The input and guess button become disabled. (1)
- One new win is added to the leaderboard. (1)
- The result should store the time taken as `timeSeconds`. (1)

## Reset behaviour

When `Reset:` is clicked:

- A new random number is generated. (1)
- The timer resets based on the current difficulty. (1)
- The input is cleared. (0.5)
- The previous guesses are cleared. (0.5)
- The game becomes active again. (1)

## Suggested React state

```js
const [difficulty, setDifficulty] = useState('easy');
const [secretNumber, setSecretNumber] = useState(null);
const [timeLeft, setTimeLeft] = useState(60);
const [guess, setGuess] = useState('');
const [previousGuesses, setPreviousGuesses] = useState([]);
const [message, setMessage] = useState('Enter your first guess.');
const [gameOver, setGameOver] = useState(false);
const [hasRecordedResult, setHasRecordedResult] = useState(false);
```

## Edge cases to handle

- Clear the interval in the `useEffect` cleanup function. (1)
- Do not record both a loss and a win if the user guesses at the exact moment the timer ends. (1)
- Do not record multiple losses after the timer reaches zero. (1)
- Make sure random numbers include both the minimum and maximum values. (1)
