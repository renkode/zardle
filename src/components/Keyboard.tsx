import "../App.css";
import React, { useState, memo } from "react";
import KeySlot from "./KeySlot";

const Keyboard = () => {
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

export default memo(Keyboard);
