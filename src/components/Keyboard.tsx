import "../App.scss";
import { useState, useEffect, useContext, memo } from "react";
import { PaletteContext } from "../contexts/PaletteProvider";
import KeyButton from "./KeyButton";

interface KeyboardProps {
  board: Array<Array<{ symbol: string; color: string }>>;
  guesses: Array<string>;
  handleKeyDown: Function;
}

const Keyboard = ({ board, guesses, handleKeyDown }: KeyboardProps) => {
  const SYMBOLS = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["enter", "z", "x", "c", "v", "b", "n", "m", "backspace"],
  ];
  const { palette } = useContext(PaletteContext);
  const [correctLetters, setCorrectLetters] = useState<Array<string>>([]);
  const [misplacedLetters, setMisplacedLetters] = useState<Array<string>>([]);
  const [grays, setGrays] = useState<Array<string>>([]);

  const getCorrectLetters = () => {
    let arr = correctLetters;
    board.forEach((row) => {
      row.forEach((tile) => {
        if (correctLetters.includes(tile.symbol)) return;
        if (tile.color === palette[1].name) arr.push(tile.symbol);
      });
    });
    return arr;
  };

  const getMisplacedLetters = () => {
    let arr = misplacedLetters;
    board.forEach((row) => {
      row.forEach((tile) => {
        if (misplacedLetters.includes(tile.symbol)) return;
        if (tile.color === palette[0].name) arr.push(tile.symbol);
      });
    });
    return arr.filter((letter) => !correctLetters.includes(letter));
  };

  const getGrays = () => {
    let arr = grays;
    board.forEach((row) => {
      row.forEach((tile) => {
        if (grays.includes(tile.symbol)) return;
        if (tile.color === "gray") arr.push(tile.symbol);
      });
    });
    return arr;
  };

  const resetArrays = () => {
    setGrays([]);
    setMisplacedLetters([]);
    setCorrectLetters([]);
  };

  // auto-reset, update keyboard key colors after 1.3 seconds
  useEffect(() => {
    if (
      guesses.length === 0 &&
      (correctLetters.length > 0 ||
        misplacedLetters.length > 0 ||
        grays.length > 0)
    ) {
      resetArrays();
    } else {
      const timer = setTimeout(() => {
        setGrays(getGrays());
        setCorrectLetters(getCorrectLetters());
        setMisplacedLetters(getMisplacedLetters());
      }, 1300);
      return () => clearTimeout(timer);
    }
  });

  return (
    <div className="keyboard">
      <div className="row">
        {SYMBOLS[0].map((symbol, index) => {
          let color = "";
          if (correctLetters.some((letter) => letter === symbol)) {
            color = palette[1].name;
          } else if (misplacedLetters.some((letter) => letter === symbol)) {
            color = palette[0].name;
          } else if (grays.some((letter) => letter === symbol)) {
            color = "gray";
          }

          return (
            <KeyButton
              symbol={symbol}
              color={color}
              key={index}
              handleKeyDown={handleKeyDown}
            />
          );
        })}
      </div>
      <div className="row">
        {SYMBOLS[1].map((symbol, index) => {
          let color = "";
          if (correctLetters.some((letter) => letter === symbol)) {
            color = palette[1].name;
          } else if (misplacedLetters.some((letter) => letter === symbol)) {
            color = palette[0].name;
          } else if (grays.some((letter) => letter === symbol)) {
            color = "gray";
          }

          return (
            <KeyButton
              symbol={symbol}
              color={color}
              key={index}
              handleKeyDown={handleKeyDown}
            />
          );
        })}
      </div>
      <div className="row">
        {SYMBOLS[2].map((symbol, index) => {
          let color = "";
          if (correctLetters.some((letter) => letter === symbol)) {
            color = palette[1].name;
          } else if (misplacedLetters.some((letter) => letter === symbol)) {
            color = palette[0].name;
          } else if (grays.some((letter) => letter === symbol)) {
            color = "gray";
          }

          return (
            <KeyButton
              symbol={symbol}
              color={color}
              key={index}
              handleKeyDown={handleKeyDown}
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(Keyboard);
