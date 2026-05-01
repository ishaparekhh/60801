import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";

export default function Dashboard() {
  const [wins, setWins] = useState(null);

  // useEffect to fetch initial score from LocalStorage
  useEffect(() => {
    const storedWins = localStorage.getItem("gamesWon");
    if (storedWins !== null) {
      setWins(parseInt(storedWins, 10));
    } else {
      fetchInitialScore();
    }
  }, []);

  // Fetch initial score from JSON link and set to LocalStorage
  const fetchInitialScore = async () => {
    try {
      const response = await fetch(
        "https://cgi.cse.unsw.edu.au/~cs6080/raw/data/info.json",
      );
      const data = await response.json();
      setWins(data.score);
      localStorage.setItem("gamesWon", data.score.toString());
    } catch (error) {
      console.error("Failed to fetch default score", error);
    }
  };

  // Reset Handler - Resets score in localStorage
  const handleReset = () => {
    setWins(null);
    localStorage.removeItem("gamesWon");
    fetchInitialScore();
  };
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
      {/* Greeting text */}
      <h1 className="text-[#1e4ed8] text-[2em]">
        Please choose an option from the navbar.
      </h1>
      {/* Games Won and Reset Bar */}
      <div className="flex items-center gap-8 text-l">
        <span>Games won: {wins !== null ? wins : "..."}</span>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
