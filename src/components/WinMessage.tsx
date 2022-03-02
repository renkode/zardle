import "../App.scss";
import { memo } from "react";

interface WinMessageProps {
  visible: boolean;
  message?: string;
}

const WinMessage = ({ visible, message = "" }: WinMessageProps) => {
  return (
    <div
      className="win-message"
      style={{ visibility: `${visible ? "visible" : "hidden"}` }}
    >
      {message}
    </div>
  );
};

export default memo(WinMessage);
