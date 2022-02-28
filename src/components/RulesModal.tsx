import "../App.css";
import { memo } from "react";
import Row from "./Row";

interface RulesModalProps {
  closeModal(): void;
}

const RulesModal = ({ closeModal }: RulesModalProps) => {
  const WEARY = [
    { symbol: "w", color: "green" },
    { symbol: "e", color: "" },
    { symbol: "a", color: "" },
    { symbol: "r", color: "" },
    { symbol: "y", color: "" },
  ];
  const PILLS = [
    { symbol: "P", color: "" },
    { symbol: "i", color: "yellow" },
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
  return (
    <div className="rules-modal">
      <div className="close-btn" onClick={closeModal}>
        X
      </div>
      <h3>HOW TO PLAY</h3>
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
          tileSize="50px"
          boardRow={WEARY}
          isCurrentInputValid={true}
          active={false}
        />
        <p>
          The letter <b>W</b> is in the word and in the correct spot.
        </p>

        <Row
          tileSize="50px"
          boardRow={PILLS}
          isCurrentInputValid={true}
          active={false}
        />
        <p>
          The letter <b>I</b> is in the word but in the wrong spot.
        </p>

        <Row
          tileSize="50px"
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
