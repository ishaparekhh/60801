# 1.4.3 Game 3 - Seal the Box - 28 marks

This game is based on the dice-and-tiles game often called Shut the Box or Seal the Box.

## Route and page purpose

This page exists on route `/seal-the-box`. The repo does not provide a required header or footer, so this page only needs to implement the main game body. (0.5)

The page shall contain a title with the text `Seal the Box`. (0.5)

The page shall contain instructions explaining that the player rolls dice and closes tiles whose values add to the dice total. (0.5)

## Required assets

The following assets are provided:

- `/assets/seal-the-box/dice-1.svg`
- `/assets/seal-the-box/dice-2.svg`
- `/assets/seal-the-box/dice-3.svg`
- `/assets/seal-the-box/dice-4.svg`
- `/assets/seal-the-box/dice-5.svg`
- `/assets/seal-the-box/dice-6.svg`

The dice images should be displayed after each roll. (1)

## Layout requirements

The page shall contain numbered tiles from 1 to 9. (2)

Each tile shall:

- Be clickable while open. (1)
- Display its number clearly. (0.5)
- Visually change when selected for the current roll. (1)
- Visually change when permanently closed. (1)

The page shall also contain:

- A dice display area showing two dice. (1)
- A button with the text `Roll:`. (0.5)
- A button with the text `Seal:`. (0.5)
- A button with the text `Reset:`. (0.5)
- A message area explaining the current action or error. (1)
- A score display showing the sum of open tiles. (1)

## Game setup

When the game starts:

- Tiles 1 to 9 are open. (1)
- No tiles are selected. (0.5)
- No dice have been rolled yet, or dice are shown as blank placeholders. (0.5)
- The current target total is empty until the first roll. (0.5)
- The open-tile score is 45. (1)

## Roll behaviour

When `Roll:` is clicked:

- Two random dice values between 1 and 6 are generated. (2)
- The dice images update to match the generated values. (1)
- The target total becomes the sum of both dice. (1)
- Any temporary selected tiles are cleared. (1)
- The app checks whether at least one valid combination of open tiles can match the dice total. (3)

If no valid combination exists:

- The game ends. (1)
- The message says something like `No moves left`. (1)
- A loss is recorded unless the remaining open-tile score is 0. (1)

## Tile selection behaviour

After rolling, the user may click open tiles to select or unselect them. (2)

Closed tiles cannot be selected. (1)

The selected tile total shall be displayed. (1)

If the selected total is greater than the dice total, the app shall show an error or warning message. (1)

## Seal behaviour

When `Seal:` is clicked:

- If no dice have been rolled, show an error. (0.5)
- If the selected tile total does not equal the dice total, show an error. (1)
- If the selected tile total equals the dice total, all selected tiles become closed. (2)
- After sealing, the selection is cleared. (1)
- The player must roll again before sealing more tiles. (1)

## Win and loss conditions

The player wins when all tiles are closed. (2)

When the player wins:

- An alert appears saying `Correct!`. (1)
- One new win is added to the leaderboard. (1)
- The best score should be stored as `0`, because the remaining tile total is zero. (0.5)

The player loses when there is no valid tile combination after a roll. (2)

When the player loses:

- A message shows the final remaining tile total. (1)
- One new loss is added to the leaderboard. (1)
- The remaining tile total should be stored as `score`. (1)

## Suggested React state

```js
const [tiles, setTiles] = useState([1,2,3,4,5,6,7,8,9]);
const [closedTiles, setClosedTiles] = useState([]);
const [selectedTiles, setSelectedTiles] = useState([]);
const [dice, setDice] = useState([null, null]);
const [targetTotal, setTargetTotal] = useState(null);
const [message, setMessage] = useState('Roll the dice to begin.');
const [gameOver, setGameOver] = useState(false);
```

## Helper function requirement

Create a helper function that checks whether any combination of open tiles can add to the dice total. (3)

A simple approach is to generate all subsets of the open tiles and check whether any subset sum equals the target. (1)

## Edge cases to handle

- The user should not be able to roll again while a valid unsealed selection exists. (0.5)
- The user should not be able to seal tiles before rolling. (0.5)
- A tile should not count twice in the selected total. (1)
- Resetting should reopen all tiles and clear dice, selections, messages, and game-over state. (1)
