import "./App.css";
import React, { useState, useEffect } from "react";
import Gameboard from "./components/Gameboard";
import Keyboard from "./components/Keyboard";
import WORDS from "./words.json";

// if word only has one instance of a letter, make sure that other copies of the letter dont turn yellow
// im thinking we should turn board into an array of objects with letter+color so that we can pass down the color to keyboard

function App() {
  const [wordLength, setWordLength] = useState(5);
  const [dailyWord, setDailyWord] = useState("apple");
  const [maxGuesses, setMaxGuesses] = useState(6);

  const [board, setBoard] = useState(
    createDefaultBoard(wordLength, maxGuesses)
  );
  const [currentRow, setCurrentRow] = useState(0); // input row

  const [guesses, setGuesses] = useState<Array<string>>([]); // list of guesses
  const [currentGuess, setCurrentGuess] = useState(""); // current input
  const [isCurrentGuessInvalid, setIsCurrentGuessInvalid] = useState(false); // light up current row as red if true
  const [enableValidation, setEnableValidation] = useState(true);
  const [yellowLetters, setYellowLetters] = useState([]);
  const [greenLetters, setGreenLetters] = useState([]);

  const [modalIsOpen, setIsOpen] = useState(false);

  const [streak, setStreak] = useState(0);
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
    // gameboard: [ ["",...,""],["",...,""],["",...,""] ]
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
      {currentGuess}
      <Gameboard
        board={board}
        dailyWord={dailyWord}
        currentRow={currentRow}
        yellowLetters={yellowLetters}
        greenLetters={greenLetters}
      />
      <Keyboard board={board} />
    </div>
  );
}

export default App;
