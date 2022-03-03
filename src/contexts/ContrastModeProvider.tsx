import { createContext, useState, FC } from "react";

interface ContrastModeContextState {
  contrastMode: boolean;
  setContrastMode: (bool: boolean) => void;
}

const initialContrastModeState: ContrastModeContextState = {
  contrastMode: false,
  setContrastMode: () => null,
};

export const ContrastModeContext = createContext<ContrastModeContextState>(
  initialContrastModeState
);

const ContrastModeProvider: FC = ({ children }) => {
  const [contrastMode, setContrastMode] = useState(
    initialContrastModeState.contrastMode
  );

  return (
    <ContrastModeContext.Provider value={{ contrastMode, setContrastMode }}>
      {children}
    </ContrastModeContext.Provider>
  );
};

export default ContrastModeProvider;
