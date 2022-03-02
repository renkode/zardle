import "../App.scss";
import { memo } from "react";

interface KeyButtonProps {
  symbol: string;
  color: string;
  handleKeyDown: Function;
}

const KeyButton = ({ symbol, color, handleKeyDown }: KeyButtonProps) => {
  let width = "50px";
  if (symbol.length > 1) width = "79px";
  return (
    <div
      className={`key ${color}`}
      style={{ width: `${width}` }}
      onClick={() => handleKeyDown(null, symbol)}
    >
      {symbol === "backspace" ? "BKSP" : symbol.toUpperCase()}
    </div>
  );
};

export default memo(KeyButton);
