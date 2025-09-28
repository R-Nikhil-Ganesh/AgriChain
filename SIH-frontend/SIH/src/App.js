/**
 * Main entry point for the AgriChainApp.
 * This file sets up all the necessary providers (Theme, Auth, Navigation)
 * and renders the main AppNavigator.
 */
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler'; // MUST be the first import
import { PaperProvider } from 'react-native-paper';

import { theme } from './constants/theme';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './store/AuthContext';

export default function App() {
  return (
    // The AuthProvider manages the user's login state (token, role)
    // and makes it available to the entire app.
    <AuthProvider>
      {/* The PaperProvider injects the custom theme into all 
          React Native Paper components used in the app. */}
      <PaperProvider theme={theme}>
        {/* StatusBar allows you to style the device's status bar (time, battery). */}
        <StatusBar style="auto" />
        
        {/* AppNavigator handles all screen rendering and navigation logic. */}
        <AppNavigator />
      </PaperProvider>
    </AuthProvider>
  );
}