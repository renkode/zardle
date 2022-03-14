import "../App.scss";
import { useState, useContext, memo } from "react";
import { DarkModeContext } from "../contexts/DarkModeProvider";
import { PaletteContext } from "../contexts/PaletteProvider";
import Switch from "react-switch";

interface OptionsModalProps {
  playedToday: boolean;
  guessCount: number;
  hardMode: boolean;
  setHardMode(bool: boolean): void;
  updateColors(oldColor: string, newColor: string): void;
  enableWordCheck: boolean;
  setEnableWordCheck(bool: boolean): void;
  copyDataClipboard(): void;
  importData(data: string): void;
  resetData(): void;
  displayMessage(message: string, duration: number): void;
  closeModal(): void;
}

const OptionsModal = ({
  playedToday,
  guessCount,
  hardMode,
  setHardMode,
  updateColors,
  enableWordCheck,
  setEnableWordCheck,
  copyDataClipboard,
  importData,
  resetData,
  displayMessage,
  closeModal,
}: OptionsModalProps) => {
  const HEIGHT = 22;
  const WIDTH = 36;
  const HANDLE_DIAMETER = HEIGHT - 4;
  const [importText, setImportText] = useState("");
  const { darkMode, setDarkMode } = useContext(DarkModeContext);
  const { colors, palette, setPalette } = useContext(PaletteContext);

  const toggleBodyDarkMode = (bool: boolean) => {
    bool
      ? document.body.classList.add("--dark-mode")
      : document.body.classList.remove("--dark-mode");
    setDarkMode(bool);
    // invert black/white palette swatch on dark mode toggle
    let newPalette = null;
    if (bool && palette.filter((color) => color.name === "black").length > 0) {
      // convert to white
      updateColors("black", "white");
      const whiteObj = colors.find((color) => color.name === "white");
      newPalette = palette.map((color) => {
        if (color.name === "black" && whiteObj) return whiteObj;
        return color;
      });
    } else if (
      !bool &&
      palette.filter((color) => color.name === "white").length > 0
    ) {
      // convert to black
      updateColors("white", "black");
      const blackObj = colors.find((color) => color.name === "black");
      newPalette = palette.map((color) => {
        if (color.name === "white" && blackObj) return blackObj;
        return color;
      });
    }
    if (newPalette) setPalette(newPalette);
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
            Any revealed hints must be used in subsequent guesses (cannot be
            toggled after first guess)
          </span>
        </div>
        <Switch
          onChange={setHardMode}
          checked={hardMode}
          disabled={guessCount > 0 && !playedToday}
          height={HEIGHT}
          width={WIDTH}
          handleDiameter={HANDLE_DIAMETER}
          boxShadow={"0px 0px 4px rgb(0,0,0,50%)"}
          onColor={palette[1].hex}
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
          boxShadow={"0px 0px 4px rgb(0,0,0,50%)"}
          onColor={palette[1].hex}
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
          boxShadow={"0px 0px 4px rgb(0,0,0,50%)"}
          onColor={palette[1].hex}
          checkedIcon={false}
          uncheckedIcon={false}
        />
      </div>

      <hr />

      <div className="option-container">
        <div className="label-container">
          <span className="option-label">
            Palette<span style={{ color: "red" }}> ᴺᴱᵂ</span>
          </span>
          <span className="option-description">Customize your theme</span>
        </div>
      </div>

      <div className="palette-list-container">
        <span className="palette-list">
          <span className="palette-list-label">Primary</span>
          <span className="palettes">
            {colors.map((color, index) => (
              <div
                key={index}
                className={
                  color.name === palette[1].name ? "selected" : "unselected"
                }
              >
                <div
                  className={`palette-box ${color.name}`}
                  onClick={() => {
                    if (palette[0].name === color.name) {
                      displayMessage("Color is already in use", 1200);
                      return;
                    }
                    if (color.name === "white" && !darkMode) {
                      displayMessage("Cannot use white in Light Mode", 1200);
                      return;
                    }
                    if (color.name === "black" && darkMode) {
                      displayMessage("Cannot use black in Dark Mode", 1200);
                      return;
                    }
                    updateColors(palette[1].name, color.name);
                    setPalette([palette[0], color]);
                  }}
                />
              </div>
            ))}
          </span>
        </span>
        <span className="palette-list">
          <span className="palette-list-label">Secondary</span>
          <span className="palettes">
            {colors.map((color, index) => (
              <div
                key={index}
                className={
                  color.name === palette[0].name ? "selected" : "unselected"
                }
              >
                <div
                  className={`palette-box ${color.name}`}
                  onClick={() => {
                    if (palette[1].name === color.name) {
                      displayMessage("Color is already in use", 1200);
                      return;
                    }
                    if (color.name === "white" && !darkMode) {
                      displayMessage("Cannot use white in Light Mode", 1200);
                      return;
                    }
                    if (color.name === "black" && darkMode) {
                      displayMessage("Cannot use black in Dark Mode", 1200);
                      return;
                    }
                    updateColors(palette[0].name, color.name);
                    setPalette([color, palette[1]]);
                  }}
                />
              </div>
            ))}
          </span>
        </span>
      </div>

      <hr />

      <div className="option-container">
        <div className="label-container">
          <span className="option-label">Export Data</span>
        </div>
        <button
          className={`export-btn ${palette[1].name}`}
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
        <textarea
          name="textValue"
          onChange={(e) => setImportText(e.target.value)}
          rows={3}
        />
        <button
          className={`import-btn ${palette[0].name}`}
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
        <button className="reset-btn gray" onClick={resetData}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default memo(OptionsModal);
