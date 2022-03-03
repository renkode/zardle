import "../App.scss";
import { useState, useContext, memo } from "react";
import { DarkModeContext } from "../contexts/DarkModeProvider";
import { ContrastModeContext } from "../contexts/ContrastModeProvider";
import Switch from "react-switch";

interface OptionsModalProps {
  hardMode: boolean;
  setHardMode(bool: boolean): void;
  swapToContrastColors(bool: boolean): void;
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
  swapToContrastColors,
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
  const [importText, setImportText] = useState("");
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const { contrastMode, setContrastMode } = useContext(ContrastModeContext);
  let ON_COLOR; //;
  contrastMode ? (ON_COLOR = "#ff7b23") : (ON_COLOR = "#2fbe9b");

  const toggleBodyDarkMode = (bool: boolean) => {
    bool
      ? document.body.classList.add("--dark-mode")
      : document.body.classList.remove("--dark-mode");
    setDarkMode(bool);
  };

  const toggleContrastMode = (bool: boolean) => {
    setContrastMode(bool);
    swapToContrastColors(bool);
  };

  return (
    <div className="options-modal">
      <div className="modal-header">
        <h3>SETTINGS</h3>
        <span className="close-btn" onClick={closeModal}>
          <i className="fa-solid fa-x"></i>
        </span>
      </div>

      <div className="option-container">
        <div className="label-container">
          <span className="option-label">Hard Mode</span>
          <span className="option-description">
            Any revealed hints must be used in subsequent guesses
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
          onChange={toggleBodyDarkMode}
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
          <span className="option-label">High Contrast Mode</span>
          <span className="option-description">For improved color vision</span>
        </div>
        <Switch
          onChange={toggleContrastMode}
          checked={contrastMode}
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
            Indicates if your current guess is not a valid word
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
        <button
          className={`copy-btn ${contrastMode ? "orange" : "green"}`}
          onClick={copyDataClipboard}
        >
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
        <button
          className={`import-btn ${contrastMode ? "blue" : "yellow"}`}
          onClick={() => importData(importText)}
        >
          Import
        </button>
      </div>

      <hr />

      <div className="option-container" style={{ marginBottom: "5%" }}>
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
