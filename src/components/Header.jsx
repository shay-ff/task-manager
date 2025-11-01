import React from 'react';
import { useThemeContext } from '../contexts/ThemeContext';
import './Header.css';

/**
 * Header component with app title and theme toggle functionality
 * @returns {JSX.Element} - Header component
 */
function Header() {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Task Manager</h1>
        
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span className="theme-icon" aria-hidden="true">
            {theme === 'light' ? '🌙' : '☀️'}
          </span>
          <span className="theme-text">
            {theme === 'light' ? 'Dark' : 'Light'}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;