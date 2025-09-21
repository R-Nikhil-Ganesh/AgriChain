

---
### 1. Navigation
These packages are used to manage the flow between different screens in your app.
* **`@react-navigation/native`**: The core library for React Navigation.
* **`@react-navigation/stack`**: Provides a way for your app to transition between screens where each new screen is placed on top of a stack.
* **`@react-navigation/bottom-tabs`**: Used to create the tab bar at the bottom of the screen for each user role.

---
### 2. UI & Styling
These libraries provide the visual components for your app.
* **`react-native-paper`**: The main component library for buttons, cards, text inputs, etc.
* **`react-native-svg`**: A dependency required for rendering SVG graphics, used by the QR code library.
* **`react-native-qrcode-svg`**: Used to generate and display the QR codes.

---
### 3. Device & API Functionality
These packages handle interactions with the device hardware and your backend.
* **`expo-camera`**: Provides access to the device's camera for scanning QR codes.
* **`expo-barcode-scanner`**: The specific module that handles the logic for detecting and decoding QR codes from the camera view.
* **`@react-native-async-storage/async-storage`**: A simple, unencrypted, asynchronous storage system to save the user's login token on their device.
* **`axios`**: Used to make HTTP requests to your Hyperledger backend API.

---
### 4. Web Support
These are required to make your React Native app run in a web browser.
* **`react-native-web`**: Provides web compatibility for React Native components.
* **`react-dom`**: A required dependency for rendering React components in a browser.

---
### 5. Required Peer Dependencies
These are essential libraries that the navigation components rely on to work correctly.
* **`react-native-screens`**: Optimizes memory usage for screens in the navigation stack.
* **`react-native-safe-area-context`**: A library to handle the safe area insets on devices with notches and other intrusions.
