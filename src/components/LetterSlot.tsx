import "../App.css";
import React, { memo } from "react";

interface LetterSlotProps {
  letter: string;
  color: string;
}

const LetterSlot = ({ letter, color }: LetterSlotProps) => {
  return <div className={`gameboard-slot ${color}`}>{letter}</div>;
};

export default memo(LetterSlot);
