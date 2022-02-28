import "../App.css";
import { useState, useEffect, useRef, memo } from "react";
import Tile from "./Tile";
import ReactCardFlip from "react-card-flip";

interface RowProps {
  boardRow: Array<{ symbol: string; color: string }>;
  active: boolean;
  backspacing: boolean;
  playedAnimation: boolean;
  setPlayedAnimation(isDone: boolean): void;
}

const Row = ({
  boardRow,
  active,
  backspacing,
  playedAnimation,
  setPlayedAnimation,
}: RowProps) => {
  const [flip, setFlip] = useState<Array<boolean>>([]);
  const [bounce, setBounce] = useState<Array<boolean>>([]);
  const [count, setCount] = useState(0);
  const canBounce = useRef<any>(false);

  function flipTile(index: number) {
    let arr = flip;
    arr[index] = true;
    setFlip(arr);
  }

  function bounceTile(index: number) {
    let arr = bounce;
    arr[index] = true;
    setBounce(arr);
  }

  useEffect(() => {
    // reset row
    if (boardRow.every((tile) => tile.symbol === "")) {
      setCount(0);
      setFlip([]);
      setBounce([]);
      return;
    }
  }, [boardRow]);

  useEffect(() => {
    // flip tile individually
    if (
      !active &&
      boardRow.filter((tile) => tile.symbol.length > 0).length >=
        boardRow.length &&
      count < boardRow.length
    ) {
      setTimeout(() => {
        flipTile(count);
        setCount(count + 1);
      }, 200);
    }
    // do bounce animation only after tile is flipped
    if (!playedAnimation && boardRow.every((tile) => tile.color === "green")) {
      if (flip[count]) {
        setTimeout(() => {
          bounceTile(count);
          setCount(count + 1);
        }, 300);
      }
      setTimeout(() => {
        setCount(0);
      }, 1000);
      setTimeout(() => {
        setPlayedAnimation(true);
      }, 2000);
    }
  });

  return (
    <div className="row">
      {boardRow.map((slot, slotIndex) => {
        let bounceAni = `${bounce[slotIndex] ? "bounce" : ""}`;
        let transformAni = `${
          !flip[slotIndex] &&
          active &&
          !backspacing &&
          slotIndex === boardRow.filter((l) => l.symbol.length > 0).length - 1
            ? "transform"
            : ""
        }`;
        return (
          <ReactCardFlip
            isFlipped={flip[slotIndex]}
            flipDirection="vertical"
            key={slotIndex}
            containerClassName={`${
              flip[slotIndex] && bounce[slotIndex] ? bounceAni : ""
            } ${transformAni}`}
          >
            <Tile letter={slot.symbol.toUpperCase()} />
            <Tile letter={slot.symbol.toUpperCase()} color={slot.color} />
          </ReactCardFlip>
        );
      })}
    </div>
  );
};

export default memo(Row);
