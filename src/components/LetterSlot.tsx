import "../App.css";
import React, { memo } from "react";

interface LetterSlotProps {
  letter: string;
  index: number;
  color: string;
}

const LetterSlot = ({ letter, index, color }: LetterSlotProps) => {
  return <div className={`gameboard-slot ${color}`}>{letter}</div>;
};

export default memo(LetterSlot);
