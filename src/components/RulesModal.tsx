import "../App.scss";
import { memo, useContext } from "react";
import Row from "./Row";
import { ContrastModeContext } from "../contexts/ContrastModeProvider";

interface RulesModalProps {
  closeModal(): void;
}

const RulesModal = ({ closeModal }: RulesModalProps) => {
  const { contrastMode } = useContext(ContrastModeContext);
  let CORRECT_COLOR;
  let WRONG_SPOT_COLOR;
  if (contrastMode) {
    CORRECT_COLOR = "orange";
    WRONG_SPOT_COLOR = "blue";
  } else {
    CORRECT_COLOR = "green";
    WRONG_SPOT_COLOR = "yellow";
  }
  const WEARY = [
    { symbol: "w", color: CORRECT_COLOR },
    { symbol: "e", color: "" },
    { symbol: "a", color: "" },
    { symbol: "r", color: "" },
    { symbol: "y", color: "" },
  ];
  const PILLS = [
    { symbol: "P", color: "" },
    { symbol: "i", color: WRONG_SPOT_COLOR },
    { symbol: "l", color: "" },
    { symbol: "l", color: "" },
    { symbol: "s", color: "" },
  ];
  const VAGUE = [
    { symbol: "v", color: "" },
    { symbol: "a", color: "" },
    { symbol: "g", color: "" },
    { symbol: "u", color: "gray" },
    { symbol: "e", color: "" },
  ];
  const TILE_SIZE = "50px";
  const FONT_SIZE = "30px";

  return (
    <div className="rules-modal">
      <div className="modal-header">
        <h3>HOW TO PLAY</h3>
        <span className="close-btn" onClick={closeModal}>
          <i className="fa-solid fa-x"></i>
        </span>
      </div>
      <p>
        Guess the <b>ZARDLE</b> in six tries.
      </p>
      <p>
        Each guess must be a valid five-letter word. Hit the enter button to
        submit.
      </p>
      <p>
        After each guess, the color of the tiles will change to show how close
        your guess was to the word.
      </p>
      <hr />
      <div>
        <h4>EXAMPLES</h4>
        <Row
          tileSize={TILE_SIZE}
          fontSize={FONT_SIZE}
          boardRow={WEARY}
          isCurrentInputValid={true}
          active={false}
        />
        <p>
          The letter <b>W</b> is in the word and in the correct spot.
        </p>

        <Row
          tileSize={TILE_SIZE}
          fontSize={FONT_SIZE}
          boardRow={PILLS}
          isCurrentInputValid={true}
          active={false}
        />
        <p>
          The letter <b>I</b> is in the word but in the wrong spot.
        </p>

        <Row
          tileSize={TILE_SIZE}
          fontSize={FONT_SIZE}
          boardRow={VAGUE}
          isCurrentInputValid={true}
          active={false}
        />
        <p>
          The letter <b>U</b> is not in the word in any spot.
        </p>

        <hr />
        <h4>A new ZARDLE will be available each day!</h4>
      </div>
    </div>
  );
};

export default memo(RulesModal);
