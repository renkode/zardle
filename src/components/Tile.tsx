import "../App.scss";
import { memo } from "react";

interface TileProps {
  tileSize: string;
  letter: string;
  color?: string;
}

const Tile = ({ tileSize, letter, color = "" }: TileProps) => {
  return (
    <div
      className={`tile ${color}`}
      style={{ width: `${tileSize}`, height: `${tileSize}` }}
    >
      {letter}
    </div>
  );
};

export default memo(Tile);
