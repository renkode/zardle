import "../App.css";
import { memo } from "react";
import Switch from "react-switch";

interface OptionsModalProps {
  darkMode: boolean;
  setDarkMode(bool: boolean): void;
  enableWordCheck: boolean;
  setEnableWordCheck(bool: boolean): void;
  closeModal(): void;
}

const OptionsModal = ({
  darkMode,
  setDarkMode,
  enableWordCheck,
  setEnableWordCheck,
  closeModal,
}: OptionsModalProps) => {
  const HEIGHT = 22;
  const WIDTH = 36;
  const HANDLE_DIAMETER = HEIGHT - 4;
  const ON_COLOR = "#57af2f";

  return (
    <div className="options-modal">
      <div className="close-btn" onClick={closeModal}>
        X
      </div>
      <h3>SETTINGS</h3>
      <div className="option-container">
        <span className="option-label">Dark Theme</span>
        <Switch
          onChange={setDarkMode}
          checked={darkMode}
          height={HEIGHT}
          width={WIDTH}
          handleDiameter={HANDLE_DIAMETER}
          onColor={ON_COLOR}
          checkedIcon={false}
          uncheckedIcon={false}
        />
      </div>
      <hr />
      <div className="option-container">
        <div className="label-container">
          <span className="option-label">Visual Word Check</span>
          <span className="option-description">
            Glows red if your current guess is not a valid word.
          </span>
        </div>
        <Switch
          onChange={setEnableWordCheck}
          checked={enableWordCheck}
          height={HEIGHT}
          width={WIDTH}
          handleDiameter={HANDLE_DIAMETER}
          onColor={ON_COLOR}
          checkedIcon={false}
          uncheckedIcon={false}
        />
      </div>
      <hr />
    </div>
  );
};

export default memo(OptionsModal);
