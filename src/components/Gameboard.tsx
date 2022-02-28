import "../App.css";
import { memo } from "react";
import Row from "./Row";

interface BoardProps {
  board: Array<Array<{ symbol: string; color: string }>>;
  WORD_LENGTH: number;
  currentGuess: string;
  isCurrentInputValid: boolean;
  currentRow: number;
  backspacing: boolean;
  playShake: boolean;
  playedAnimation: boolean;
  setPlayedAnimation(isDone: boolean): void;
}

const Gameboard = ({
  board,
  WORD_LENGTH,
  currentGuess,
  isCurrentInputValid,
  currentRow,
  backspacing,
  playShake,
  playedAnimation,
  setPlayedAnimation,
}: BoardProps) => {
  let emptySpaceLength = WORD_LENGTH - currentGuess.length;
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
          tileSize={"70px"}
          boardRow={rowIndex === currentRow ? rowInput : board[rowIndex]}
          isCurrentInputValid={isCurrentInputValid}
          active={rowIndex === currentRow ? true : false}
          backspacing={backspacing}
          playShake={playShake}
          playedAnimation={playedAnimation}
          setPlayedAnimation={setPlayedAnimation}
        />
      ))}
    </div>
  );
};

export default memo(Gameboard);
