# React Native Signature Canvas

[![](https://img.shields.io/npm/l/react-native-signature-canvas.svg)](https://www.npmjs.com/package/react-native-signature-canvas)
[![](https://img.shields.io/npm/v/react-native-signature-canvas)](https://www.npmjs.com/package/react-native-signature-canvas)
![npm](https://img.shields.io/npm/dt/react-native-signature-canvas)
![GitHub last commit](https://img.shields.io/github/last-commit/yanyuanfe/react-native-signature-canvas)
[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://github.com/expo/expo)

A React Native component for capturing signatures or drawing on a canvas with a smooth, native feel. Works on iOS, Android, and Expo.

## Features

- ✅ **Cross-platform support** (iOS, Android, Expo)
- ✅ **Smooth, responsive drawing experience** with optimized performance
- ✅ **Customizable pen color, size, and background**
- ✅ **Support for background and overlay images**
- ✅ **Export signatures** as PNG, JPEG, or SVG
- ✅ **Undo/redo functionality**
- ✅ **Drawing and erasing modes**
- ✅ **Full TypeScript support** with enhanced type definitions
- 🆕 **Advanced error handling** with automatic recovery
- 🆕 **Performance monitoring** and optimization
- 🆕 **Flexible WebView customization** via `webviewProps`
- 🆕 **Enhanced security** with configurable restrictions
- 🆕 **Memory management** and leak prevention

## Installation

### For React Native ≥ 0.60.0 or Expo SDK ≥ 35.0.0

```bash
yarn add react-native-signature-canvas
```

or

```bash
npm install --save react-native-signature-canvas
```

> This package depends on [react-native-webview](https://github.com/react-native-webview/react-native-webview). If you're using React Native CLI (not Expo), you'll need to install react-native-webview separately:
>
> ```bash
> yarn add react-native-webview
> cd ios && pod install
> ```

### For React Native < 0.60.0 or Expo SDK < 33.0.0

```bash
npm install --save react-native-signature-canvas@1.4.2
```

## Basic Usage

```jsx
import React, { useRef, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

const SignatureScreen = () => {
  const [signature, setSignature] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef();

  const handleSignature = (signature) => {
    console.log('Signature captured:', signature);
    setSignature(signature);
    setIsLoading(false);
  };

  const handleEmpty = () => {
    console.log('Signature is empty');
    setIsLoading(false);
  };

  const handleClear = () => {
    console.log('Signature cleared');
    setSignature(null);
  };

  const handleError = (error) => {
    console.error('Signature pad error:', error);
    setIsLoading(false);
  };

  const handleEnd = () => {
    setIsLoading(true);
    ref.current?.readSignature();
  };

  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        {signature && (
          <Image
            resizeMode="contain"
            style={{ width: 335, height: 114 }}
            source={{ uri: signature }}
          />
        )}
      </View>
      <SignatureCanvas
        ref={ref}
        onEnd={handleEnd}
        onOK={handleSignature}
        onEmpty={handleEmpty}
        onClear={handleClear}
        onError={handleError}
        autoClear={true}
        descriptionText="Sign here"
        clearText="Clear"
        confirmText={isLoading ? "Processing..." : "Save"}
        penColor="#000000"
        backgroundColor="rgba(255,255,255,0)"
        webviewProps={{
          // Custom WebView optimization
          cacheEnabled: true,
          androidLayerType: "hardware",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    width: 335,
    height: 114,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
});

export default SignatureScreen;
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `androidHardwareAccelerationDisabled` | `boolean` | `false` | Disable hardware acceleration on Android |
| `autoClear` | `boolean` | `false` | Auto clear signature after clicking the Confirm button |
| `backgroundColor` | `string` | `rgba(255,255,255,0)` | Background color of the canvas |
| `bgHeight` | `number` | `0` | Height of the background image |
| `bgWidth` | `number` | `0` | Width of the background image |
| `bgSrc` | `string` | `null` | Background image source URI |
| `clearText` | `string` | `Clear` | Clear button text |
| `confirmText` | `string` | `Confirm` | Save button text |
| `customHtml` | `(injectedJavaScript: string) => string` | `null` | Custom HTML template for the canvas |
| `dataURL` | `string` | `""` | Base64 string to draw saved signature |
| `descriptionText` | `string` | `Sign above` | Description text for signature |
| `dotSize` | `number` | `null` | Radius of a single dot |
| `imageType` | `string` | `image/png` | Image type for export (`image/png`, `image/jpeg`, `image/svg+xml`) |
| `minWidth` | `number` | `0.5` | Minimum width of a line |
| `maxWidth` | `number` | `2.5` | Maximum width of a line |
| `nestedScrollEnabled` | `boolean` | `false` | Enable nested scrolling for use inside a ScrollView |
| `showsVerticalScrollIndicator` | `boolean` | `true` | Show vertical scroll indicator in WebView |
| `onOK` | `function` | - | Callback after saving non-empty signature |
| `onEmpty` | `function` | - | Callback after trying to save an empty signature |
| `onClear` | `function` | - | Callback after clearing the signature |
| `onGetData` | `function` | - | Callback when getData() is called |
| `onBegin` | `function` | - | Callback when a new stroke is started |
| `onEnd` | `function` | - | Callback when the stroke has ended |
| `onLoadEnd` | `function` | - | Callback when the WebView canvas load ended |
| `onUndo` | `function` | - | Callback when undo() is called |
| `onRedo` | `function` | - | Callback when redo() is called |
| `onDraw` | `function` | - | Callback when drawing is enabled |
| `onErase` | `function` | - | Callback when erasing is enabled |
| `onChangePenColor` | `function` | - | Callback after changing the pen color |
| `onChangePenSize` | `function` | - | Callback after changing the pen size |
| `overlayHeight` | `number` | `0` | Height of the overlay image |
| `overlayWidth` | `number` | `0` | Width of the overlay image |
| `overlaySrc` | `string` | `null` | Overlay image source URI (must be PNG with transparent background) |
| `penColor` | `string` | `black` | Color of the pen |
| `rotated` | `boolean` | `false` | Rotate signature pad 90 degrees |
| `style` | `object` | - | Style of the wrapper view |
| `scrollable` | `boolean` | `false` | Enable scrolling in the signature pad |
| `trimWhitespace` | `boolean` | `false` | Trim image whitespace |
| `webStyle` | `string` | - | WebView style to override default style |
| `webviewContainerStyle` | `object` | - | Style for the WebView container |
| `androidLayerType` | `none\|software\|hardware` | `hardware` | Sets the Android WebView layer type |
| `onError` | `function` | - | Callback when an error occurs |
| `webviewProps` | `object` | `{}` | Additional props to pass to the underlying WebView |

## Methods

Access these methods using a ref to the SignatureCanvas component.

| Method | Description |
|--------|-------------|
| `clearSignature()` | Clear the current signature |
| `changePenColor(color)` | Change pen color |
| `changePenSize(minW, maxW)` | Change pen size |
| `draw()` | Enable drawing mode |
| `erase()` | Enable erasing mode |
| `getData()` | Triggers the `onGetData` callback with signature data |
| `readSignature()` | Read the current signature and trigger callbacks |
| `undo()` | Undo last stroke |
| `redo()` | Redo last stroke |

## WebView Customization (New!)

The `webviewProps` parameter allows you to customize the underlying WebView behavior while maintaining signature functionality:

```jsx
<SignatureCanvas
  // ... other props
  webviewProps={{
    // Performance optimization
    cacheEnabled: true,
    androidLayerType: "hardware",
    androidHardwareAccelerationDisabled: false,
    
    // Security settings
    allowFileAccess: false,
    allowFileAccessFromFileURLs: false,
    mixedContentMode: "never",
    
    // UI customization
    decelerationRate: 'fast',
    bounces: false,
    
    // Any other WebView props...
  }}
/>
```

### Performance Optimization Examples

```jsx
// High-performance mode
<SignatureCanvas
  webviewProps={{
    cacheEnabled: true,
    androidLayerType: "hardware",
    androidHardwareAccelerationDisabled: false,
  }}
/>

// Low-memory mode
<SignatureCanvas
  webviewProps={{
    cacheEnabled: false,
    androidLayerType: "software",
    androidHardwareAccelerationDisabled: true,
  }}
/>
```

## Error Handling (Enhanced!)

```jsx
const [error, setError] = useState(null);

const handleError = (error) => {
  console.error('Signature error:', error);
  setError(error.message);
  // Error recovery is automatic, but you can handle it here
};

<SignatureCanvas
  onError={handleError}
  // Component automatically retries on recoverable errors
/>

{error && (
  <Text style={{ color: 'red' }}>Error: {error}</Text>
)}
```

## Advanced Usage

### Using a Background Image

```jsx
const imgWidth = 300;
const imgHeight = 200;
const style = `.m-signature-pad {box-shadow: none; border: none; } 
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${imgWidth}px; height: ${imgHeight}px;}`;

<View style={{ width: imgWidth, height: imgHeight }}>
  <SignatureCanvas
    ref={ref}
    bgSrc="https://example.com/background.jpg"
    bgWidth={imgWidth}
    bgHeight={imgHeight}
    webStyle={style}
    onOK={handleSignature}
  />
</View>
```

### Using an Overlay Image

```jsx
const imgWidth = 256;
const imgHeight = 256;
const style = `.m-signature-pad {box-shadow: none; border: none; } 
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${imgWidth}px; height: ${imgHeight}px;}`;

<View style={{ width: imgWidth, height: imgHeight }}>
  <SignatureCanvas
    ref={ref}
    overlaySrc="https://example.com/overlay.png" // Must be PNG with transparent background
    overlayWidth={imgWidth}
    overlayHeight={imgHeight}
    webStyle={style}
    onOK={handleSignature}
  />
</View>
```

### Using in a Modal

```jsx
import React, { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, Text } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

const SignatureModal = ({ onSignature }) => {
  const [show, setShow] = useState(false);
  const ref = useRef();
  
  const handleSignature = (signature) => {
    onSignature(signature);
    setShow(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShow(true)}>
        <Text>Open Signature Pad</Text>
      </TouchableOpacity>
      
      {show && (
        <Modal>
          <SignatureCanvas
            ref={ref}
            onOK={handleSignature}
            onEmpty={() => console.log('Empty')}
            descriptionText="Sign here"
            penColor="rgba(255,117,2,1)"
          />
        </Modal>
      )}
    </View>
  );
};
```

### Scrollable Signature Canvas

```jsx
import React, { useRef, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

const ScrollableSignature = () => {
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const signatureRef = useRef(null);

  return (
    <ScrollView scrollEnabled={scrollEnabled}>
      <View style={styles.container}>
        <SignatureCanvas
          ref={signatureRef}
          style={styles.canvas}
          onBegin={() => setScrollEnabled(false)}
          onEnd={() => setScrollEnabled(true)}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  canvas: {
    width: '90%',
    height: 300,
    borderWidth: 1,
    borderColor: '#000',
  },
});
```

## Performance & Reliability

### Automatic Error Recovery
- **Smart retry logic** with exponential backoff
- **Circuit breaker pattern** to prevent cascading failures  
- **Memory leak prevention** with automatic cleanup
- **Performance monitoring** with automatic optimization

### Performance Features
- **Debounced resize handling** for smooth interaction
- **Memory pressure detection** with adaptive optimization
- **Optimized rendering** with reduced re-renders
- **Device-specific optimization** based on hardware capabilities

### Security Enhancements
- **Configurable WebView security** via `webviewProps`
- **Input validation** for all methods and callbacks
- **XSS protection** with content security policies
- **File access restrictions** by default

## Migration Guide

### From v4.6.x to v4.7.x

This version is fully backward compatible. New features:

```jsx
// NEW: Enhanced error handling
<SignatureCanvas
  onError={(error) => console.error(error)} // New callback
/>

// NEW: WebView customization
<SignatureCanvas
  webviewProps={{ // New prop
    cacheEnabled: false,
    androidLayerType: "software"
  }}
/>
```

## Troubleshooting

### Common Issues

**Issue**: Signature pad not loading
```jsx
// Solution: Add error handling and check WebView props
<SignatureCanvas
  onError={(error) => console.log('Error:', error)}
  onLoadEnd={() => console.log('Loaded successfully')}
  webviewProps={{
    startInLoadingState: true,
    renderLoading: () => <ActivityIndicator />
  }}
/>
```

**Issue**: Poor performance on older devices
```jsx
// Solution: Use low-performance mode
<SignatureCanvas
  webviewProps={{
    androidLayerType: "software",
    androidHardwareAccelerationDisabled: true,
    cacheEnabled: false
  }}
/>
```

**Issue**: Memory issues
```jsx
// Solution: The component now handles this automatically
// But you can customize via webviewProps if needed
<SignatureCanvas
  webviewProps={{
    cacheEnabled: false, // Reduce memory usage
    androidLayerType: "software" // Use software rendering
  }}
/>
```

## API Reference

For detailed API documentation, see:
- [WEBVIEW_PROPS.md](./WEBVIEW_PROPS.md) - WebView customization guide
- [TypeScript definitions](./index.d.ts) - Complete type definitions

## Core Technology

This component is built on:
- [signature_pad.js](https://github.com/szimek/signature_pad) for the core signature functionality
- React Native WebView for cross-platform rendering
- Enhanced with performance monitoring and error recovery systems

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to help improve this component.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/YanYuanFE/react-native-signature-canvas.git

# Install dependencies
cd react-native-signature-canvas
npm install

# Run example apps
cd example/expo-app
npm install && npm start
```

## Changelog

### v4.7.x (Latest)
- 🆕 Added `webviewProps` for WebView customization
- 🆕 Enhanced error handling with automatic recovery
- 🆕 Performance monitoring and optimization
- 🆕 Memory leak prevention
- 🆕 Improved TypeScript definitions
- 🔧 Fixed global variable pollution in WebView JavaScript
- 🔧 Added input validation for all methods
- ⚡ Optimized rendering performance

[View full changelog](./CHANGELOG.md)

## License

MIT License - see [LICENSE](./LICENSE) file for details.


## Buy Me a Coffee ☕

If you find this project helpful, consider supporting its development with cryptocurrency donations:

### Cryptocurrency Donations

| Currency | Address | QR Code |
|----------|---------|----------|
| **Bitcoin (BTC)** | `bc1phyz9agr0m9l2w9pd8w85w4da2jt3wl4cre7vv0qq4uesm3fv00pscu96tux` | ![BTC QR](https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=bc1phyz9agr0m9l2w9pd8w85w4da2jt3wl4cre7vv0qq4uesm3fv00pscu96tux) |
| **Ethereum (ETH)** | `0xf5dfe16b1e64e8e3a92063fb2922447e13b48945` | ![ETH QR](https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=0xf5dfe16b1e64e8e3a92063fb2922447e13b48945) |
| **Solana (SOL)** | `3VuhyeTj3hMSrmzq7NctHkgFxvJrmtAUQTzagEBEu3Vm` | ![SOL QR](https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=3VuhyeTj3hMSrmzq7NctHkgFxvJrmtAUQTzagEBEu3Vm) |


### Other Ways to Support

- ⭐ Star this repository
- 🐛 Report bugs and issues
- 💡 Suggest new features
- 🤝 Contribute code improvements
- 📢 Share this project with others

Your support helps maintain and improve this open-source project. Thank you! 🙏

---

**Made with ❤️ for the React Native community**
