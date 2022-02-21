import "../App.css";
import React, { useState } from "react";
import KeySlot from "./KeySlot";

//check if a-z key is included in board

interface KeyboardProps {
  board: Array<Array<string>>;
}

const Keyboard = ({ board }: KeyboardProps) => {
  const symbols = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["enter", "Z", "X", "C", "V", "B", "N", "M", "backspace"],
  ];
  return (
    <div className="keyboard">
      <div className="row">
        {symbols[0].map((symbol, index) => (
          <KeySlot symbol={symbol} key={index} />
        ))}
      </div>
      <div className="row">
        {symbols[1].map((symbol, index) => (
          <KeySlot symbol={symbol} key={index} />
        ))}
      </div>
      <div className="row">
        {symbols[2].map((symbol, index) => (
          <KeySlot symbol={symbol} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Keyboard;
