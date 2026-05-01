import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import rawCode from "./Matcho.jsx?raw";

import p1 from "../../assets/matcho/match-1.svg";
import p2 from "../../assets/matcho/match-2.svg";
import p3 from "../../assets/matcho/match-3.svg";
import p4 from "../../assets/matcho/match-4.svg";
import p5 from "../../assets/matcho/match-5.svg";
import p6 from "../../assets/matcho/match-6.svg";

const IMAGES = {
  1: p1,
  2: p2,
  3: p3,
  4: p4,
  5: p5,
  6: p6,
};

const CARDS = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6];

export default function Matcho() {
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([rawCode], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "Matcho.jsx";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const [cards, setCards] = useState([]);
  // flipped card array less equal to 2
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);

  const startNewGame = () => {
    // make a copy of the cards
    const newCards = [...CARDS];

    // shuffle them in a random order
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]]; // Swap elements
    }

    setCards(newCards);
    setMatchedCards([]);
    setFlippedCards([]);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  const handleReset = () => {
    setMatchedCards([]);
    setFlippedCards([]);
    startNewGame();
  };

  // Whenever matchedCards changes, check if we have won
  useEffect(() => {
    // Make sure we have cards, and all of them are matched!
    if (cards.length > 0 && matchedCards.length === cards.length) {
      // Wait 100ms so React has time to flip the final card face-up visually
      setTimeout(() => {
        alert("Correct!");
        const currentWins = parseInt(
          localStorage.getItem("gamesWon") || "0",
          10,
        );
        localStorage.setItem("gamesWon", (currentWins + 1).toString());

        // Reset the game AFTER the user clicks OK on the alert
        setMatchedCards([]);
        setFlippedCards([]);
        startNewGame();
      }, 100);
    }
  }, [matchedCards, cards.length]);

  const handleFlipCard = (index) => {
    if (
      flippedCards.includes(index) ||
      matchedCards.includes(index) ||
      flippedCards.length === 2
    )
      return;

    // Adding the flipped card to the flipped cards
    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    // if two cards are flipped, check if they match
    if (newFlippedCards.length === 2) {
      const [firstCard, secondCard] = newFlippedCards;
      if (cards[firstCard] === cards[secondCard]) {
        setMatchedCards([...matchedCards, firstCard, secondCard]);
        setFlippedCards([]);
      } else {
        // if not matched, clear the flipped cards after 1 second
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const handlePeek = () => {
    const allIndices = cards.map((_, index) => index);
    setFlippedCards(allIndices);
    setTimeout(() => {
      setFlippedCards([]);
    }, 1000);
  };

  if (cards.length === 0) return null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 focus:outline-none">
      <div className="grid grid-cols-4 gap-2 border border-[#333333] select-none bg-[#333]">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleFlipCard(index)}
            className="w-[110px] h-[110px] flex items-center justify-center rounded-md cursor-pointer bg-card border-[1px] border-[#333333] shadow-sm text-foreground"
          >
            {/* If the card is flipped, show the card */}
            {flippedCards.includes(index) ? (
              <img
                src={IMAGES[card]}
                alt={`card ${card}`}
                className="w-full h-full object-cover"
              />
            ) : matchedCards.includes(index) ? (
              <img
                src={IMAGES[card]}
                alt={`card ${card}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full object-cover cursor-pointer rounded-md bg-slate-400"></div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between w-[450px]">
        {/* Solved button */}
        <Button onClick={handlePeek} variant="default" className="w-[150px]">
          Peek:
        </Button>

        {/* Reset Button */}
        <Button onClick={handleReset} variant="outline" className="w-[150px]">
          Reset:
        </Button>
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
