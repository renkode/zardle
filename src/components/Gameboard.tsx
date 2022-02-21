import "../App.css";
import React, { memo, useState } from "react";
import Row from "./Row";
// don't memo this or else it won't render state change

interface BoardProps {
  board: Array<Array<string>>;
  dailyWord: string;
  currentRow: number;
  duplicateLetters: Array<{ symbol: string; indices: Array<number> }>;
}

const Gameboard = ({
  board,
  dailyWord,
  currentRow,
  duplicateLetters,
}: BoardProps) => {
  return (
    <div className="gameboard">
      {board.map((row, rowIndex) => (
        <Row
          key={rowIndex}
          boardRow={board[rowIndex]}
          active={rowIndex === currentRow ? true : false}
          dailyWord={dailyWord}
          duplicateLetters={duplicateLetters}
        />
      ))}
    </div>
  );
};

export default Gameboard;
