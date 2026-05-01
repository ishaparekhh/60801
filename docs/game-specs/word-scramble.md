# 1.4.11 Game 11 - Word Scramble - 24 marks

This game is based on showing a scrambled word and asking the player to type the original word.

## Route and page purpose

This page exists on route `/word-scramble`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Word Scramble`. (0.5)

## Required assets/data

The following data file is provided:

- `/data/word-scramble-words.json`

The game should use this list as the word bank, or use an equivalent local word array. (1)

## Layout requirements

The page shall contain:

- A scrambled word display. (2)
- A text input for the user's answer. (1)
- A button with the text `Submit:`. (0.5)
- A button with the text `Skip:`. (0.5)
- A button with the text `Reset:`. (0.5)
- A score display. (1)
- An attempts or lives display. (1)
- A status message. (1)

## Game setup

When the game starts:

- A random word is chosen from the word bank. (2)
- The letters are shuffled to create the scrambled word. (2)
- The scrambled word should not be identical to the original word unless the word cannot be shuffled differently after several attempts. (1)
- The score begins at 0. (0.5)
- The player has 3 incorrect attempts. (0.5)

## Gameplay

When the user submits an answer:

- Leading and trailing spaces are ignored. (0.5)
- The answer is compared case-insensitively. (1)
- If the answer is correct, the score increases by 1. (1)
- If the answer is correct, a new word is shown. (1)
- If the answer is incorrect, the attempts count decreases by 1. (1)
- A message says whether the answer was correct or incorrect. (1)

The input should clear after each submitted answer. (1)

## Skip behaviour

When `Skip:` is clicked:

- A new word is selected. (1)
- The score does not increase. (0.5)
- The attempts count does not reset unless you explicitly choose that rule. (0.5)

## Win/loss behaviour

The player wins if they correctly solve a target number of words, such as 5. (2)

When the player wins:

- The message says `Correct!`. (1)
- One leaderboard win is recorded. (1)
- The final score is stored as `bestScore`. (1)

The player loses when attempts reach 0. (2)

When the player loses:

- The correct word is revealed. (1)
- One leaderboard loss is recorded. (1)

## Suggested React state

```js
const [words, setWords] = useState([]);
const [currentWord, setCurrentWord] = useState('');
const [scrambledWord, setScrambledWord] = useState('');
const [answer, setAnswer] = useState('');
const [score, setScore] = useState(0);
const [attemptsLeft, setAttemptsLeft] = useState(3);
const [gameOver, setGameOver] = useState(false);
```

## Reset behaviour

When `Reset:` is clicked, the score, attempts, current word, input, and status message reset. (1)
