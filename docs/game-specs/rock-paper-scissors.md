# 1.4.6 Game 6 - Rock Paper Scissors - 22 marks

This game is based on the standard rock-paper-scissors hand game against a computer opponent.

## Route and page purpose

This page exists on route `/rock-paper-scissors`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Rock Paper Scissors`. (0.5)

## Required assets

The following assets are provided:

- `/assets/rock-paper-scissors/rock.svg`
- `/assets/rock-paper-scissors/paper.svg`
- `/assets/rock-paper-scissors/scissors.svg`

## Layout requirements

The page shall contain three player choice buttons labelled `Rock`, `Paper`, and `Scissors`. (1.5)

Each button shall display either text or the matching asset. (1)

The page shall also contain:

- A display of the player's latest choice. (1)
- A display of the computer's latest choice. (1)
- A result message. (1)
- A round counter. (1)
- A reset button with the text `Reset:`. (0.5)

## Gameplay

When the user clicks one of the three choices:

- The player's choice is stored. (1)
- The computer randomly chooses one of `rock`, `paper`, or `scissors`. (2)
- The app compares both choices. (2)
- The result is displayed immediately. (1)

## Result rules

The game shall use these rules:

- Rock beats scissors. (0.5)
- Scissors beats paper. (0.5)
- Paper beats rock. (0.5)
- Same choices result in a draw. (0.5)

If the player wins, the message shall say `You win!`. (0.5)

If the player loses, the message shall say `You lose!`. (0.5)

If the round is a draw, the message shall say `Draw!`. (0.5)

## Score and leaderboard

The page shall maintain a session score showing:

- Player wins. (1)
- Computer wins. (1)
- Draws. (1)

Each completed round shall record exactly one leaderboard result:

- Player win records `win`. (1)
- Player loss records `loss`. (1)
- Draw records `draw`. (1)

## Suggested React state

```js
const choices = ['rock', 'paper', 'scissors'];
const [playerChoice, setPlayerChoice] = useState(null);
const [computerChoice, setComputerChoice] = useState(null);
const [result, setResult] = useState('Choose an option.');
const [rounds, setRounds] = useState(0);
```

## Reset behaviour

When `Reset:` is clicked, latest choices, result text, round counter, and session score reset. (1)

## Edge cases to handle

- The computer choice should be random every round. (1)
- Repeated clicks should create new rounds rather than modifying an old round. (1)
- Capitalisation should be consistent in the UI. (0.5)
