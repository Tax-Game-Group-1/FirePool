// contexts/ThemeContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';
export enum AvailableThemes {
  PALEBLUE,
  DARKBLUE,
}

interface ThemeContextProps {
  theme: AvailableThemes;
  toggleTheme: () => void;
  getThemeClass: () => AvailableThemes;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<AvailableThemes>(AvailableThemes.DARKBLUE);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === AvailableThemes.PALEBLUE ? AvailableThemes.DARKBLUE : AvailableThemes.PALEBLUE));
  };

  const getThemeClass = () : AvailableThemes => {
    const t = require('./themes.module.scss')
    switch (theme) {
      case AvailableThemes.DARKBLUE:
        return t.darkBlue
      case AvailableThemes.PALEBLUE:
        return t.paleBlue
    }
  }

  return (
      <ThemeContext.Provider value={{ theme, toggleTheme, getThemeClass }}>
        {children}
      </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
