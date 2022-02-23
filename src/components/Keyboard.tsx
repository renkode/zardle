import "../App.css";
import { useState, useEffect, memo } from "react";
import KeySlot from "./KeySlot";

//check if a-z key is included in board

interface KeyboardProps {
  dailyWord: string;
  guesses: Array<string>;
  handleKeyDown: Function;
}

const Keyboard = ({ dailyWord, guesses, handleKeyDown }: KeyboardProps) => {
  const lastGuess = guesses[guesses.length - 1];
  const [greens, setGreens] = useState<Array<string>>([]);
  const [yellows, setYellows] = useState<Array<string>>([]);
  const [grays, setGrays] = useState<Array<string>>([]);
  const symbols = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["enter", "Z", "X", "C", "V", "B", "N", "M", "backspace"],
  ];

  const getGreens = () => {
    let greenArr = greens;
    const guessArr = lastGuess.split("");
    guessArr.forEach((letter, index) => {
      if (greens.includes(letter)) return;
      if (dailyWord[index] === letter) greenArr.push(letter);
    });
    return greenArr;
  };

  const getYellows = () => {
    let yellowArr = yellows;
    const guessArr = lastGuess.split("");
    guessArr.forEach((letter) => {
      if (yellows.includes(letter)) return;
      if (dailyWord.includes(letter)) yellowArr.push(letter);
    });
    return yellowArr.filter((y) => !greens.includes(y));
  };

  const getGrays = () => {
    let grayArr = grays;
    const guessArr = lastGuess.split("");
    guessArr.forEach((letter) => {
      if (grays.includes(letter)) return;
      if (!dailyWord.includes(letter)) grayArr.push(letter);
    });
    return grayArr;
  };

  const reset = () => {
    setGrays([]);
    setYellows([]);
    setGreens([]);
  };

  useEffect(() => {
    if (guesses.length === 0) {
      reset();
    } else {
      if (!lastGuess) return;
      setTimeout(() => {
        setGreens(getGreens());
        setYellows(getYellows());
        setGrays(getGrays());
      }, dailyWord.length * 250);
    }
  });

  return (
    <div className="keyboard">
      <div className="row">
        {symbols[0].map((symbol, index) => {
          symbol = symbol.toLowerCase();
          let color = "";
          if (greens.some((g) => g === symbol)) {
            color = "green";
          } else if (yellows.some((y) => y === symbol)) {
            color = "yellow";
          } else if (grays.some((g) => g === symbol)) {
            color = "gray";
          }

          return (
            <KeySlot
              symbol={symbol}
              color={color}
              key={index}
              handleKeyDown={handleKeyDown}
            />
          );
        })}
      </div>
      <div className="row">
        {symbols[1].map((symbol, index) => {
          symbol = symbol.toLowerCase();
          let color = "";
          if (greens.some((g) => g === symbol)) {
            color = "green";
          } else if (yellows.some((y) => y === symbol)) {
            color = "yellow";
          } else if (grays.some((g) => g === symbol)) {
            color = "gray";
          }

          return (
            <KeySlot
              symbol={symbol}
              color={color}
              key={index}
              handleKeyDown={handleKeyDown}
            />
          );
        })}
      </div>
      <div className="row">
        {symbols[2].map((symbol, index) => {
          symbol = symbol.toLowerCase();
          let color = "";
          if (greens.some((g) => g === symbol)) {
            color = "green";
          } else if (yellows.some((y) => y === symbol)) {
            color = "yellow";
          } else if (grays.some((g) => g === symbol)) {
            color = "gray";
          }

          return (
            <KeySlot
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
