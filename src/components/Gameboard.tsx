import "../App.scss";
import Row from "./Row";

interface BoardProps {
  board: Array<Array<{ symbol: string; color: string }>>;
  WORD_LENGTH: number;
  currentGuess: string;
  enableWordCheck: boolean;
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
  enableWordCheck,
  isCurrentInputValid,
  currentRow,
  backspacing,
  playShake,
  playedAnimation,
  setPlayedAnimation,
}: BoardProps) => {
  // create row object array for the current guess
  let emptySpaceLength = WORD_LENGTH - currentGuess.length;
  let rowInput = Array.from({ length: currentGuess.length }, (_, i) => ({
    symbol: currentGuess[i],
    color: "",
  })).concat(
    Array.from({ length: emptySpaceLength }, () => ({ symbol: "", color: "" }))
  );

  return (
    <div className="gameboard">
      {board.map((row, rowIndex) => (
        <Row
          key={rowIndex}
          tileSize={"min(70px, 16vw, 8vh)"}
          boardRow={rowIndex === currentRow ? rowInput : row}
          enableWordCheck={enableWordCheck}
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

export default Gameboard;
