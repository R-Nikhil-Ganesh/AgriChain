import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2e7d32', // A nice, deep green
    primaryContainer: '#c8e6c9',
    secondary: '#5d4037', // Earthy brown
    secondaryContainer: '#d7ccc8',
    tertiary: '#f9a825', // A warm accent color like sunflower yellow
    background: '#f5f5f5', // Light grey background
    surface: '#ffffff', // White for cards and surfaces
    error: '#d32f2f',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#000000',
    onSurface: '#000000',
  },
};