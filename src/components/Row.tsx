import "../App.css";
import React, { useState, useEffect, memo } from "react";
import LetterSlot from "./LetterSlot";

interface RowProps {
  boardRow: Array<string>;
  active: boolean;
  dailyWord: string;
  duplicateLetters: Array<{ symbol: string; indices: Array<number> }>;
}

const Row = ({ boardRow, active, dailyWord, duplicateLetters }: RowProps) => {
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

      // remove previous yellows if greens are found later in input
      // e.g. for "APPLE", the first P in "PPPXX" will flip back to gray after 3rd input
      if (
        greenArr.filter((l) => l.symbol === letter).length ===
        countLetter(dailyWord, letter)
      )
        yellowArr = yellowArr.filter((l) => l.symbol !== letter);
    });
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

        if (true /*!active*/) {
          if (letter === dailyWord[slotIndex]) {
            color = "green";
          } else if (
            letter.length > 0 &&
            yellows.some((y) => y.symbol === letter && y.index === slotIndex)
          ) {
            color = "yellow";
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
