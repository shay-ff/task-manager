import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing theme state and persistence
 * @returns {object} - Returns { theme, toggleTheme }
 */
export function useTheme() {
  // Use localStorage hook to persist theme preference
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Set data attribute for CSS custom properties
    root.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    toggleTheme
  };
}