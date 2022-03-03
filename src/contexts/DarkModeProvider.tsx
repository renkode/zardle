import { createContext, useState, FC } from "react";

interface DarkModeContextState {
  darkMode: boolean;
  setDarkMode: (bool: boolean) => void;
}

const initialDarkModeState: DarkModeContextState = {
  darkMode: false,
  setDarkMode: () => null,
};

export const DarkModeContext =
  createContext<DarkModeContextState>(initialDarkModeState);

const DarkModeProvider: FC = ({ children }) => {
  const [darkMode, setDarkMode] = useState(initialDarkModeState.darkMode);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeProvider;
