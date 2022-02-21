import "../App.css";
import React, { useState, memo } from "react";
import LetterSlot from "./LetterSlot";

interface RowProps {
  boardRow: Array<string>;
  active: boolean;
  //currentGuess: string;
  dailyWord: string;
  duplicateLetters: Array<{ symbol: string; indices: Array<number> }>;
}

const Row = ({ boardRow, active, dailyWord, duplicateLetters }: RowProps) => {
  let dupeCount = 0;
  return (
    <div className="row">
      {boardRow.map((slot, slotIndex) => {
        let color = "";
        const letter = slot.toLowerCase();
        let dupe = duplicateLetters.filter((dupe) => dupe.symbol === letter)[0];

        if (true) {
          if (dupe) {
            // if all duplicate letters are already in the correct place, prevent extra dupes from rendering as yellow
            if (dupe.symbol === letter && dupe.indices.includes(slotIndex)) {
              color = "green";
            } else if (
              dupe.symbol === letter &&
              !dupe.indices.includes(slotIndex) &&
              dupeCount < dupe.indices.length
            ) {
              color = "yellow";
            }
            // no idea why I have to put it here instead of above but ok
            dupe.indices.forEach((index) => {
              if (boardRow[index] === letter) dupeCount += 1;
            });
          } else {
            if (dailyWord[slotIndex] === letter) {
              color = "green";
            } else if (
              letter.length > 0 &&
              dailyWord.includes(letter) &&
              dailyWord[dailyWord.indexOf(letter)] !==
                boardRow[dailyWord.indexOf(letter)] &&
              boardRow.filter((l) => l === letter).length < 2 // god.
            ) {
              // empty string counts as being included fsr lol
              color = "yellow";
            }
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
