# Leaderboard Page Specification - 18 marks

This page exists on route `/leaderboard` and shows performance statistics across all implemented games.

The repo does not provide a required header or footer, so this page only needs to implement the main leaderboard body. (0.5)

## Page purpose

The leaderboard page should summarise how well the current player has performed across every game in the repo. The most important metric is win rate, but the page should also show plays, wins, losses, draws, best score, and fastest time where available. (2)

## Layout requirements

The page shall contain:

- A heading with the text `Leaderboard`. (0.5)
- A summary section for overall results. (1)
- A table showing one row per game. (2)
- A reset statistics button. (1)

The overall summary shall show:

- Total games played. (1)
- Total wins. (1)
- Total losses. (1)
- Total draws. (1)
- Overall win rate. (2)

The per-game table shall show:

- Game name. (1)
- Plays. (1)
- Wins. (1)
- Losses. (1)
- Draws. (1)
- Win rate. (2)
- Best score. (1)
- Fastest time. (1)
- Main game-specific metric. (1)

## Win rate formula

Win rate should be calculated as:

```txt
win rate = wins / plays * 100
```

If a game has 0 plays, the win rate should display as `0%` or `N/A`. (1)

Draws count as plays but do not count as wins. (1)

## Suggested stored data shape

```js
{
  'tic-tac-toe': {
    plays: 10,
    wins: 6,
    losses: 2,
    draws: 2,
    bestScore: null,
    bestTimeSeconds: 14
  }
}
```

## Required helper behaviour

The repo includes `src/utils/gameStats.js`. Each game should use `recordGameResult(gameId, result)` when the game finishes.

Example:

```js
recordGameResult('memory-card-game', {
  outcome: 'win',
  score: 12,
  timeSeconds: 45,
});
```

The helper should:

- Increase `plays` every time a result is recorded. (1)
- Increase `wins`, `losses`, or `draws` based on the outcome. (1)
- Update `bestScore` when the new score is better. (1)
- Update `bestTimeSeconds` when the new time is faster. (1)
- Store the updated data in `localStorage`. (1)

## Important implementation rule

Each game should record the result exactly once per finished round. A common way to prevent duplicate recording is to use a state value such as:

```js
const [hasRecordedResult, setHasRecordedResult] = useState(false);
```

Set this to `true` immediately after recording a win, loss, or draw. (1)

## Reset statistics behaviour

When the reset statistics button is clicked:

- The app clears the saved leaderboard data from `localStorage`. (1)
- The leaderboard table updates immediately. (1)
- A message confirms that statistics were reset. (0.5)
