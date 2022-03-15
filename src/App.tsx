import "./App.scss";
import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import Modal from "react-modal";
import Gameboard from "./components/Gameboard";
import Keyboard from "./components/Keyboard";
import Message from "./components/Message";
import StatsModal from "./components/StatsModal";
import RulesModal from "./components/RulesModal";
import OptionsModal from "./components/OptionsModal";
import { DarkModeContext } from "./contexts/DarkModeProvider";
import { PaletteContext } from "./contexts/PaletteProvider";
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
  const { palette, setPalette } = useContext(PaletteContext);

  const firstRender = useRef(false);
  const appRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const [zardleDay, setZardleDay] = useState(1);
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
  const [enableInput, setEnableInput] = useState(false);
  const [playedAnimation, setPlayedAnimation] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
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

  //=======================================================================

  async function fetchDailyWord() {
    try {
      //const res = { data: { day: 1, dailyWord: "react" } };
      const res = await axios.get("https://zardle.renkode.workers.dev");
      let responseOK = res && res.status === 200;
      if (responseOK) {
        DAILY_WORD.current = res.data.dailyWord;
        const day = JSON.parse(localStorage.getItem("zardleDay") || "{}");
        if (day !== res.data.day) {
          localStorage.setItem("zardleDay", JSON.stringify(res.data.day));
          setZardleDay(res.data.day);
          loadMiscSettings();
          resetBoard();
        } else {
          setZardleDay(day);
        }
        loadGame(localStorage);
      } else {
        throw new Error("Fetch failed");
      }
    } catch (err) {
      console.log(err);
      displayMessage("Error occurred, please refresh", 0);
    }
  }

  function countLetter(word: string, letter: string) {
    return word.split("").filter((l) => l === letter).length;
  }

  function calcWinRate(losses: number, total: number) {
    if (total === 0) return 0;
    let percentage = ((total - losses) / total) * 100;
    return Math.round(percentage);
  }

  function displayMessage(message: string, duration: number) {
    if (messageRef.current)
      messageRef.current.classList.remove("message--fade");
    setMessage(message);
    setShowMessage(true);
    if (duration > 0) {
      setTimeout(() => {
        if (messageRef.current) {
          messageRef.current.classList.add("message--fade");
          messageRef.current.addEventListener("animationend", () => {
            setShowMessage(false);
          });
        }
      }, duration - 200);
    }
  }

  function importData(str: string) {
    if (str.length === 0) return;
    let data;
    try {
      data = JSON.parse(str);
    } catch {
      setMessage("Import failed");
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 1000);
      return;
    }
    for (let key in data) {
      try {
        data[key] = JSON.parse(data[key]);
      } catch {
        setMessage("Import failed");
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 1000);
        return;
      }
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
        let paletteObj = palette.find((color) => color.name === tile.color);
        if (paletteObj) {
          square = paletteObj.emoji;
        } else {
          // blank tile
          darkMode ? (square = "⬛") : (square = "⬜");
        }
        rowSquares = rowSquares.concat(square);
      });
      if (rowIndex !== coloredBoard.length - 1)
        rowSquares = rowSquares.concat("\n"); // don't add newline at the last row
      squares = squares.concat(rowSquares);
    });
    let text = `Zardle ${zardleDay} ${attempts}/${MAX_GUESSES}\nhttps://zardle.pages.dev/\n\n${squares}`;
    navigator.clipboard.writeText(text);
    displayMessage("Copied results to clipboard", 1200);
  }

  function copyDataClipboard() {
    navigator.clipboard.writeText(JSON.stringify(localStorage));
    displayMessage("Copied data to clipboard", 1200);
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
    setShowMessage(false);
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
        if (key) {
          try {
            data[key] = JSON.parse(storage.getItem(key) || "{}");
          } catch {
            continue;
          }
        }
      }
    } else {
      data = storage;
      displayMessage("Import success!", 1200);
    }
    if (Object.keys(data).length === 0) return;
    setBoard(data.board || createDefaultBoard(WORD_LENGTH, MAX_GUESSES));
    setGuesses(data.guesses || []);
    setPlayedToday(data.playedToday || false);
    setWon(didGameEnd(data.guesses || []));
    setCurrentRow(data.guesses.length || 0);
    setPlayedAnimation(data.playedAnimation || false);
    setStats(data.stats || DEFAULT_STATS);
    setEnableWordCheck(data.enableWordCheck || false);
    setDarkMode(data.darkMode || false);
    setHardMode(data.hardMode || false);
    setPalette(data.palette || palette);
    data.playedToday ? setEnableInput(false) : setEnableInput(true);
  }

  function loadMiscSettings() {
    // from localstorage
    let data: { [key: string]: any } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) data[key] = JSON.parse(localStorage.getItem(key) || "{}");
    }
    if (Object.keys(data).length === 0) return;
    setStats(data.stats || DEFAULT_STATS);
    setEnableWordCheck(data.enableWordCheck || false);
    setDarkMode(data.darkMode || false);
    setHardMode(data.hardMode || false);
    setPalette(data.palette || palette);
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

  function validInHardMode() {
    let lastRow = board[guesses.length - 1];
    let isValid = true;
    const revealedTiles = lastRow.filter((tile) => tile.color !== "gray");
    const revealedLetters = revealedTiles.map((tile) => tile.symbol);
    revealedLetters.forEach((letter) => {
      if (!isValid) return;
      if (!currentGuess.includes(letter)) {
        setIsCurrentInputValid(false);
        setPlayShake(true);
        setTimeout(() => setPlayShake(false), 1000);
        displayMessage(`Guess must contain ${letter.toUpperCase()}`, 1200);
        isValid = false;
      }
    });
    return isValid;
  }

  function handleSubmit() {
    if (playedToday || !enableInput) return;
    const isValid = validateWord(currentGuess);
    if (!isValid) {
      setIsCurrentInputValid(false);
      setPlayShake(true);
      setTimeout(() => setPlayShake(false), 1000);
      displayMessage("Not in word list", 1000);
      return;
    }
    if (hardMode) {
      if (guesses.length !== 0 && !validInHardMode()) return;
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
    let correctLetters: Array<{ symbol: string; index: number }> = [];
    let wrongSpotLetters: Array<{ symbol: string; index: number }> = [];

    newBoard[currentRow].forEach((tile, index) => {
      const letter = tile.symbol;
      if (letter.length === 0) return;
      // assign letters to colored array
      if (letter === DAILY_WORD.current[index]) {
        correctLetters.push({ symbol: letter, index: index });
      } else if (DAILY_WORD.current.includes(letter)) {
        // skip if already in array
        if (
          wrongSpotLetters.some((l) => l.symbol === letter && l.index === index)
        )
          return;
        // yellows should not exceed max occurrences of a letter
        if (
          wrongSpotLetters.filter((l) => l.symbol === letter).length +
            correctLetters.filter((l) => l.symbol === letter).length >=
          countLetter(DAILY_WORD.current, letter)
        )
          return;
        wrongSpotLetters.push({ symbol: letter, index: index });
      }
      // remove previous yellows if all greens are found later in input
      // e.g. for "APPLE", the first P in "PPP__" will flip back to gray after 3rd input
      if (
        correctLetters.filter((g) => g.symbol === letter).length ===
        countLetter(DAILY_WORD.current, letter)
      )
        wrongSpotLetters = wrongSpotLetters.filter((y) => y.symbol !== letter);
    });

    // actually change colors
    newBoard[currentRow].forEach((tile, index) => {
      if (wrongSpotLetters.some((letter) => letter.index === index)) {
        tile.color = palette[0].name;
      } else if (correctLetters.some((letter) => letter.index === index)) {
        tile.color = palette[1].name;
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
      setTimeout(
        () => displayMessage(WIN_MESSAGE[guesses.length - 1], 0),
        1400
      );
    } else {
      tempStats.losses += 1;
      tempStats.streak = 0;
      setTimeout(
        () => displayMessage(`"${DAILY_WORD.current.toUpperCase()}"`, 0),
        1400
      );
    }
    tempStats.totalGames = stats.totalGames + 1;
    setStats(tempStats);
    setWon(win);
    setPlayedToday(true);
    setEnableInput(false);
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
    localStorage.setItem("hardMode", JSON.stringify(hardMode));
    localStorage.setItem("palette", JSON.stringify(palette));
  }

  function updateColor(oldColor: string, newColor: string) {
    let newBoard = board;
    newBoard.forEach((row) =>
      row.forEach((tile) => {
        if (tile.color === oldColor) tile.color = newColor;
      })
    );
    setBoard(newBoard);
  }

  function openModal(type: string) {
    setModalType(type);
    setIsOpen(true);
    setShowMessage(false);
    setEnableInput(false);
  }

  function closeModal() {
    setIsOpen(false);
    setEnableInput(true);
  }

  //=======================================================================

  useEffect(() => {
    fetchDailyWord();
    if (appRef.current) appRef.current.focus();
  }, []);

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
    palette,
  ]);

  useEffect(() => {
    if (currentGuess.length < WORD_LENGTH) {
      setIsCurrentInputValid(true);
      return;
    }
    const isValid = validateWord(currentGuess);
    setIsCurrentInputValid(isValid);
  }, [currentGuess]);

  //=======================================================================

  Modal.setAppElement("#root");

  const modalLightMode = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    content: {
      padding: "0",
      border: "0",
      inset: "0",
      color: "#383838",
      backgroundColor: "#ffffff",
    },
  };

  const modalDarkMode = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    content: {
      padding: "0",
      border: "0",
      inset: "0",
      color: "#ffffff",
      backgroundColor: "#202020",
    },
  };

  let modal;
  switch (modalType) {
    case "stats":
      modal = (
        <StatsModal
          playedToday={playedToday}
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
          playedToday={playedToday}
          guessCount={guesses.length}
          hardMode={hardMode}
          setHardMode={setHardMode}
          updateColor={updateColor}
          enableWordCheck={enableWordCheck}
          setEnableWordCheck={setEnableWordCheck}
          copyDataClipboard={copyDataClipboard}
          importData={importData}
          resetData={resetData}
          displayMessage={displayMessage}
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
      ref={appRef}
    >
      <div className="nav-bar">
        <div className="nav-btn-container-left">
          <div
            className={`nav-btn${darkMode ? " --nav-btn-dark-mode" : ""}`}
            onClick={() => openModal("rules")}
          >
            <i className="fa-regular fa-circle-question" />
          </div>
        </div>
        <div className={`title${darkMode ? " --title-dark-mode" : ""}`}>
          ZARDLE
        </div>
        <div className="nav-btn-container-right">
          <div
            className={`nav-btn${darkMode ? " --nav-btn-dark-mode" : ""}`}
            onClick={() => openModal("stats")}
          >
            <i className="fa-solid fa-chart-column" />
          </div>
          <div
            className={`nav-btn${darkMode ? " --nav-btn-dark-mode" : ""}`}
            onClick={() => openModal("options")}
          >
            <i className="fa-solid fa-gear" />
          </div>
        </div>
      </div>

      <div className={`game${darkMode ? " --dark-mode" : ""}`}>
        <Message
          ref={messageRef}
          visible={showMessage}
          message={message}
        ></Message>
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
          board={board}
          handleKeyDown={handleKeyDown}
          guesses={guesses}
        />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Statistics"
        style={darkMode ? modalDarkMode : modalLightMode}
        closeTimeoutMS={100}
      >
        {modal}
      </Modal>
    </div>
  );
}

export default App;
