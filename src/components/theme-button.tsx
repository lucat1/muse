import * as React from "react";
import { SunIcon as Sun, MoonIcon as Moon } from "@heroicons/react/24/solid";

import IconButton from "./icon-button";

const ThemeButton: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = ({ children: _, ...props }) => {
  const [isDark, setDark] = React.useState(
    document.documentElement.classList.contains("dark")
  );
  const toggleDarkMode = () => {
    localStorage.setItem("theme", isDark ? "light" : "dark");
    setDark(!isDark);
    (window as any).updateTheme();
  };
  return (
    <IconButton
      {...props}
      role="switch"
      aria-label={`${isDark ? "Disable" : "Enable"}dark mode`}
      aria-checked={isDark}
      onClick={toggleDarkMode}
    >
      {isDark ? <Moon /> : <Sun />}
    </IconButton>
  );
};

export default ThemeButton;
