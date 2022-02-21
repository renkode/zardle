import "../App.css";
import React, { memo } from "react";
import LetterSlot from "./LetterSlot";

interface RowProps {
  boardRow: Array<string>;
  active: boolean;
  dailyWord: string;
  yellowLetters: Array<string>;
  greenLetters: Array<string>;
}

const checkSlotColors = () => {};
//

const Row = ({ dailyWord, boardRow, active }: RowProps) => {
  return (
    <div className="row">
      {boardRow.map((letter, slotIndex) => {
        return <LetterSlot letter={letter} key={slotIndex} color={""} />;
      })}
    </div>
  );
};

export default memo(Row);
