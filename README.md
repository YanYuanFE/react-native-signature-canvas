# React Native Signature Canvas

[![](https://img.shields.io/npm/l/react-native-signature-canvas.svg)](https://www.npmjs.com/package/react-native-signature-canvas)
[![](https://img.shields.io/npm/v/react-native-signature-canvas)](https://www.npmjs.com/package/react-native-signature-canvas)
![npm](https://img.shields.io/npm/dt/react-native-signature-canvas)
![GitHub last commit](https://img.shields.io/github/last-commit/yanyuanfe/react-native-signature-canvas)
[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://github.com/expo/expo)

A React Native component for capturing signatures or drawing on a canvas with a smooth, native feel. Works on iOS, Android, and Expo.

## Features

- Cross-platform support (iOS, Android, Expo)
- Smooth, responsive drawing experience
- Customizable pen color, size, and background
- Support for background and overlay images
- Export signatures as PNG, JPEG, or SVG
- Undo/redo functionality
- Drawing and erasing modes
- TypeScript support

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
  const ref = useRef();

  const handleSignature = (signature) => {
    console.log(signature);
    setSignature(signature);
  };

  const handleEmpty = () => {
    console.log('Empty');
  };

  const handleClear = () => {
    console.log('Clear success!');
  };

  const handleEnd = () => {
    ref.current.readSignature();
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
        autoClear={true}
        descriptionText="Sign here"
        clearText="Clear"
        confirmText="Save"
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

## Core Technology

This component is built on:
- [signature_pad.js](https://github.com/szimek/signature_pad) for the core signature functionality
- React Native WebView for cross-platform rendering

## License

MIT
