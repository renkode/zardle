import { createContext, useState, FC } from "react";

interface PaletteContextState {
  colors: Array<{ name: string; hex: string; emoji: string }>;
  palette: Array<{ name: string; hex: string; emoji: string }>;
  setPalette: ([]) => void;
}

export const initialPaletteState: PaletteContextState = {
  colors: [
    { name: "red", hex: "#e82a2a", emoji: "🟥" },
    { name: "orange", hex: "#ff7b23", emoji: "🟧" },
    { name: "yellow", hex: "#ebb800", emoji: "🟨" },
    { name: "green", hex: "#2fbe9b", emoji: "🟩" },
    { name: "blue", hex: "#36a1f7", emoji: "🟦" },
    { name: "purple", hex: "#924bcc", emoji: "🟪" },
    { name: "brown", hex: "#944f26", emoji: "🟫" },
    { name: "white", hex: "#ffffff", emoji: "⬜" },
    { name: "black", hex: "#171717", emoji: "⬛" },
  ],
  palette: [
    { name: "yellow", hex: "#ddb917", emoji: "🟨" },
    { name: "green", hex: "#2fbe9b", emoji: "🟩" },
  ],
  setPalette: () => null,
};

export const PaletteContext =
  createContext<PaletteContextState>(initialPaletteState);

const PaletteProvider: FC = ({ children }) => {
  const colors = initialPaletteState.colors;
  const [palette, setPalette] = useState(initialPaletteState.palette);

  return (
    <PaletteContext.Provider value={{ colors, palette, setPalette }}>
      {children}
    </PaletteContext.Provider>
  );
};

export default PaletteProvider;
