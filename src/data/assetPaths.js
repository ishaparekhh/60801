export const assetPaths = {
  towerOfHanoi: {
    tower: '/assets/tower-of-hanoi/tower.svg',
    disks: [
      '/assets/tower-of-hanoi/disk-1.svg',
      '/assets/tower-of-hanoi/disk-2.svg',
      '/assets/tower-of-hanoi/disk-3.svg',
      '/assets/tower-of-hanoi/disk-4.svg',
      '/assets/tower-of-hanoi/disk-5.svg',
    ],
  },
  guessTheNumber: {
    timer: '/assets/shared/timer.svg',
    question: '/assets/shared/question-mark.svg',
  },
  sealTheBox: {
    dice: [1, 2, 3, 4, 5, 6].map((n) => `/assets/seal-the-box/dice-${n}.svg`),
  },
  ticTacToe: {
    x: '/assets/tic-tac-toe/x.svg',
    o: '/assets/tic-tac-toe/o.svg',
  },
  memoryCardGame: {
    back: '/assets/memory-card-game/card-back.svg',
    matches: [1, 2, 3, 4, 5, 6].map((n) => `/assets/memory-card-game/match-${n}.svg`),
  },
  rockPaperScissors: {
    rock: '/assets/rock-paper-scissors/rock.svg',
    paper: '/assets/rock-paper-scissors/paper.svg',
    scissors: '/assets/rock-paper-scissors/scissors.svg',
  },
  hangman: {
    stages: [0, 1, 2, 3, 4, 5, 6].map((n) => `/assets/hangman/hangman-${n}.svg`),
    words: '/data/hangman-words.json',
  },
  whackAMole: {
    mole: '/assets/whack-a-mole/mole.svg',
    hole: '/assets/whack-a-mole/hole.svg',
  },
  simonSays: {
    red: '/assets/simon-says/red.svg',
    blue: '/assets/simon-says/blue.svg',
    green: '/assets/simon-says/green.svg',
    yellow: '/assets/simon-says/yellow.svg',
  },
  minesweeperMini: {
    mine: '/assets/minesweeper-mini/mine.svg',
    flag: '/assets/minesweeper-mini/flag.svg',
  },
  wordScramble: {
    words: '/data/word-scramble-words.json',
  },
  reactionTimer: {
    ready: '/assets/reaction-timer/ready.svg',
    go: '/assets/reaction-timer/go.svg',
    tooSoon: '/assets/reaction-timer/too-soon.svg',
  },
  connectFour: {
    red: '/assets/connect-four/red-token.svg',
    yellow: '/assets/connect-four/yellow-token.svg',
  },
  typingSpeedTest: {
    sentences: '/data/typing-sentences.json',
  },
  snakeGame: {
    head: '/assets/snake-game/snake-head.svg',
    body: '/assets/snake-game/snake-body.svg',
    food: '/assets/snake-game/food.svg',
  },
};
