# 1.4.1 Game 1 - Tower of Hanoi - 24 marks

This game is based on the classic Tower of Hanoi puzzle.

## Route and page purpose

This page exists on route `/tower-of-hanoi`. The repo does not provide a required header or footer, so this page only needs to implement the main game body and can later be wrapped in your own layout. (0.5)

The page shall contain a title with the text `Tower of Hanoi`. (0.5)

The page shall contain a short instruction paragraph explaining that the player must move all disks from the first tower to the last tower. (0.5)

## Required assets

The following assets are provided and may be used:

- `/assets/tower-of-hanoi/tower.svg`
- `/assets/tower-of-hanoi/disk-1.svg`
- `/assets/tower-of-hanoi/disk-2.svg`
- `/assets/tower-of-hanoi/disk-3.svg`
- `/assets/tower-of-hanoi/disk-4.svg`
- `/assets/tower-of-hanoi/disk-5.svg`

The disks may also be drawn using CSS rectangles if preferred. The important requirement is that the disks are visually different sizes. (1)

## Layout requirements

The page shall contain exactly three tower areas arranged horizontally. (2)

Each tower area shall:

- Have a visible vertical pole or centre line. (0.5)
- Have a visible base. (0.5)
- Display its current stack of disks from bottom to top. (1)
- Be clickable or contain a clickable button for selecting that tower. (1)

The game controls shall include:

- A difficulty selector with options `Easy`, `Medium`, and `Hard`. (1)
- A reset button with the text `Reset:`. (0.5)
- A move counter showing the number of valid moves made. (1)
- A status message area for invalid moves, selected tower, and win messages. (1)

## Difficulty setup

When the game starts:

- `Easy` starts with 3 disks. (0.5)
- `Medium` starts with 4 disks. (0.5)
- `Hard` starts with 5 disks. (0.5)
- All disks begin stacked on the left tower. (1)
- The middle and right towers begin empty. (1)
- The largest disk must be at the bottom and the smallest disk must be at the top. (1)

Changing difficulty shall restart the game with the correct number of disks. (1)

## Gameplay

The user selects a source tower and then a destination tower. (2)

A move is valid only when:

- The source tower is not empty. (1)
- Only the top disk from the source tower is moved. (1)
- The destination tower is empty, or the destination tower's top disk is larger than the moving disk. (2)

If the move is valid:

- The disk is removed from the source tower. (1)
- The disk is added to the destination tower. (1)
- The move counter increases by 1. (1)
- The selected source tower is cleared. (0.5)

If the move is invalid:

- No disk is moved. (1)
- The move counter does not increase. (1)
- A message such as `Invalid move` is shown. (1)

## Win condition

The player wins when all disks are on the right tower in the correct order. (2)

When the player wins:

- An alert appears saying `Correct!`. (1)
- The final move count remains visible until the user resets. (0.5)
- One new win is added to the leaderboard for Tower of Hanoi. (1)
- The leaderboard metric should store the fewest moves as `bestScore`. (1)

## Suggested React state

Use state similar to:

```js
const [difficulty, setDifficulty] = useState('easy');
const [towers, setTowers] = useState([[3, 2, 1], [], []]);
const [selectedTower, setSelectedTower] = useState(null);
const [moves, setMoves] = useState(0);
const [status, setStatus] = useState('Select a tower to begin.');
const [gameOver, setGameOver] = useState(false);
```

Represent smaller disks with smaller numbers, such as `1` being the smallest disk. This makes the invalid-move check simple because a disk can only be placed on a larger number. (1)

## Edge cases to handle

- Clicking an empty tower as the first selection should show a helpful message. (0.5)
- Clicking the same selected tower twice should cancel the selection. (0.5)
- The leaderboard should not record multiple wins if the user keeps clicking after the game is already won. (1)
- Resetting should clear move count, status, selected tower, and win state. (1)
