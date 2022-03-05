import "../App.scss";
import { useContext } from "react";
import { DarkModeContext } from "../contexts/DarkModeProvider";

interface TileProps {
  tileSize: string;
  fontSize?: string;
  letter: string;
  color?: string;
}

const Tile = ({ tileSize, fontSize = "", letter, color = "" }: TileProps) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div
      className={`tile ${color}${darkMode ? " --tile-dark-mode" : ""}`}
      style={{
        width: `${tileSize}`,
        height: `${tileSize}`,
        fontSize: `${fontSize}`,
      }}
    >
      {letter}
    </div>
  );
};

export default Tile;
