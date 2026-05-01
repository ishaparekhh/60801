# 1.4.7 Game 7 - Hangman - 28 marks

This game is based on guessing letters to reveal a hidden word before the hangman drawing is completed.

## Route and page purpose

This page exists on route `/hangman`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Hangman`. (0.5)

## Required assets

The following assets are provided:

- `/assets/hangman/hangman-0.svg` through `/assets/hangman/hangman-6.svg`
- `/data/hangman-words.json`

The image shown should correspond to the number of incorrect guesses. (2)

## Layout requirements

The page shall contain:

- A hidden word display using underscores for unguessed letters. (2)
- A keyboard area with A-Z buttons. (2)
- A hangman image area. (1)
- A wrong-guesses counter. (1)
- A used-letters display. (1)
- A reset button with the text `Reset:`. (0.5)
- A status message. (1)

## Game setup

When the game starts:

- One random word is selected from the word list. (2)
- The word is stored in lowercase. (0.5)
- No letters have been guessed. (1)
- The wrong-guesses count is 0. (1)
- The hangman image is `hangman-0.svg`. (1)

## Gameplay

When the player guesses a letter:

- The guessed letter is added to the used letters list. (1)
- If the letter exists in the word, all matching positions are revealed. (2)
- If the letter does not exist in the word, the wrong-guesses count increases by 1. (2)
- The matching hangman image updates. (1)

The user shall not be able to guess the same letter twice. (1)

The user shall not be able to keep guessing after the game ends. (1)

## Win condition

The player wins when every unique letter in the word has been guessed. (2)

When the player wins:

- The message says `Correct!`. (1)
- One leaderboard win is recorded. (1)
- The score can be calculated as `6 - wrongGuesses`. (1)

## Loss condition

The player loses when the wrong-guesses count reaches 6. (2)

When the player loses:

- The message says `Game over! The word was WORD.` (1)
- The final hangman image is `hangman-6.svg`. (0.5)
- One leaderboard loss is recorded. (1)

## Suggested React state

```js
const [word, setWord] = useState('');
const [guessedLetters, setGuessedLetters] = useState([]);
const [wrongGuesses, setWrongGuesses] = useState(0);
const [message, setMessage] = useState('Guess a letter.');
const [gameOver, setGameOver] = useState(false);
```

## Implementation hints

Fetch the word list from `/data/hangman-words.json`, or import a local array if preferred. (1)

To display the hidden word, map over each character and show the character only if it appears in `guessedLetters`. (2)

## Reset behaviour

When `Reset:` is clicked, a new random word is selected and all guesses are cleared. (1)
