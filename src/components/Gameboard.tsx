import "../App.css";
import React, { memo, useState } from "react";
import Row from "./Row";
// don't memo this or else it won't render state change

interface BoardProps {
  board: Array<Array<string>>;
  wordLength: number;
  dailyWord: string;
  currentGuess: string;
  currentRow: number;
}

const Gameboard = ({
  board,
  wordLength,
  dailyWord,
  currentGuess,
  currentRow,
}: BoardProps) => {
  let emptySpaceLength = wordLength - currentGuess.length;
  let rowInput = currentGuess
    .split("")
    .concat(Array.from({ length: emptySpaceLength }, (value) => ""));

  return (
    <div className="gameboard">
      {board.map((row, rowIndex) => (
        <Row
          key={rowIndex}
          boardRow={rowIndex === currentRow ? rowInput : board[rowIndex]}
          active={rowIndex === currentRow ? true : false}
          dailyWord={dailyWord}
        />
      ))}
    </div>
  );
};

export default memo(Gameboard);
