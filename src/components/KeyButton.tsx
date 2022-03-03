import "../App.scss";
import { memo } from "react";

interface KeyButtonProps {
  symbol: string;
  color: string;
  handleKeyDown: Function;
}

const KeyButton = ({ symbol, color, handleKeyDown }: KeyButtonProps) => {
  let width = "4.5vh";
  if (symbol.length > 1) width = `calc(${width}*1.6)`;
  return (
    <div
      className={`key ${color}`}
      style={{ width: `${width}` }}
      onClick={() => handleKeyDown(null, symbol)}
    >
      {symbol === "backspace" ? (
        <i className="fa-solid fa-delete-left"></i>
      ) : (
        symbol.toUpperCase()
      )}
    </div>
  );
};

export default memo(KeyButton);
