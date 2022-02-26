import "../App.css";
import { memo } from "react";

interface KeyButtonProps {
  symbol: string;
  color: string;
  handleKeyDown: Function;
}

const KeyButton = ({ symbol, color, handleKeyDown }: KeyButtonProps) => {
  return (
    <div className={`key ${color}`} onClick={() => handleKeyDown(null, symbol)}>
      {symbol === "backspace" ? "BKSP" : symbol.toUpperCase()}
    </div>
  );
};

export default memo(KeyButton);
