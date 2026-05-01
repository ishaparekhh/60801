export const gameCatalog = [
  {
    id: 'tower-of-hanoi',
    title: 'Tower of Hanoi',
    route: '/tower-of-hanoi',
    description:
      'Move disks between three towers while following the rule that only one disk can move at a time and a larger disk cannot go on a smaller disk.',
    winMetric: 'Fewest valid moves',
  },
  {
    id: 'guess-the-number',
    title: 'Guess the Number',
    route: '/guess-the-number',
    description:
      'Guess a randomly generated number before the timer ends, using too high or too low hints after each incorrect guess.',
    winMetric: 'Fastest correct guess',
  },
  {
    id: 'seal-the-box',
    title: 'Seal the Box',
    route: '/seal-the-box',
    description:
      'Roll dice and close numbered tiles whose values add to the dice total, trying to close as many tiles as possible before no valid moves remain.',
    winMetric: 'Lowest remaining tile total',
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    route: '/tic-tac-toe',
    description:
      'Two players take turns placing Xs and Os on a 3 by 3 grid, trying to get three in a row horizontally, vertically, or diagonally.',
    winMetric: 'Wins and draws',
  },
  {
    id: 'memory-card-game',
    title: 'Memory Card Game',
    route: '/memory-card-game',
    description:
      'Flip two face-down cards at a time and try to find all matching pairs using memory and limited attempts.',
    winMetric: 'Fewest turns',
  },
  {
    id: 'rock-paper-scissors',
    title: 'Rock Paper Scissors',
    route: '/rock-paper-scissors',
    description:
      'Choose rock, paper, or scissors while the computer randomly chooses one, then compare choices to decide the winner.',
    winMetric: 'Best win rate',
  },
  {
    id: 'hangman',
    title: 'Hangman',
    route: '/hangman',
    description:
      'Guess letters to reveal a hidden word before using up all allowed incorrect guesses.',
    winMetric: 'Fewest wrong guesses',
  },
  {
    id: 'whack-a-mole',
    title: 'Whack-a-Mole',
    route: '/whack-a-mole',
    description:
      'Click the mole when it appears in random grid cells to score as many points as possible before time runs out.',
    winMetric: 'Highest score',
  },
  {
    id: 'simon-says',
    title: 'Simon Says',
    route: '/simon-says',
    description:
      'Watch a sequence of colours or buttons, then repeat the sequence in the correct order as it becomes longer each round.',
    winMetric: 'Longest sequence',
  },
  {
    id: 'minesweeper-mini',
    title: 'Minesweeper Mini',
    route: '/minesweeper-mini',
    description:
      'Reveal safe grid squares while avoiding hidden mines, using nearby mine counts to guide each move.',
    winMetric: 'Fastest board clear',
  },
  {
    id: 'word-scramble',
    title: 'Word Scramble',
    route: '/word-scramble',
    description:
      'Unscramble a shuffled word and type the correct original word before attempts or time run out.',
    winMetric: 'Correct words',
  },
  {
    id: 'reaction-timer',
    title: 'Reaction Timer',
    route: '/reaction-timer',
    description:
      'Wait for a signal and click as quickly as possible, with the game measuring the reaction time.',
    winMetric: 'Lowest reaction time',
  },
  {
    id: 'connect-four',
    title: 'Connect Four',
    route: '/connect-four',
    description:
      'Drop pieces into columns and try to connect four in a row horizontally, vertically, or diagonally before the other player does.',
    winMetric: 'Wins and draws',
  },
  {
    id: 'typing-speed-test',
    title: 'Typing Speed Test',
    route: '/typing-speed-test',
    description:
      'Type a displayed sentence as quickly and accurately as possible while the game calculates speed and mistakes.',
    winMetric: 'Highest WPM',
  },
  {
    id: 'snake-game',
    title: 'Snake Game',
    route: '/snake-game',
    description:
      'Control a snake around a grid, eat food to grow longer, and avoid hitting the walls or the snake body.',
    winMetric: 'Highest score',
  },
];
