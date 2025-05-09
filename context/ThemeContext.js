import { createContext, useState, useEffect } from 'react';
import { Appearance } from 'react-native';
import { Colors } from '../constants/Colors';

// Create the context with default values
export const ThemeContext = createContext({
  colorScheme: 'light',
  setColorScheme: () => {},
  theme: Colors.light
});

export const ThemeProvider = ({ children }) => {
  // Initialize with system color scheme or light as fallback
  const [colorScheme, setColorScheme] = useState(
    Appearance.getColorScheme() || 'light'
  );

  // Listen for system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme: newColorScheme }) => {
      setColorScheme(newColorScheme);
    });
    
    // Clean up subscription on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  // Determine the current theme based on color scheme
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider 
      value={{
        colorScheme, 
        setColorScheme, 
        theme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};