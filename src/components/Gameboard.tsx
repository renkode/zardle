import "../App.css";
import React, { memo } from "react";
import LetterSlot from "./LetterSlot";

interface BoardProps {
  board: Array<Array<string>>;
}

const Gameboard = ({ board }: BoardProps) => {
  return (
    <div className="gameboard">
      {board.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {board[rowIndex].map((slot, slotIndex) => (
            <LetterSlot letter={slot} key={slotIndex} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default memo(Gameboard);
