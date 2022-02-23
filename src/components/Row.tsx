import "../App.css";
import { useState, useEffect, useRef, memo } from "react";
import Tile from "./Tile";
import ReactCardFlip from "react-card-flip";

interface RowProps {
  boardRow: Array<string>;
  active: boolean;
  dailyWord: string;
  backspacing: boolean;
  wordLength: number;
}

const Row = ({
  boardRow,
  active,
  dailyWord,
  backspacing,
  wordLength,
}: RowProps) => {
  const [yellows, setYellows] = useState<
    Array<{ symbol: string; index: number }>
  >([]);
  const [greens, setGreens] = useState<
    Array<{ symbol: string; index: number }>
  >([]);
  const [flip, setFlip] = useState<Array<boolean>>([]);
  const [count, setCount] = useState(0);

  function countLetter(word: string, letter: string) {
    return word.split("").filter((l) => l === letter).length;
  }

  function validate() {
    let yellowArr: Array<{ symbol: string; index: number }> = [];
    let greenArr: Array<{ symbol: string; index: number }> = [];

    boardRow.forEach((l, index) => {
      const letter = l.toLowerCase();
      if (letter.length === 0) return;

      if (letter === dailyWord[index]) {
        greenArr.push({ symbol: letter, index: index });
      } else if (dailyWord.includes(letter)) {
        // skip if already in array
        if (yellowArr.some((y) => y.symbol === letter && y.index === index))
          return;

        // yellows should not exceed max occurrences of a letter
        if (
          yellowArr.filter((l) => l.symbol === letter).length +
            greenArr.filter((l) => l.symbol === letter).length >=
          countLetter(dailyWord, letter)
        )
          return;

        yellowArr.push({ symbol: letter, index: index });
      }

      // remove previous yellows if all greens are found later in input
      // e.g. for "APPLE", the first P in "PPP__" will flip back to gray after 3rd input
      if (
        greenArr.filter((l) => l.symbol === letter).length ===
        countLetter(dailyWord, letter)
      )
        yellowArr = yellowArr.filter((l) => l.symbol !== letter);
    });
    setYellows(yellowArr);
    setGreens(greenArr);
  }

  function flipSlot(index: number) {
    let arr = flip;
    arr[index] = true;
    setFlip(arr);
  }

  useEffect(() => {
    if (boardRow.every((l) => l === "")) {
      setCount(0);
      setFlip([]);
      return;
    }
    validate();
  }, [boardRow]);

  useEffect(() => {
    if (
      !active &&
      boardRow.filter((l) => l.length > 0).length >= wordLength &&
      count < boardRow.length
    ) {
      const timer = setTimeout(() => {
        flipSlot(count);
        setCount(count + 1);
      }, 200);
      return () => clearTimeout(timer);
    }
  });

  return (
    <div className="row">
      {boardRow.map((slot, slotIndex) => {
        let color = "";
        const letter = slot.toLowerCase();

        if (!active) {
          if (letter === dailyWord[slotIndex]) {
            color = "green";
          } else if (
            letter.length > 0 &&
            yellows.some((y) => y.symbol === letter && y.index === slotIndex)
          ) {
            color = "yellow";
          } else if (letter.length > 0) {
            color = "gray";
          }
        }

        return (
          <ReactCardFlip
            isFlipped={flip[slotIndex]}
            flipDirection="vertical"
            key={slotIndex}
            containerClassName={`${
              !flip[slotIndex] &&
              active &&
              !backspacing &&
              slotIndex === boardRow.filter((l) => l.length > 0).length - 1
                ? "transform"
                : ""
            }`}
          >
            <Tile letter={slot.toUpperCase()} color="" transform="" />
            <Tile letter={slot.toUpperCase()} color={color} transform="" />
          </ReactCardFlip>
        );
      })}
    </div>
  );
};

export default memo(Row);
