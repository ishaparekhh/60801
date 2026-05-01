import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export const strings = [
  "the fat cats",
  "larger frogs",
  "banana cakes",
  "unsw vs usyd",
  "french toast",
  "hawaii pizza",
  "barack obama",
];

export default function Blanko() {
  const [targetStr, setTargetStr] = useState("");
  const [missingIndices, setMissingIndices] = useState([]);

  const [inputs, setInputs] = useState({});

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([rawCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "Blanko.jsx";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const initGame = () => {
    // Pick a random string
    const randomStr = strings[Math.floor(Math.random() * strings.length)];
    setTargetStr(randomStr);

    // Checking all the valid indices that are not blanks in the string
    const validIndices = [];
    for (let i = 0; i < randomStr.length; i++) {
      if (randomStr[i] !== " ") {
        validIndices.push(i);
      }
    }

    const chosen = [];
    while (chosen.length < 3) {
      const randIndex =
        validIndices[Math.floor(Math.random() * validIndices.length)];
      if (!chosen.includes(randIndex)) {
        chosen.push(randIndex);
      }
    }

    setMissingIndices(chosen);
    setInputs({});
  };

  // Run initGame once when the page loads
  useEffect(() => {
    initGame();
  }, []);

  const handleInputChange = (e, index) => {
    const val = e.target.value.toLowerCase();
    if (val.length > 1) return;
    const newInputs = { ...inputs, [index]: val };
    setInputs(newInputs);
    checkWinCondition(newInputs);
  };

  const checkWinCondition = (currentInputs) => {
    // Check if exactly 3 boxes have been filled
    const filledKeys = Object.keys(currentInputs).filter(
      (k) => currentInputs[parseInt(k)] !== "",
    );
    if (filledKeys.length !== 3) return false;

    // Check if all 3 filled boxes are correct
    let allCorrect = true;
    for (const index of missingIndices) {
      if (currentInputs[index] !== targetStr[index]) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      // Small timeout allows the final character to be seen before we render an alert that freezes the screen.
      setTimeout(() => {
        alert("Correct!");
        const currentWins = parseInt(
          localStorage.getItem("gamesWon") || "0",
          10,
        );
        localStorage.setItem("gamesWon", (currentWins + 1).toString());
        initGame();
      }, 100);
    }
  };

  // Wait until useEffect has picked a new string
  if (!targetStr) return null;
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-12">
      {/* 12 Boxes */}
      <div className="flex justify-center gap-2">
        {targetStr.split("").map((char, i) => {
          const isMissing = missingIndices.includes(i);

          if (isMissing) {
            return (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={inputs[i] || ""}
                onChange={(e) => handleInputChange(e, i)}
                className="w-12 h-12 text-center text-2xl uppercase font-bold bg-card border-2 border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              />
            );
          }

          return (
            <div
              key={i}
              className={`w-12 h-12 flex items-center justify-center text-2xl font-bold rounded-md uppercase ${
                char === " "
                  ? "bg-transparent"
                  : "bg-card border border-border shadow-sm text-foreground"
              }`}
            >
              {char}
            </div>
          );
        })}
      </div>

      {/* Reset Button */}
      <Button onClick={initGame} variant="default" className="w-[200px]">
        Reset
      </Button>
      <Button
        onClick={handleDownload}
        className="fixed bottom-[60px] right-6 z-50"
      >
        Code for file
      </Button>
    </div>
  );
}
