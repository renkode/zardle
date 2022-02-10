import "../App.css";
import React, { memo } from "react";

interface KeySlotProps {
  symbol: string;
}

const KeySlot = ({ symbol }: KeySlotProps) => {
  return <div className="keyboard-key">{symbol}</div>;
};

export default memo(KeySlot);
