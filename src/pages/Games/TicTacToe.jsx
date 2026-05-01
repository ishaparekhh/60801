import { useState } from "react";
import { Button } from "@/components/ui/button";
import rawCode from "./TicTacToe.jsx?raw";

// This helper function checks the 3x3 board to see if anyone has won.
// It takes in the current 'squares' array (which has 9 items: either 'X', 'O', or null).
function calculateWinner(squares) {
  // These are all the possible winning combinations (indices 0-8)
  // For example, [0, 1, 2] means the top row is completely filled by one player.
  const lines = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6], // Diagonal from top-right to bottom-left
  ];

  // Loop through every possible winning line
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // If the square at position 'a' has a piece (not null) AND
    // it matches the piece at position 'b' AND matches the piece at position 'c'
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // We found a winner! Return the winning piece ('X' or 'O')
      return squares[a];
    }
  }
  // If we checked every line and found no matches, return null (no winner yet)
  return null;
}

export default function TicTacToe() {
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([rawCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "TicTacToe.jsx";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // 'board' holds an array of 9 items representing the 3x3 grid.
  // We initialize it to an array of 9 'null' values.
  const [board, setBoard] = useState(Array(9).fill(null));

  // Keep track of whose turn it is. 'X' always goes first.
  const [currentPlayer, setCurrentPlayer] = useState("X");

  // Holds the winner ('X' or 'O') if someone has won.
  const [winner, setWinner] = useState(null);

  // Keeps track of whether the game ended in a tie.
  const [isDraw, setIsDraw] = useState(false);

  // The message displayed above the board.
  const [message, setMessage] = useState("X turn");

  // This state tracks the overall scores. We use sessionStorage so that
  // if you refresh the page, the scores are remembered for the current session!
  const [scores, setScores] = useState({
    X: parseInt(sessionStorage.getItem("ttt_x_wins") || "0", 10),
    O: parseInt(sessionStorage.getItem("ttt_o_wins") || "0", 10),
    Draws: parseInt(sessionStorage.getItem("ttt_draws") || "0", 10),
  });

  // This function runs every time a user clicks one of the 9 cells.
  const handleClick = (index) => {
    // If the cell is already filled, or someone already won, or it's a draw, do nothing!
    if (board[index] || winner || isDraw) return;

    // Create a copy of the board array so we don't mutate the state directly (React rule).
    const newBoard = [...board];
    // Place the current player's piece ('X' or 'O') in the clicked cell.
    newBoard[index] = currentPlayer;
    setBoard(newBoard); // Update the state with the new board

    // Check if this newly placed piece caused the player to win
    const newWinner = calculateWinner(newBoard);

    if (newWinner) {
      // If there's a winner, update all our states to reflect the end of the game
      setWinner(newWinner);
      setMessage(`${newWinner} wins!`);

      // Update the scoreboard by adding 1 to the winner's score
      const newScores = { ...scores, [newWinner]: scores[newWinner] + 1 };
      setScores(newScores);

      // Save the new score into the browser's sessionStorage
      sessionStorage.setItem(
        `ttt_${newWinner.toLowerCase()}_wins`,
        newScores[newWinner].toString(),
      );

      // Special rule: If 'X' wins (treated as the user), we record it in the global
      // localStorage "gamesWon" tracker.
      if (newWinner === "X") {
        const currentWins = parseInt(
          localStorage.getItem("gamesWon") || "0",
          10,
        );
        localStorage.setItem("gamesWon", (currentWins + 1).toString());
      }
    } else if (!newBoard.includes(null)) {
      // If there's no winner, but there are no 'null' (empty) cells left, it's a draw!
      setIsDraw(true);
      setMessage("Draw!");
      const newScores = { ...scores, Draws: scores.Draws + 1 };
      setScores(newScores);
      sessionStorage.setItem("ttt_draws", newScores.Draws.toString());
    } else {
      // If no one won and the board isn't full, switch turns to the other player.
      const nextPlayer = currentPlayer === "X" ? "O" : "X";
      setCurrentPlayer(nextPlayer);
      setMessage(`${nextPlayer} turn`);
    }
  };

  // Resets the game back to its initial starting state
  const handleReset = () => {
    setBoard(Array(9).fill(null)); // Clear all 9 cells
    setCurrentPlayer("X"); // X always goes first
    setWinner(null);
    setIsDraw(false);
    setMessage("X turn");
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
      <h1 className="text-4xl font-bold tracking-tight text-primary">
        Tic Tac Toe
      </h1>

      <div className="text-2xl font-semibold mb-2">{message}</div>

      <div className="grid grid-cols-3 gap-2 bg-[#333] p-2 rounded-lg shadow-xl">
        {board.map((cell, i) => (
          <div
            key={i}
            onClick={() => handleClick(i)}
            className="w-24 h-24 bg-card hover:bg-muted flex items-center justify-center text-5xl font-bold cursor-pointer transition-colors rounded-md border border-[#333]"
          >
            <span
              className={
                cell === "X"
                  ? "text-blue-500"
                  : cell === "O"
                    ? "text-red-500"
                    : ""
              }
            >
              {cell}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-6 mt-4">
        <Button
          onClick={handleReset}
          variant="outline"
          className="w-[150px] font-bold"
        >
          Reset:
        </Button>

        <div className="flex gap-8 p-6 border rounded-xl bg-card shadow-sm">
          <div className="text-center">
            <div className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-1">
              X Wins
            </div>
            <div className="text-3xl font-black text-blue-500">{scores.X}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-1">
              O Wins
            </div>
            <div className="text-3xl font-black text-red-500">{scores.O}</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-1">
              Draws
            </div>
            <div className="text-3xl font-black">{scores.Draws}</div>
          </div>
        </div>
      </div>

      <Button
        onClick={handleDownload}
        className="fixed bottom-[60px] right-6 z-50"
      >
        Code for file
      </Button>
    </div>
  );
}
