import "../App.css";
import React, { memo, useState } from "react";
import Row from "./Row";
// don't memo this or else it won't render state change

interface BoardProps {
  board: Array<Array<string>>;
  dailyWord: string;
  currentGuess: string;
  currentRow: number;
  duplicateLetters: Array<{ symbol: string; indices: Array<number> }>;
}

const Gameboard = ({
  board,
  dailyWord,
  currentGuess,
  currentRow,
  duplicateLetters,
}: BoardProps) => {
  let emptySpaceLength = dailyWord.length - currentGuess.length;
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
          duplicateLetters={duplicateLetters}
        />
      ))}
    </div>
  );
};

export default Gameboard;
