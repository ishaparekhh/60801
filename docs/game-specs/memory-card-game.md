# 1.4.5 Game 5 - Memory Card Game - 30 marks

This game is based on a memory matching card game.

## Route and page purpose

This page exists on route `/memory-card-game`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Memory Card Game`. (0.5)

## Required assets

The following assets are provided:

- `/assets/memory-card-game/card-back.svg`
- `/assets/memory-card-game/match-1.svg`
- `/assets/memory-card-game/match-2.svg`
- `/assets/memory-card-game/match-3.svg`
- `/assets/memory-card-game/match-4.svg`
- `/assets/memory-card-game/match-5.svg`
- `/assets/memory-card-game/match-6.svg`

## Layout requirements

The page shall contain a 4 x 3 grid of cards. (2)

Each card shall:

- Be 110px x 110px. (0.5)
- Have a 1px solid `#333333` border. (0.5)
- Have 0px margin. (0.5)
- Show the card-back asset while face down. (1)
- Show its matching image while face up. (1)
- Be arranged so that the whole grid appears near the vertical and horizontal centre of the main body. (0.5)

The page shall also contain:

- A move counter. (1)
- A matched-pairs counter. (1)
- A button below the grid on the left half of the screen with the text `Peek:`. (0.5)
- A button below the grid on the right half of the screen with the text `Reset:`. (0.5)

## Game setup

When the game starts:

- The grid contains 12 cards total. (1)
- The 12 cards consist of 6 matching image pairs. (2)
- The images used are `match-1.svg` through to `match-6.svg`. (1)
- The cards are randomly shuffled each time the game starts. (2)
- All cards begin face down. (1)
- No cards are locked. (0.5)
- The move counter begins at 0. (0.5)

## Gameplay

Clicking a face-down card turns it face up. (2)

Once two cards are face up, the app checks whether they match. (2)

If the two cards match:

- They remain face up. (1)
- They become locked and cannot be flipped back down. (1)
- The matched-pairs counter increases by 1. (1)

If the two cards do not match:

- They remain visible briefly. (0.5)
- They turn face down again after a short delay. (2)

The user should not be able to flip more than two unlocked cards at the same time. (2)

The user should not be able to click the same card twice to create a false match. (1)

## Peek behaviour

When `Peek:` is clicked:

- All cards are shown face up for exactly 1 second. (2)
- After 1 second, all unmatched cards turn face down again. (1)
- Matched cards remain face up. (0.5)
- The player should not be able to flip cards during the peek period. (1)

## Win condition

When all six pairs have been matched:

- An alert appears saying `Correct!`. (1)
- After the alert is closed, the game starts again with a new shuffled order. (1)
- One new win is added to the current player's leaderboard total. (1)
- The number of moves is stored as the score or best metric. (1)

## Suggested React state

```js
const [cards, setCards] = useState([]);
const [flippedIds, setFlippedIds] = useState([]);
const [matchedIds, setMatchedIds] = useState([]);
const [moves, setMoves] = useState(0);
const [isChecking, setIsChecking] = useState(false);
const [isPeeking, setIsPeeking] = useState(false);
```

## Reset behaviour

When `Reset:` is clicked, the game restarts with a newly shuffled order and all counters reset. (1)
