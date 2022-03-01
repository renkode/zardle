import "../App.css";
import { useState, memo } from "react";
import Switch from "react-switch";

interface OptionsModalProps {
  hardMode: boolean;
  setHardMode(bool: boolean): void;
  darkMode: boolean;
  setDarkMode(bool: boolean): void;
  enableWordCheck: boolean;
  setEnableWordCheck(bool: boolean): void;
  copyDataClipboard(): void;
  importData(data: string): void;
  resetData(): void;
  closeModal(): void;
}

const OptionsModal = ({
  hardMode,
  setHardMode,
  darkMode,
  setDarkMode,
  enableWordCheck,
  setEnableWordCheck,
  copyDataClipboard,
  importData,
  resetData,
  closeModal,
}: OptionsModalProps) => {
  const HEIGHT = 22;
  const WIDTH = 36;
  const HANDLE_DIAMETER = HEIGHT - 4;
  const ON_COLOR = "#80bb34";
  const [importText, setImportText] = useState("");

  return (
    <div className="options-modal">
      <div className="close-btn" onClick={closeModal}>
        X
      </div>
      <h3>SETTINGS</h3>
      <div className="option-container">
        <div className="label-container">
          <span className="option-label">Hard Mode</span>
          <span className="option-description">
            Any revealed hints must be used in subsequent guesses.
          </span>
        </div>
        <Switch
          onChange={setHardMode}
          checked={hardMode}
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

      <div className="option-container">
        <div className="label-container">
          <span className="option-label">Export Data</span>
        </div>
        <button className="copy-btn" onClick={copyDataClipboard}>
          Copy
        </button>
      </div>

      <hr />

      <div className="option-container">
        <div className="label-container">
          <span className="option-label">Import Data</span>
        </div>
      </div>
      <div className="import-container">
        {" "}
        <textarea
          name="textValue"
          onChange={(e) => setImportText(e.target.value)}
          rows={4}
        />
        <button className="import-btn" onClick={() => importData(importText)}>
          Import
        </button>
      </div>

      <hr />

      <div className="option-container">
        <div className="label-container">
          <span className="option-label">Reset Data</span>
        </div>
        <button className="reset-btn" onClick={resetData}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default memo(OptionsModal);
