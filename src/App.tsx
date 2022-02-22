import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Gameboard from "./components/Gameboard";
import Keyboard from "./components/Keyboard";
import WORDS from "./words.json";
import LetterSlot from "./components/LetterSlot";

// if word only has one instance of a letter, make sure that other copies of the letter dont turn yellow
// im thinking we should turn board into an array of objects with letter+color so that we can pass down the color to keyboard

function App() {
  const [wordLength, setWordLength] = useState(5);
  const [maxGuesses, setMaxGuesses] = useState(6);
  const [dailyWord, setDailyWord] = useState("");

  const [board, setBoard] = useState(
    createDefaultBoard(wordLength, maxGuesses)
  );
  const [currentRow, setCurrentRow] = useState(0); // input row

  const [guesses, setGuesses] = useState<Array<string>>([]); // list of guesses
  const [currentGuess, setCurrentGuess] = useState(""); // current input
  const [isCurrentGuessInvalid, setIsCurrentGuessInvalid] = useState(false); // light up current row as red if true
  const [enableValidation, setEnableValidation] = useState(true);
  const [enableInput, setEnableInput] = useState(true);
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
  }

  function handleKeyDown(e: any, symbol: string = "") {
    if (playedToday || !enableInput) return;
    const key = symbol.toLowerCase() || e.key.toLowerCase(); //in-app keyboard or actual keyboard
    const regex = /^[a-z]a{0,1}$/;
    const input = currentGuess.toLowerCase();
    // check if key pressed is a-z/A-Z/backspace/delete
    if (key.match(regex)) {
      // add letter
      if (input.length < wordLength) setCurrentGuess(input.concat("", key));
    } else if (key === "backspace" || key === "delete") {
      // delete letter
      setCurrentGuess(input.slice(0, -1));
    } else if (key === "enter" && input.length === wordLength) {
      // submit
      const g = guesses;
      g.push(currentGuess);
      setGuesses(g);
      handleSubmit();
    }
  }

  async function fetchDailyWord() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDailyWord("apple");
  }

  useEffect(() => {
    fetchDailyWord();
  }, []);

  return (
    <div className="App" onKeyDown={handleKeyDown} tabIndex={-1}>
      <Gameboard
        board={board}
        wordLength={wordLength}
        dailyWord={dailyWord}
        currentGuess={currentGuess}
        currentRow={currentRow}
      />
      <Keyboard
        handleKeyDown={handleKeyDown}
        dailyWord={dailyWord}
        lastGuess={guesses[guesses.length - 1]}
      />
    </div>
  );
}

export default App;
