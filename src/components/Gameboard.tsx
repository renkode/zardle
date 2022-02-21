import "../App.css";
import React, { memo, useState } from "react";
import Row from "./Row";
// don't memo this or else it won't render state change

interface BoardProps {
  board: Array<Array<string>>;
  dailyWord: string;
  currentRow: number;
  yellowLetters: Array<string>;
  greenLetters: Array<string>;
}

const Gameboard = ({
  board,
  dailyWord,
  currentRow,
  yellowLetters,
  greenLetters,
}: BoardProps) => {
  return (
    <div className="gameboard">
      {board.map((row, rowIndex) => (
        <Row
          key={rowIndex}
          boardRow={board[rowIndex]}
          active={rowIndex === currentRow ? true : false}
          dailyWord={dailyWord}
          yellowLetters={yellowLetters}
          greenLetters={greenLetters}
        />
      ))}
    </div>
  );
};

export default Gameboard;
