import "../App.css";
import { memo } from "react";
import Row from "./Row";
// don't memo this or else it won't render state change

interface BoardProps {
  board: Array<Array<{ symbol: string; color: string }>>;
  wordLength: number;
  currentGuess: string;
  currentRow: number;
  backspacing: boolean;
  setAnimationDone: Function;
}

const Gameboard = ({
  board,
  wordLength,
  currentGuess,
  currentRow,
  backspacing,
  setAnimationDone,
}: BoardProps) => {
  let emptySpaceLength = wordLength - currentGuess.length;
  let rowInput = Array.from(
    { length: currentGuess.length },
    (v, i) => (v = { symbol: currentGuess[i], color: "" })
  ).concat(
    Array.from(
      { length: emptySpaceLength },
      (v) => (v = { symbol: "", color: "" })
    )
  );

  return (
    <div className="gameboard">
      {board.map((row, rowIndex) => (
        <Row
          key={rowIndex}
          boardRow={rowIndex === currentRow ? rowInput : board[rowIndex]}
          active={rowIndex === currentRow ? true : false}
          backspacing={backspacing}
          setAnimationDone={setAnimationDone}
        />
      ))}
    </div>
  );
};

export default memo(Gameboard);
