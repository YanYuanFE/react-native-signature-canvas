# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `react-native-signature-canvas`, a React Native library for capturing signatures and drawing on a canvas. The library provides a WebView-based signature pad component with smooth drawing capabilities across iOS, Android, and Expo.

## Core Architecture

The library uses a hybrid architecture combining React Native and web technologies:

- **Main Component** (`index.js`): The React Native component that wraps a WebView
- **WebView Content** (`h5/`): HTML, CSS, and JavaScript that runs inside the WebView
  - `html.js`: HTML template with placeholder variables for configuration
  - `js/signature_pad.js`: Core signature pad functionality 
  - `js/app.js`: Application logic for handling signature interactions
  - `css/signature-pad.css`: Styling for the signature pad interface
- **TypeScript Definitions** (`index.d.ts`): Type definitions for props and ref methods

### Key Technical Details

1. **Communication**: React Native communicates with the WebView through:
   - `injectedJavaScript`: JavaScript code injected into the WebView
   - `onMessage`: Messages sent from WebView to React Native
   - Template variables in HTML (e.g., `<%penColor%>`, `<%bgSrc%>`)

2. **Signature Export**: Signatures are captured as base64 data URLs and passed back to React Native via the WebView message bridge

3. **Customization**: The component supports extensive customization through props that modify the injected HTML/CSS/JS

## Common Development Commands

### Example Apps
The repository contains multiple example applications for different use cases:

```bash
# React Native CLI app with TypeScript
cd example/signapp && npm run android
cd example/signapp && npm run ios

# Expo app with modern Expo Router
cd example/expo-app && npm start
cd example/expo-app && npm run android
cd example/expo-app && npm run ios

# Basic React Native CLI app
cd example/exampleApp && npm start
```

### Testing
```bash
# Run tests in example apps
cd example/signapp && npm test
cd example/expo-app && npm test
```

### Linting
```bash
# Lint example apps
cd example/signapp && npm run lint
cd example/expo-app && npm run lint
```

## Development Notes

### Modifying the Core Component
- The main component logic is in `index.js`
- WebView HTML template is in `h5/html.js` 
- JavaScript functionality is split between `h5/js/signature_pad.js` and `h5/js/app.js`

### Adding New Features
1. Add props to the main component interface
2. Update TypeScript definitions in `index.d.ts`
3. Modify the HTML template in `h5/html.js` if UI changes are needed
4. Update the injected JavaScript in `h5/js/app.js` for new functionality
5. Test across multiple example apps to ensure compatibility

### Example App Structure
- `signapp/`: Full React Native CLI app with TypeScript and Jest testing
- `expo-app/`: Modern Expo app with Expo Router and TypeScript
- `exampleApp/`: Basic React Native CLI app
- `expo-app1/`, `signapp1/`, `sign-app/`, `ts-expo/`: Various other example configurations

### Dependencies
- Main library only has peer dependency on `react-native-webview`
- Example apps include additional dependencies for testing and development
- No build process required for the main library (it's a pure React Native component)