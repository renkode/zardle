import "../App.css";
import React, { useState, memo } from "react";
import LetterSlot from "./LetterSlot";

interface RowProps {
  boardRow: Array<string>;
  active: boolean;
  dailyWord: string;
  duplicateLetters: Array<{ symbol: string; indices: Array<number> }>;
}

const Row = ({ boardRow, active, dailyWord, duplicateLetters }: RowProps) => {
  let dupeCount = 0;
  return (
    <div className="row">
      {boardRow.map((slot, slotIndex) => {
        const letter = slot.toLowerCase();
        let dupe = duplicateLetters.filter((dupe) => dupe.symbol === letter)[0];
        let color = "";

        if (!active) {
          if (dupe) {
            // if all duplicate letters are already in the correct place, prevent extra dupes from rendering as yellow
            dupe.indices.forEach((index) => {
              if (boardRow[index] === letter) dupeCount += 1;
            });

            // duplicate letter logic
            if (dupe.symbol === letter && dupe.indices.includes(slotIndex)) {
              color = "green";
            } else if (
              dupe.symbol === letter &&
              !dupe.indices.includes(slotIndex) &&
              dupeCount < dupe.indices.length
            ) {
              color = "yellow";
              dupeCount += 1;
            }
          } else if (!dupe) {
            // single letter logic
            if (dailyWord[slotIndex] === letter) {
              color = "green";
            } else if (letter.length > 0 && dailyWord.includes(letter)) {
              // empty string counts as being included fsr lol
              color = "yellow";
            }
          }
        }

        return <LetterSlot letter={slot} key={slotIndex} color={color} />;
      })}
    </div>
  );
};

export default memo(Row);
