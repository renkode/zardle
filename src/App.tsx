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
  const [duplicateLetters, setDuplicateLetters] = useState<
    Array<{ symbol: string; indices: Array<number> }>
  >([]);

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

  // goal is to grab duplicate letters and their respective indices
  // so that i can evaluate whether a slot on the board is yellow or green
  function getDuplicateLetters(word: string) {
    const wordArr = word.split("");
    let dupes: string[] = [];

    wordArr.forEach((char) => {
      if (dupes.includes(char)) return;
      let indices: number[] = [];
      let count = wordArr.filter((letter) => letter === char).length;

      if (count > 1) {
        dupes.push(char);
        // get indices of all recurring letters
        wordArr.forEach((letter, index) => {
          if (letter === char) indices.push(index);
        });
        setDuplicateLetters([
          ...duplicateLetters,
          { symbol: char, indices: indices },
        ]);
      }
    });
  }

  async function fetchDailyWord() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDailyWord("apple");
    getDuplicateLetters("apple");
  }

  useEffect(() => {
    fetchDailyWord();
  }, []);

  return (
    <div className="App" onKeyDown={handleKeyDown} tabIndex={-1}>
      {currentGuess}
      <Gameboard
        board={board}
        dailyWord={dailyWord}
        currentRow={currentRow}
        duplicateLetters={duplicateLetters}
      />
      <Keyboard board={board} />
    </div>
  );
}

export default App;
