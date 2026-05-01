# 1.4.14 Game 14 - Typing Speed Test - 26 marks

This game is based on typing a displayed sentence as quickly and accurately as possible.

## Route and page purpose

This page exists on route `/typing-speed-test`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Typing Speed Test`. (0.5)

## Required assets/data

The following data file is provided:

- `/data/typing-sentences.json`

The game should use this sentence list, or an equivalent local array. (1)

## Layout requirements

The page shall contain:

- A sentence display. (1)
- A large text input or textarea. (1)
- A start button with the text `Start:`. (0.5)
- A reset button with the text `Reset:`. (0.5)
- A timer display. (1)
- A WPM display. (1)
- An accuracy display. (1)
- A status message. (1)

## Game setup

When the page first loads:

- A random sentence is selected from the sentence list. (1)
- The input is empty. (0.5)
- The timer is 0 or not started. (0.5)
- WPM and accuracy are empty or 0. (0.5)

## Start behaviour

When `Start:` is clicked:

- The timer begins. (1)
- The input becomes active. (1)
- The user can begin typing. (0.5)

The timer may also begin automatically when the user types the first character. (1)

## Typing behaviour

As the user types:

- The app stores the typed text. (1)
- The app compares the typed text with the target sentence. (2)
- Correct and incorrect characters may be visually highlighted. (2)
- The current accuracy is calculated. (2)

## Completion behaviour

The round finishes when the typed text exactly matches the target sentence. (2)

When the round finishes:

- The timer stops. (1)
- WPM is calculated and displayed. (2)
- Accuracy is displayed. (1)
- A leaderboard win is recorded. (1)
- The WPM should be stored as `bestScore`, and time may be stored as `timeSeconds`. (1)

## Suggested calculations

WPM can be calculated as:

```js
const minutes = elapsedSeconds / 60;
const words = targetSentence.trim().split(/\s+/).length;
const wpm = Math.round(words / minutes);
```

Accuracy can be calculated as:

```js
const correctChars = typed.split('').filter((char, index) => char === target[index]).length;
const accuracy = Math.round((correctChars / typed.length) * 100);
```

## Suggested React state

```js
const [targetSentence, setTargetSentence] = useState('');
const [typedText, setTypedText] = useState('');
const [startedAt, setStartedAt] = useState(null);
const [elapsedSeconds, setElapsedSeconds] = useState(0);
const [wpm, setWpm] = useState(null);
const [accuracy, setAccuracy] = useState(null);
const [gameOver, setGameOver] = useState(false);
```

## Reset behaviour

When `Reset:` is clicked, a new sentence is selected and all timing, typing, WPM, and accuracy state resets. (1)

## Edge cases to handle

- Avoid dividing by zero when calculating WPM. (1)
- Clear intervals on reset and unmount. (1)
- Do not record the result more than once when the sentence is completed. (1)
