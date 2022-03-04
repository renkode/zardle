import "../App.scss";
import { memo, useContext, forwardRef } from "react";
import { DarkModeContext } from "../contexts/DarkModeProvider";

interface MessageProps {
  visible: boolean;
  message?: string;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ visible, message = "" }: MessageProps, ref) => {
    const { darkMode } = useContext(DarkModeContext);
    return (
      <div
        className={`message ${darkMode ? "--message-dark-mode" : ""}`}
        style={{ visibility: `${visible ? "visible" : "hidden"}` }}
        ref={ref}
      >
        {message}
      </div>
    );
  }
);

export default memo(Message);
