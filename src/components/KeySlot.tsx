import "../App.css";
import { memo } from "react";

interface KeySlotProps {
  symbol: string;
  color: string;
  handleKeyDown: Function;
}

const KeySlot = ({ symbol, color, handleKeyDown }: KeySlotProps) => {
  return (
    <div
      className={`keyboard-key ${color}`}
      onClick={() => handleKeyDown(null, symbol)}
    >
      {symbol === "backspace" ? "BKSP" : symbol.toUpperCase()}
    </div>
  );
};

export default memo(KeySlot);
