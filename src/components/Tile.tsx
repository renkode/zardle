import "../App.css";
import { memo } from "react";

interface TileProps {
  letter: string;
  color?: string;
  transform?: string;
}

const Tile = ({ letter, transform = "", color = "" }: TileProps) => {
  return <div className={`tile ${transform} ${color}`}>{letter}</div>;
};

export default memo(Tile);
