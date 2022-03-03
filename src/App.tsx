import "./App.scss";
import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import Modal from "react-modal";
import Gameboard from "./components/Gameboard";
import Keyboard from "./components/Keyboard";
import WinMessage from "./components/WinMessage";
import StatsModal from "./components/StatsModal";
import RulesModal from "./components/RulesModal";
import OptionsModal from "./components/OptionsModal";
import { DarkModeContext } from "./contexts/DarkModeProvider";
import WORDS from "./words.json";

function App() {
  const DAILY_WORD = useRef("");
  const WORD_LENGTH = 5;
  const MAX_GUESSES = 6;
  const WIN_MESSAGE = [
    "Genius",
    "Magnificent",
    "Impressive",
    "Splendid",
    "Great",
    "Phew",
  ];
  const DEFAULT_STATS = {
    totalGames: 0,
    streak: 0,
    highestStreak: 0,
    losses: 0,
    guessDistribution: { one: 0, two: 0, three: 0, four: 0, five: 0, six: 0 },
  };
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const firstRender = useRef(false);

  const [zardleDay, setZardleDay] = useState(0);
  const [hardMode, setHardMode] = useState(false);
  const [board, setBoard] = useState(
    createDefaultBoard(WORD_LENGTH, MAX_GUESSES)
  );
  const [currentRow, setCurrentRow] = useState(0); // input row
  const [guesses, setGuesses] = useState<Array<string>>([]); // list of guesses
  const [currentGuess, setCurrentGuess] = useState(""); // current input
  const [isCurrentInputValid, setIsCurrentInputValid] = useState(true); // light up current row as red if false
  const [playShake, setPlayShake] = useState(false);
  const [enableWordCheck, setEnableWordCheck] = useState(true);
  const [enableInput, setEnableInput] = useState(true);
  const [playedAnimation, setPlayedAnimation] = useState(false);
  const [winMessage, setWinMessage] = useState("");
  const [showWinMessage, setShowWinMessage] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("stats");

  const [stats, setStats] = useState<{
    totalGames: number;
    streak: number;
    highestStreak: number;
    losses: number;
    guessDistribution: { [key: string]: number };
  }>(DEFAULT_STATS);
  const [playedToday, setPlayedToday] = useState(false);
  const [won, setWon] = useState<boolean | null>(null);
  const [backspacing, setBackspacing] = useState(false);

  async function fetchdailyWord() {
    await new Promise((resolve) => setTimeout(resolve, 100));
    setZardleDay(72);
    DAILY_WORD.current = "react";
  }

  function countLetter(word: string, letter: string) {
    return word.split("").filter((l) => l === letter).length;
  }

  function calcWinRate(losses: number, total: number) {
    if (total === 0) return 0;
    let percentage = ((total - losses) / total) * 100;
    return Math.round(percentage);
  }

  function importData(str: string) {
    if (str.length === 0) return;
    const data = JSON.parse(str);
    for (let key in data) {
      data[key] = JSON.parse(data[key]);
    }
    loadGame(data, true);
    closeModal();
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
        switch (true) {
          case tile.color === "green":
            square = "🟩";
            break;
          case tile.color === "yellow":
            square = "🟨";
            break;
          case tile.color === "gray" && darkMode:
            square = "⬛";
            break;
          default:
            square = "⬜";
            break;
        }
        rowSquares = rowSquares.concat(square);
      });
      if (rowIndex !== coloredBoard.length - 1)
        rowSquares = rowSquares.concat("\n"); // don't add newline at the last row
      squares = squares.concat(rowSquares);
    });
    let text = `Zardle ${zardleDay} ${attempts}/${MAX_GUESSES}\n\n${squares}`;
    navigator.clipboard.writeText(text);
  }

  function copyDataClipboard() {
    navigator.clipboard.writeText(JSON.stringify(localStorage));
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
    const board = createDefaultBoard(WORD_LENGTH, MAX_GUESSES);
    setBoard(board);
    setCurrentRow(0);
    setCurrentGuess("");
    setGuesses([]);
    setPlayedAnimation(false);
    setWon(null);
    setPlayedToday(false);
    setEnableInput(true);
    setShowWinMessage(false);
  }

  function resetStats() {
    setStats({
      totalGames: 0,
      streak: 0,
      highestStreak: 0,
      losses: 0,
      guessDistribution: { one: 0, two: 0, three: 0, four: 0, five: 0, six: 0 },
    });
  }

  function resetData() {
    if (
      window.confirm(
        "Are you sure you want to reset? You will lose all your stats!"
      )
    ) {
      localStorage.clear();
      resetBoard();
      resetStats();
      closeModal();
    }
  }

  function loadGame(storage: Storage, importing: boolean = false) {
    let data: { [key: string]: any } = {};
    if (!importing) {
      // typescript doesn't seem to understand localstorage so it has to be written this way
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key) data[key] = JSON.parse(storage.getItem(key) || "{}");
      }
    } else {
      data = storage;
    }
    if (Object.keys(data).length === 0) return;
    setBoard(data.board || createDefaultBoard(WORD_LENGTH, MAX_GUESSES));
    setGuesses(data.guesses || []);
    setPlayedToday(data.playedToday || false);
    setWon(didGameEnd(data.guesses || []));
    setCurrentRow(data.guesses.length || 0);
    setStats(data.stats || DEFAULT_STATS);
    setPlayedAnimation(data.playedAnimation || false);
    setEnableWordCheck(data.enableWordCheck || false);
    setDarkMode(data.darkMode || false);
    setHardMode(data.hardMode || false);
    if (data.playedToday) setEnableInput(false);
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
      if (input.length < WORD_LENGTH) setCurrentGuess(input.concat("", key));
    } else {
      setBackspacing(true);
    }
    if (key === "backspace" || key === "delete") {
      // delete letter
      setCurrentGuess(input.slice(0, -1));
    } else if (key === "enter" && input.length === WORD_LENGTH) {
      // submit
      handleSubmit();
    }
  }

  function validateWord(word: string) {
    return WORDS.VALID_WORDS.includes(word);
  }

  function handleSubmit() {
    if (playedToday || !enableInput) return;
    const isValid = validateWord(currentGuess);
    if (!isValid) {
      setIsCurrentInputValid(false);
      setPlayShake(true);
      setTimeout(() => setPlayShake(false), 1000);
      return;
    }
    setIsCurrentInputValid(true);
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
    saveGame();
    handleGameEnd(didGameEnd(guesses));
  }

  function setCurrentRowColors() {
    let newBoard = board;
    let yellowArr: Array<{ symbol: string; index: number }> = [];
    let greenArr: Array<{ symbol: string; index: number }> = [];

    newBoard[currentRow].forEach((tile, index) => {
      const letter = tile.symbol;
      if (letter.length === 0) return;
      // assign letters to colored array
      if (letter === DAILY_WORD.current[index]) {
        greenArr.push({ symbol: letter, index: index });
      } else if (DAILY_WORD.current.includes(letter)) {
        // skip if already in array
        if (yellowArr.some((y) => y.symbol === letter && y.index === index))
          return;
        // yellows should not exceed max occurrences of a letter
        if (
          yellowArr.filter((y) => y.symbol === letter).length +
            greenArr.filter((g) => g.symbol === letter).length >=
          countLetter(DAILY_WORD.current, letter)
        )
          return;
        yellowArr.push({ symbol: letter, index: index });
      }
      // remove previous yellows if all greens are found later in input
      // e.g. for "APPLE", the first P in "PPP__" will flip back to gray after 3rd input
      if (
        greenArr.filter((g) => g.symbol === letter).length ===
        countLetter(DAILY_WORD.current, letter)
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

  function didGameEnd(guessArr: Array<string>) {
    const lastGuess = guessArr[guessArr.length - 1];
    if (lastGuess === DAILY_WORD.current) {
      return true;
    } else if (guessArr.length >= MAX_GUESSES) {
      return false;
    } else {
      return null;
    }
  }

  function handleGameEnd(win: boolean | null) {
    if (win === null) return;
    let tempStats = stats;
    if (win) {
      let dist = stats.guessDistribution;
      dist[Object.keys(dist)[guesses.length - 1]] += 1;
      tempStats.guessDistribution = dist;
      tempStats.streak += 1;
      setWinMessage(WIN_MESSAGE[guesses.length - 1]);
    } else {
      tempStats.losses += 1;
      tempStats.streak = 0;
      setWinMessage(`"${DAILY_WORD.current.toUpperCase()}"`);
    }
    tempStats.totalGames = stats.totalGames + 1;
    setStats(tempStats);
    setWon(win);
    setPlayedToday(true);
    setEnableInput(false);
    setTimeout(() => {
      setShowWinMessage(true);
    }, 1400);
    setTimeout(() => {
      openModal("stats");
    }, 3000);
  }

  function saveGame() {
    localStorage.setItem("board", JSON.stringify(board));
    localStorage.setItem("guesses", JSON.stringify(guesses));
    localStorage.setItem("stats", JSON.stringify(stats));
    localStorage.setItem("playedToday", JSON.stringify(playedToday));
    localStorage.setItem("playedAnimation", JSON.stringify(playedAnimation));
    localStorage.setItem("enableWordCheck", JSON.stringify(enableWordCheck));
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("hardMode", JSON.stringify(darkMode));
  }

  Modal.setAppElement("#root");

  function openModal(type: string) {
    setModalType(type);
    setIsOpen(true);
    setShowWinMessage(false);
    setEnableInput(false);
  }

  function closeModal() {
    setIsOpen(false);
    setEnableInput(true);
  }

  useEffect(() => {
    fetchdailyWord();
  }, []);

  useEffect(() => {
    if (!firstRender.current) return; // DO NOT RUN ON MOUNT
    const day = JSON.parse(localStorage.getItem("zardleDay") || "{}");
    if (zardleDay !== day) {
      localStorage.setItem("zardleDay", JSON.stringify(zardleDay));
      resetBoard();
      saveGame();
    } else {
      if (DAILY_WORD.current !== "") loadGame(localStorage);
    }
  }, [DAILY_WORD.current, zardleDay]);

  useEffect(() => {
    if (stats.streak > stats.highestStreak) {
      let tempStats = stats;
      tempStats.highestStreak = stats.streak;
      setStats(tempStats);
    }
  }, [stats.streak]);

  useEffect(() => {
    if (firstRender.current) saveGame();
    firstRender.current = true;
  }, [
    board,
    guesses,
    stats,
    playedToday,
    playedAnimation,
    enableWordCheck,
    darkMode,
  ]);

  useEffect(() => {
    if (currentGuess.length < WORD_LENGTH) {
      setIsCurrentInputValid(true);
      return;
    }
    const isValid = validateWord(currentGuess);
    setIsCurrentInputValid(isValid);
  }, [currentGuess]);

  // useEffect(() => {
  //   if (!firstRender.current) return;
  //   if (darkMode) {
  //     document.body.classList.add("--dark-mode");
  //   } else {
  //     document.body.classList.remove("--dark-mode");
  //   }
  // }, [darkMode]);

  const modalStyle = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    content: {
      // top: "50%",
      // left: "50%",
      // right: "auto",
      // bottom: "auto",
      // transform: "translate(-50%, -50%)",
      width: "500px",
      height: "fit-content",
      margin: "auto",
      padding: "0",
      border: "0",
    },
  };

  let modal;
  switch (modalType) {
    case "stats":
      modal = (
        <StatsModal
          won={won}
          guesses={guesses}
          stats={stats}
          winRate={calcWinRate(stats.losses, stats.totalGames)}
          share={copyResultsClipboard}
          closeModal={closeModal}
        />
      );
      break;
    case "rules":
      modal = <RulesModal closeModal={closeModal} />;
      break;
    case "options":
      modal = (
        <OptionsModal
          hardMode={hardMode}
          setHardMode={setHardMode}
          enableWordCheck={enableWordCheck}
          setEnableWordCheck={setEnableWordCheck}
          copyDataClipboard={copyDataClipboard}
          importData={importData}
          resetData={resetData}
          closeModal={closeModal}
        />
      );
      break;
    default:
      modal = <div></div>;
  }

  return (
    <div
      className={`App${darkMode ? " --dark-mode" : ""}`}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="nav-bar">
        <div className="nav-btn-container-left">
          <button
            className={`nav-btn${darkMode ? " --nav-btn-dark-mode" : ""}`}
            onClick={() => openModal("rules")}
          >
            <i className="fa-regular fa-circle-question"></i>
          </button>
        </div>
        <div className={`title${darkMode ? " --title-dark-mode" : ""}`}>
          Zardle
        </div>
        <div className="nav-btn-container-right">
          <button onClick={resetBoard}>Reset</button>
          <button
            className={`nav-btn${darkMode ? " --nav-btn-dark-mode" : ""}`}
            onClick={() => openModal("stats")}
          >
            <i className="fa-solid fa-chart-column" />
          </button>
          <button
            className={`nav-btn${darkMode ? " --nav-btn-dark-mode" : ""}`}
            onClick={() => openModal("options")}
          >
            <i className="fa-solid fa-gear" />
          </button>
        </div>
      </div>
      {DAILY_WORD.current}
      {zardleDay}

      <div className={`game${darkMode ? " --dark-mode" : ""}`}>
        <WinMessage visible={showWinMessage} message={winMessage}></WinMessage>
        <Gameboard
          board={board}
          WORD_LENGTH={WORD_LENGTH}
          currentGuess={currentGuess}
          enableWordCheck={enableWordCheck}
          isCurrentInputValid={isCurrentInputValid}
          currentRow={currentRow}
          backspacing={backspacing}
          playShake={playShake}
          playedAnimation={playedAnimation}
          setPlayedAnimation={setPlayedAnimation}
        />
        <Keyboard
          lastRow={board[currentRow - 1]}
          handleKeyDown={handleKeyDown}
          guesses={guesses}
        />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Statistics"
        style={modalStyle}
        closeTimeoutMS={145}
        className={`${darkMode ? "--modal-dark-mode" : ""}`}
      >
        {modal}
      </Modal>
    </div>
  );
}

export default App;
