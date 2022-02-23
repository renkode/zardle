import "../App.css";
import { useState, useEffect, memo } from "react";
import Tile from "./Tile";
import ReactCardFlip from "react-card-flip";

interface RowProps {
  boardRow: Array<{ symbol: string; color: string }>;
  active: boolean;
  backspacing: boolean;
  setAnimationDone: Function;
}

const Row = ({ boardRow, active, backspacing, setAnimationDone }: RowProps) => {
  const [flip, setFlip] = useState<Array<boolean>>([]);
  const [count, setCount] = useState(0);

  function flipSlot(index: number) {
    let arr = flip;
    arr[index] = true;
    setFlip(arr);
  }

  useEffect(() => {
    if (boardRow.every((tile) => tile.symbol === "")) {
      setCount(0);
      setFlip([]);
      return;
    }
  }, [boardRow]);

  useEffect(() => {
    if (
      !active &&
      boardRow.filter((tile) => tile.symbol.length > 0).length >=
        boardRow.length &&
      count < boardRow.length
    ) {
      const timer = setTimeout(() => {
        flipSlot(count);
        setAnimationDone(true);
        setCount(count + 1);
      }, 200);
      return () => clearTimeout(timer);
    }
  });

  return (
    <div className="row">
      {boardRow.map((slot, slotIndex) => {
        return (
          <ReactCardFlip
            isFlipped={flip[slotIndex]}
            flipDirection="vertical"
            key={slotIndex}
            containerClassName={`${
              !flip[slotIndex] &&
              active &&
              !backspacing &&
              slotIndex ===
                boardRow.filter((l) => l.symbol.length > 0).length - 1
                ? "transform"
                : ""
            }`}
          >
            <Tile letter={slot.symbol.toUpperCase()} color="" transform="" />
            <Tile
              letter={slot.symbol.toUpperCase()}
              color={slot.color}
              transform=""
            />
          </ReactCardFlip>
        );
      })}
    </div>
  );
};

export default memo(Row);
