import "../App.css";
import React, { useState, useEffect, memo } from "react";
import LetterSlot from "./LetterSlot";

interface RowProps {
  boardRow: Array<string>;
  active: boolean;
  dailyWord: string;
}

const Row = ({ boardRow, active, dailyWord }: RowProps) => {
  const [grays, setGrays] = useState<Array<string>>([]);
  const [yellows, setYellows] = useState<
    Array<{ symbol: string; index: number }>
  >([]);
  const [greens, setGreens] = useState<
    Array<{ symbol: string; index: number }>
  >([]);
  function countLetter(word: string, letter: string) {
    return word.split("").filter((l) => l === letter).length;
  }

  function validate() {
    let grayArr: Array<string> = [];
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
      } else {
        if (grayArr.some((g) => g === letter)) return;
        grayArr.push(letter);
      }

      // remove previous yellows if all greens are found later in input
      // e.g. for "APPLE", the first P in "PPP__" will flip back to gray after 3rd input
      if (
        greenArr.filter((l) => l.symbol === letter).length ===
        countLetter(dailyWord, letter)
      )
        yellowArr = yellowArr.filter((l) => l.symbol !== letter);
    });
    setGrays(grayArr);
    setYellows(yellowArr);
    setGreens(greenArr);
  }

  useEffect(() => {
    validate();
  }, [boardRow]);

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
          } else if (letter.length > 0 && grays.some((g) => g === letter)) {
            color = "gray";
          }
        }

        return (
          <LetterSlot
            letter={slot.toUpperCase()}
            key={slotIndex}
            index={slotIndex}
            color={color}
          />
        );
      })}
    </div>
  );
};

export default memo(Row);
