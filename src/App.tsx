import "./App.css";
import React, { useState, useEffect } from "react";
import Gameboard from "./components/Gameboard";
import Keyboard from "./components/Keyboard";
import { IncomingMessage } from "http";

function App() {
  const [wordLength, setWordLength] = useState(5);
  const [maxGuesses, setMaxGuesses] = useState(6);
  const [board, setBoard] = useState(
    createDefaultBoard(wordLength, maxGuesses)
  );
  const [guesses, setGuesses] = useState<Array<string>>([]);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentGuess, setCurrentGuess] = useState("");
  const [streak, setStreak] = useState(0);
  const [isCurrentGuessInvalid, setIsCurrentGuessInvalid] = useState(false); // light up red if true
  const [modalIsOpen, setIsOpen] = useState(false);
  const [dailyWord, setDailyWord] = useState("penis");
  const [playedToday, setPlayedToday] = useState(false);

  function createDefaultBoard(
    columns: number,
    rows: number
  ): Array<Array<string>> {
    const arr = [];
    const row = Array.apply(null, Array(columns));
    const rowOfEmptyStrings = row.map(() => "");
    for (var i = 0; i < rows; i++) {
      arr.push(rowOfEmptyStrings);
    }
    return arr;
  }

  function handleSubmit() {
    if (isCurrentGuessInvalid) return;
    const letters = currentGuess.split("");
    const newBoard = board;
    const newRow = board[currentRow].map((_, index) => letters[index]);
    newBoard[currentRow] = newRow;
    setBoard(newBoard);
    setCurrentRow(currentRow + 1);
    setCurrentGuess("");
    console.log(newBoard);
  }

  function handleKeyDown(e: any) {
    if (playedToday) return;
    const key = e.key.toUpperCase();
    const regex = /^[A-Z]a{0,1}$/;
    const input = currentGuess;
    // check if key pressed is a-z/A-Z/backspace/delete
    if (key.match(regex)) {
      // add letter
      if (input.length < wordLength) setCurrentGuess(input.concat("", key));
    } else if (key === "BACKSPACE" || key === "DELETE") {
      // delete letter
      setCurrentGuess(input.slice(0, -1));
    } else if (key === "ENTER" && input.length === wordLength) {
      // submit
      const g = guesses;
      g.push(currentGuess);
      setGuesses(g);
      handleSubmit();
    }
  }

  return (
    <div className="App" onKeyDown={handleKeyDown} tabIndex={-1}>
      <Gameboard board={board} />
      {currentGuess}
      <Keyboard />
    </div>
  );
}

export default App;
