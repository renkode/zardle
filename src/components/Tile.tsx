import "../App.css";
import { memo } from "react";

interface TileProps {
  letter: string;
  color?: string;
}

const Tile = ({ letter, color = "" }: TileProps) => {
  return <div className={`tile ${color}`}>{letter}</div>;
};

export default memo(Tile);
