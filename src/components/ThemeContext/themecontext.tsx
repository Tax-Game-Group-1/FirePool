// contexts/ThemeContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';
import "./themes.scss";
import Themes from "./themes.module.scss";
// export enum ThemeType {
//   PALEBLUE,
//   DARKBLUE,
//   DARDRED,
// }

type ThemeType = string;

interface ThemeContextProps {
  theme: string;
  toggleTheme: () => void;
}

const defaultThemeContext:ThemeContextProps = {
	theme: Themes.darkBlue,
	toggleTheme: () => {},
}

const ThemeContext = createContext(defaultThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeType>(defaultThemeContext.theme);

  const toggleTheme = () => {
	let themesArr = Object.values(Themes);
	let index = themesArr.indexOf(theme);
	let newIndex = (index+1) % themesArr.length;
	console.log({index,newIndex, i:themesArr[index], n:themesArr[newIndex]})
    setTheme(themesArr[newIndex]);
  };

  return (
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
  return context;
};
