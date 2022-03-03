import "../App.scss";
import { useState, useEffect, memo } from "react";
import Tile from "./Tile";
import ReactCardFlip from "react-card-flip";

interface RowProps {
  tileSize: string;
  fontSize?: string;
  boardRow: Array<{ symbol: string; color: string }>;
  active: boolean;
  enableWordCheck?: boolean;
  isCurrentInputValid: boolean;
  backspacing?: boolean;
  playShake?: boolean;
  playedAnimation?: boolean;
  setPlayedAnimation?(isDone: boolean): void;
}

const Row = ({
  tileSize,
  fontSize,
  boardRow,
  active,
  enableWordCheck = false,
  isCurrentInputValid,
  backspacing = false,
  playShake = false,
  playedAnimation = false,
  setPlayedAnimation,
}: RowProps) => {
  const TIME_STAGGER = 200;
  const [flip, setFlip] = useState<Array<boolean>>([]);
  const [bounce, setBounce] = useState<Array<boolean>>([]);
  const [count, setCount] = useState(0);

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
      }, TIME_STAGGER);
    }
    // do bounce animation only after tile is flipped
    if (
      !playedAnimation &&
      boardRow.every(
        (tile) => tile.color === "green" || tile.color === "orange"
      )
    ) {
      if (flip[count]) {
        setTimeout(() => {
          bounceTile(count);
          setCount(count + 1);
        }, TIME_STAGGER);
      }
      setTimeout(() => {
        setCount(0);
      }, TIME_STAGGER * 5);
      if (!setPlayedAnimation) return;
      setTimeout(() => {
        setPlayedAnimation(true);
      }, TIME_STAGGER * 10);
    }
  });

  return (
    <div className="row">
      {boardRow.map((slot, slotIndex) => {
        // classes
        let invalid = "";
        if (active) {
          if (enableWordCheck) {
            if (!isCurrentInputValid) invalid = "invalid";
          }
        }
        let shakeAni = `${playShake && active ? "shake" : ""}`;
        let bounceAni = `${
          flip[slotIndex] && bounce[slotIndex] ? "bounce" : ""
        }`;
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
            isFlipped={slot.color !== "" && flip[slotIndex]}
            flipDirection="vertical"
            key={slotIndex}
            containerClassName={`${shakeAni}
               ${bounceAni} ${transformAni}`}
          >
            <Tile
              tileSize={tileSize}
              fontSize={fontSize}
              letter={slot.symbol.toUpperCase()}
              color={invalid}
            />
            <Tile
              tileSize={tileSize}
              fontSize={fontSize}
              letter={slot.symbol.toUpperCase()}
              color={slot.color}
            />
          </ReactCardFlip>
        );
      })}
    </div>
  );
};

export default Row;
