import "../App.scss";
import { memo, useContext } from "react";
import { DarkModeContext } from "../contexts/DarkModeProvider";

interface TileProps {
  tileSize: string;
  letter: string;
  color?: string;
}

const Tile = ({ tileSize, letter, color = "" }: TileProps) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div
      className={`tile ${color}${darkMode ? " --tile-dark-mode" : ""}`}
      style={{ width: `${tileSize}`, height: `${tileSize}` }}
    >
      {letter}
    </div>
  );
};

export default memo(Tile);
