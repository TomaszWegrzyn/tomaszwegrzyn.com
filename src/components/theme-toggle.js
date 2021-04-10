import React from 'react';

import { ThemeToggler } from "gatsby-plugin-dark-mode"
import { DarkModeSwitch } from 'react-toggle-dark-mode';
export default function ThemeToggle() {
  return (
    <ThemeToggler>
      {({ theme, toggleTheme }) => (
        <DarkModeSwitch
          checked={theme === "dark"}
          onChange={e => toggleTheme(e ? "dark" : "light")}
          size={24}
          sunColor='Gold'
        />
      )}
    </ThemeToggler>
  )
}
