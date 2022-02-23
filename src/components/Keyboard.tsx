import "../App.css";
import { useState, useEffect, memo } from "react";
import KeySlot from "./KeySlot";

//check if a-z key is included in board

interface KeyboardProps {
  lastRow: Array<{ symbol: string; color: string }>;
  guesses: Array<string>;
  handleKeyDown: Function;
}

const Keyboard = ({ lastRow, guesses, handleKeyDown }: KeyboardProps) => {
  const symbols = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["enter", "Z", "X", "C", "V", "B", "N", "M", "backspace"],
  ];
  const [greens, setGreens] = useState<Array<string>>([]);
  const [yellows, setYellows] = useState<Array<string>>([]);
  const [grays, setGrays] = useState<Array<string>>([]);

  const getGreens = () => {
    let greenArr = greens;
    lastRow.forEach((tile) => {
      if (greens.includes(tile.symbol)) return;
      if (tile.color === "green") greenArr.push(tile.symbol);
    });
    return greenArr;
  };

  const getYellows = () => {
    let yellowArr = yellows;
    lastRow.forEach((tile) => {
      if (yellows.includes(tile.symbol)) return;
      if (tile.color === "yellow") yellowArr.push(tile.symbol);
    });
    return yellowArr.filter((y) => !greens.includes(y));
  };

  const getGrays = () => {
    let grayArr = grays;
    lastRow.forEach((tile) => {
      if (grays.includes(tile.symbol)) return;
      if (tile.color === "gray") grayArr.push(tile.symbol);
    });
    return grayArr;
  };

  const reset = () => {
    setGrays([]);
    setYellows([]);
    setGreens([]);
  };

  useEffect(() => {
    if (
      guesses.length === 0 &&
      (greens.length > 0 || yellows.length > 0 || grays.length > 0)
    ) {
      reset();
    } else {
      if (!lastRow) return;
      setTimeout(() => {
        setGrays(getGrays());
        setGreens(getGreens());
        setYellows(getYellows());
      }, lastRow.length * 250);
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
