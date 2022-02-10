import "../App.css";
import React, { memo } from "react";
// lol don't memo this

interface LetterSlotProps {
  letter: string;
}

const LetterSlot = ({ letter }: LetterSlotProps) => {
  return <div className="gameboard-slot">{letter}</div>;
};

export default LetterSlot;
