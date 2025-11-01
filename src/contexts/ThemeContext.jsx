import React, { createContext, useContext } from 'react';
import { useTheme } from '../hooks/useTheme';

// Create the Theme Context
const ThemeContext = createContext(undefined);

/**
 * ThemeProvider component that provides theme state and toggle function to the component tree
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} - ThemeProvider component
 */
export function ThemeProvider({ children }) {
  // Use the custom useTheme hook for state management
  const themeValue = useTheme();

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook to consume the Theme Context
 * @returns {object} - Theme context value with theme and toggleTheme
 * @throws {Error} - If used outside of ThemeProvider
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  
  return context;
}

export default ThemeContext;