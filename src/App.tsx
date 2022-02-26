import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Gameboard from "./components/Gameboard";
import Keyboard from "./components/Keyboard";
import WORDS from "./words.json";

function App() {
  const WIN_MESSAGE = [
    "Genius",
    "Magnificent",
    "Impressive",
    "Splendid",
    "Great",
    "Phew",
  ];
  const [wordLength, setWordLength] = useState(5);
  const [maxGuesses, setMaxGuesses] = useState(6);
  const [dailyWord, setDailyWord] = useState("");
  const [zardleDay, setZardleDay] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const [board, setBoard] = useState(
    createDefaultBoard(wordLength, maxGuesses)
  );
  const [currentRow, setCurrentRow] = useState(0); // input row

  const [guesses, setGuesses] = useState<Array<string>>([]); // list of guesses
  const [currentGuess, setCurrentGuess] = useState(""); // current input
  const [isCurrentGuessInvalid, setIsCurrentGuessInvalid] = useState(false); // light up current row as red if true
  const [enableWordCheck, setEnableWordCheck] = useState(true);
  const [enableInput, setEnableInput] = useState(true);
  const [animationDone, setAnimationDone] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  const [streak, setStreak] = useState(0);
  const [playedToday, setPlayedToday] = useState(false);
  const [won, setWon] = useState<boolean | null>(null);

  const [backspacing, setBackspacing] = useState(false);

  async function fetchDailyWord() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setDailyWord("apple");
    setZardleDay(69);
  }

  function countLetter(word: string, letter: string) {
    return word.split("").filter((l) => l === letter).length;
  }

  function copyResultsClipboard() {
    if (!playedToday) return;
    let squares = "";
    const attempts = won ? guesses.length.toString() : "X";
    const coloredBoard = board.filter((row) =>
      row.some((tile) => tile.color !== "")
    );
    coloredBoard.forEach((row, rowIndex) => {
      let rowSquares = "";
      row.forEach((tile) => {
        let square = "";
        switch (tile.color) {
          case "green":
            square = "🟩";
            break;
          case "yellow":
            square = "🟨";
            break;
          case "gray":
            square = "⬜";
            break;
        }
        rowSquares = rowSquares.concat(square);
      });
      if (rowIndex !== coloredBoard.length - 1)
        rowSquares = rowSquares.concat("\n"); // don't add newline at the last row
      squares = squares.concat(rowSquares);
    });
    let text = `Zardle ${zardleDay} ${attempts}/${maxGuesses}\n\n${squares}`;
    navigator.clipboard.writeText(text);
  }

  function createDefaultBoard(
    columns: number,
    rows: number
  ): Array<Array<{ symbol: string; color: string }>> {
    const arr = [];
    const row = Array.apply(null, Array(columns));
    const rowOfEmptyObjs = row.map(() => ({ symbol: "", color: "" }));
    for (var i = 0; i < rows; i++) {
      arr.push(rowOfEmptyObjs);
    }
    return arr;
    // gameboard: [ [{}, ... ,{}], ..., [{}, ... ,{}] ]
  }

  function resetBoard() {
    const board = createDefaultBoard(wordLength, maxGuesses);
    setBoard(board);
    setCurrentRow(0);
    setCurrentGuess("");
    setGuesses([]);
    setAnimationDone(false);
    setStreak(0);
    setWon(null);
    setPlayedToday(false);
    setEnableInput(true);
    localStorage.clear();
  }

  function handleKeyDown(e: any, symbol: string = "") {
    if (playedToday || !enableInput) return;
    const key = symbol.toLowerCase() || e.key.toLowerCase(); //in-app keyboard or actual keyboard
    const regex = /^[a-z]a{0,1}$/;
    const input = currentGuess.toLowerCase();
    setBackspacing(false);
    // check if key pressed is a-z/A-Z/backspace/delete
    if (key.match(regex)) {
      // add letter
      if (input.length < wordLength) setCurrentGuess(input.concat("", key));
    } else if (key === "backspace" || key === "delete") {
      // delete letter
      if (key === "backspace") setBackspacing(true);
      setCurrentGuess(input.slice(0, -1));
    } else if (key === "enter" && input.length === wordLength) {
      // submit
      handleSubmit();
    }
  }

  function saveGame() {
    localStorage.setItem("board", JSON.stringify(board));
    localStorage.setItem("guesses", JSON.stringify(guesses));
    localStorage.setItem("streak", JSON.stringify(streak));
    localStorage.setItem("playedToday", JSON.stringify(playedToday));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }

  function loadGame() {
    let data: { [key: string]: any } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) data[key] = JSON.parse(localStorage.getItem(key) || "{}");
    }
    if (Object.keys(data).length === 0) return;
    setBoard(data.board);
    setGuesses(data.guesses);
    setStreak(data.streak);
    setPlayedToday(data.playedToday);
    setDarkMode(data.darkMode);
    if (data.playedToday) setEnableInput(false);
    setCurrentRow(data.guesses.length);
  }

  function didGameEnd() {
    const lastGuess = guesses[guesses.length - 1];
    if (lastGuess === dailyWord) {
      return true;
    } else if (guesses.length >= maxGuesses) {
      return false;
    } else {
      return null;
    }
  }

  function handleGameEnd(win: boolean | null) {
    if (win === null) return;
    if (win) {
      setWon(true);
      setStreak(streak + 1);
    } else {
      setWon(false);
      setStreak(0);
    }
    setPlayedToday(true);
    setEnableInput(false);
  }

  function handleSubmit() {
    if (isCurrentGuessInvalid || playedToday || !enableInput) return;
    const g = guesses;
    g.push(currentGuess);
    setGuesses(g);

    const letters = currentGuess.split("");
    const newBoard = board;
    const newRow = board[currentRow].map((_, index) => ({
      symbol: letters[index],
      color: "",
    }));
    newBoard[currentRow] = newRow;
    setBoard(newBoard);
    setCurrentRowColors();
    setCurrentRow(currentRow + 1);
    setCurrentGuess("");
    handleGameEnd(didGameEnd());
  }

  function setCurrentRowColors() {
    let newBoard = board;
    let yellowArr: Array<{ symbol: string; index: number }> = [];
    let greenArr: Array<{ symbol: string; index: number }> = [];

    newBoard[currentRow].forEach((tile, index) => {
      const letter = tile.symbol;
      if (letter.length === 0) return;
      // assign letters to colored array
      if (letter === dailyWord[index]) {
        greenArr.push({ symbol: letter, index: index });
      } else if (dailyWord.includes(letter)) {
        // skip if already in array
        if (yellowArr.some((y) => y.symbol === letter && y.index === index))
          return;
        // yellows should not exceed max occurrences of a letter
        if (
          yellowArr.filter((y) => y.symbol === letter).length +
            greenArr.filter((g) => g.symbol === letter).length >=
          countLetter(dailyWord, letter)
        )
          return;
        yellowArr.push({ symbol: letter, index: index });
      }
      // remove previous yellows if all greens are found later in input
      // e.g. for "APPLE", the first P in "PPP__" will flip back to gray after 3rd input
      if (
        greenArr.filter((g) => g.symbol === letter).length ===
        countLetter(dailyWord, letter)
      )
        yellowArr = yellowArr.filter((y) => y.symbol !== letter);
    });

    // actually change colors
    newBoard[currentRow].forEach((tile, index) => {
      if (yellowArr.some((y) => y.index === index)) {
        tile.color = "yellow";
      } else if (greenArr.some((g) => g.index === index)) {
        tile.color = "green";
      } else {
        tile.color = "gray";
      }
    });
    setBoard(newBoard);
  }

  useEffect(() => {
    fetchDailyWord();
    loadGame();
  }, []);

  useEffect(() => {
    // async my detested
    saveGame();
  }, [board, guesses, streak, playedToday, darkMode]);

  return (
    <div className="App" onKeyDown={handleKeyDown} tabIndex={-1}>
      <span>
        <button onClick={resetBoard}>Reset</button>
        <button onClick={copyResultsClipboard}>Share</button>
      </span>

      <Gameboard
        board={board}
        wordLength={wordLength}
        currentGuess={currentGuess}
        currentRow={currentRow}
        backspacing={backspacing}
        setAnimationDone={setAnimationDone}
      />
      <Keyboard
        lastRow={board[currentRow - 1]}
        handleKeyDown={handleKeyDown}
        guesses={guesses}
      />
    </div>
  );
}

export default App;