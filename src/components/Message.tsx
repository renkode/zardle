import "../App.scss";
import { memo, useContext } from "react";
import { DarkModeContext } from "../contexts/DarkModeProvider";

interface MessageProps {
  visible: boolean;
  message?: string;
}

const Message = ({ visible, message = "" }: MessageProps) => {
  const { darkMode } = useContext(DarkModeContext);
  return (
    <div
      className={`message ${darkMode ? "--message-dark-mode" : ""}`}
      style={{ visibility: `${visible ? "visible" : "hidden"}` }}
    >
      {message}
    </div>
  );
};

export default memo(Message);
