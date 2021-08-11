# react-native-signature-canvas

[![](https://img.shields.io/npm/l/react-native-signature-canvas.svg)](https://www.npmjs.com/package/react-native-signature-canvas)
[![](https://img.shields.io/npm/v/react-native-signature-canvas)](https://www.npmjs.com/package/react-native-signature-canvas)
![npm](https://img.shields.io/npm/dt/react-native-signature-canvas)
![GitHub last commit](https://img.shields.io/github/last-commit/yanyuanfe/react-native-signature-canvas)
[![runs with expo](https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat&logo=EXPO&labelColor=f3f3f3&logoColor=000)](https://github.com/expo/expo)

React Native Signature Component based Canvas for Android &amp;&amp; IOS &amp;&amp; expo

- Supports Android and iOS and Expo
- Pure JavaScript implementation with no native dependencies
- Tested with RN 0.50
- Core use [signature_pad.js](https://github.com/szimek/signature_pad)
- Only depend on react and react native
- Generates a base64 encoded png image of the signature
  Note: Expo support for React Native Signature Canvas v1.5.0 started with Expo SDK v33.0.0.

## Installation(for React Native V0.60.0 or Expo SDK v35.0.0)

```bash
yarn add react-native-signature-canvas
```

or

```bash
npm install --save react-native-signature-canvas
```

## Installation(for React Native V0.5x.x or Expo SDK < v33)

```bash
npm install --save react-native-signature-canvas@1.4.2
```

## Usage
Basic
```js
import Signature from "react-native-signature-canvas";
```
Custom
```js
import SignatureScreen from 'react-native-signature-canvas';
```

## Properties

---

| Prop                                |    Type    | Description                                                                                                                                           |
| :---------------------------------- | :--------: | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| androidHardwareAccelerationDisabled | `boolean`  | androidHardwareAccelerationDisabled for react-native-webview. Default is false                                                                        |
| autoClear                           | `boolean`  | should auto clear the signature after clicking the Confirm button                                                                                     |
| backgroundColor                     |  `string`  | default is "rgba(255,255,255,0)" (_transparent_), background color of the canvas                                                                                           |
| bgHeight                            |  `number`  | height of the background image                                                                                                                        |
| bgWidth                             |  `number`  | width of the background image                                                                                                                         |
| bgSrc                               |  `string`  | background image source uri (_url_)                                                                                                                  |
| clearText                           |  `string`  | clear button text                                                                                                                                     |
| confirmText                         |  `string`  | save button text                                                                                                                                      |
| customHtml                          | `function` | html string that lets you modify things like the layout or elements                                                                                   |
| dataURL                             |  `string`  | default is "", Base64 string, draws saved signature from dataURL.                                                                                     |
| descriptionText                     |  `string`  | description text for signature                                                                                                                        |
| dotSize                             |  `number`  | radius of a single dot _(not stroke width)_                                                                                                           |
| imageType                           |  `string`  | "image/png" (_default_), "image/jpeg"、"image/svg+xml", imageType of exported signature                                                               |
| minWidth                            |  `number`  | minimum width of a line. Defaults to 0.5                                                                                                              |
| maxWidth                            |  `number`  | maximum width of a line. Defaults to 2.5                                                                                                              |
| onOK                                | `function` | callback function after saving non-empty signature                                                                                                    |
| onEmpty                             | `function` | callback function after trying to save an empty signature                                                                                             |
| onClear                             | `function` | callback function after clearing the signature                                                                                                        |
|onGetData|`function`|callback function when getData() is called
| onBegin                             | `function` | callback function when a new stroke is started                                                                                                        |
| onEnd                               | `function` | callback function when the stroke has ended                                                                                                           |
| onUndo                              | `function` | callback function when undo() is called |
| onRedo                              | `function` | callback function when redo() is called |
| onDraw                              | `function` | callback function when drawing is enabled                                                                                                             |
| onErase                             | `function` | callback function when erasing is enabled                                                                                                             |
| onChangePenColor                    | `function` | callback function after changing the pen color |
| onChangePenSize | `function` | callback function after changing the pen size
|overlayHeight|`number`|height of the overlay image|
|overlayWidth|`number`|width of the overlay image|
|overlaySrc|`string`|overlay image source uri (url) _must be .png with a transparent background_
| penColor                            |  `string`  | default is "black", color of pen                                                                                                                      |
| rotated                             | `boolean`  | rotate signature pad 90 degrees                                                                                                                       |
| style                               |  `object`  | style of wrapper view                                                                                                                                 |
| trimWhitespace                      | `boolean`  | trim image whitespace                                                                                                                                 |
| webStyle                            |  `string`  | webview style for overwrite default style, all style: https://github.com/YanYuanFE/react-native-signature-canvas/blob/master/h5/css/signature-pad.css |

## Methods

---

| Function                  | Description                                                                                     |
| :--------------------     | :-----------------------------------------------------------------------------------------------|
| clearSignature()          | Clear the current signature                                                                     |
| changePenColor(color)     | Change pen color                                                                                |
| changePenSize(minW, maxW) | Change pen size                                                                                 |
| draw()                    | Enable drawing signature                                                                        |
| erase()                   | Enable erasing signature                                                                        |
| getData()                 | Triggers the `onGetData` callback with a single `data` JSON string                              |
| readSignature()           | Reads the current signature on the canvas and triggers either the `onOK` or `onEmpty` callbacks |
| undo()                    | Undo last stroke                                                                                |
| redo()                    | Redo last stroke                                                                                |

To call the methods use the `useRef` hook:

```js
import SignatureScreen from "react-native-signature-canvas";

const Sign = ({ text, onOK }) => {
  const ref = useRef();

  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature) => {
    console.log(signature);
    onOK(signature); // Callback from Component props
  };

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    console.log("Empty");
  };

  // Called after ref.current.clearSignature()
  const handleClear = () => {
    console.log("clear success!");
  };

  // Called after end of stroke
  const handleEnd = () => {
    ref.current.readSignature();
  };

  // Called after ref.current.getData()
  const handleData = (data) => {
    console.log(data);
  };

  return (
    <SignatureScreen
      ref={ref}
      onEnd={handleEnd}
      onOK={handleOK}
      onEmpty={handleEmpty}
      onClear={handleClear}
      onGetData={handleData}
      autoClear={true}
      descriptionText={text}
    />
  );
};

export default Sign;
```
## Using a background image
You can use a non-erasable background image to draw your signature on using the `bgSrc` prop. Make sure to provide the width and height of the image.

```js
const imgWidth = 300;
const imgHeight = 200;
const style = `.m-signature-pad {box-shadow: none; border: none; } 
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${imgWidth}px; height: ${imgHeight}px;}`;
...
<View style={{ width: imgWidth, height: imgHeight }}>
  <SignatureScreen
    ref={ref}
    bgSrc="https://via.placeholder.com/300x200/ff726b"
    bgWidth={imgWidth}
    bgHeight={imgHeight}
    webStyle={style}
    onOK={handleOK}
  />
</View>
```

## Using an overlay image
An overlay is a non-erasable image that can be used as a guideline similar to a colouring book. Make sure the image format is .png and that it has a transparent background. Also, don't forget to provide the width and height of the image.
Use the `overlaySrc` prop to provide the link.

```js
const imgWidth = 256;
const imgHeight = 256;
const style = `.m-signature-pad {box-shadow: none; border: none; } 
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              width: ${imgWidth}px; height: ${imgHeight}px;}`;
...
<View style={{ width: imgWidth, height: imgHeight }}>
  <SignatureScreen
    ref={ref}
    overlaySrc="http://pngimg.com/uploads/circle/circle_PNG63.png"
    overlayWidth={imgWidth}
    overlayHeight={imgHeight}
    webStyle={style}
    onOK={handleOK}
  />
</View>
```

## Save Base64 Image as File

If you're using expo, you can use **expo-file-system** to save the base64 image as a local file; if you're working with react-native-cli, use **react-native-fs**.

```js
import * as FileSystem from "expo-file-system";

const handleOK = (signature) => {
  const path = FileSystem.cacheDirectory + "sign.png";
  FileSystem.writeAsStringAsync(
    path,
    signature.replace("data:image/png;base64,", ""),
    { encoding: FileSystem.EncodingType.Base64 }
  )
    .then(() => FileSystem.getInfoAsync(path))
    .then(console.log)
    .catch(console.error);
};
```

## Basic parameters

```js
<Signature
  // handle when you click save button
  onOK={(img) => console.log(img)}
  onEmpty={() => console.log("empty")}
  // description text for signature
  descriptionText="Sign"
  // clear button text
  clearText="Clear"
  // save button text
  confirmText="Save"
  // String, webview style for overwrite default style, all style: https://github.com/YanYuanFE/react-native-signature-canvas/blob/master/h5/css/signature-pad.css
  webStyle={`.m-signature-pad--footer
    .button {
      background-color: red;
      color: #FFF;
    }`}
  autoClear={true}
  imageType={"image/svg+xml"}
/>
```

If you create your own triggers for the readSignature and/or clearSignature you can hide the built in Clear and Save buttons with css styles passed into the **webStyle** property.

```js
const webStyle = `.m-signature-pad--footer
    .save {
        display: none;
    }
    .clear {
        display: none;
    }
`;
...
  <Signature
    webStyle={webStyle}
    onOK={handleOK}
    onEmpty={handleEmpty}
    onEnd={handleEnd}
  />

```

## Custom Button for Confirm and Clear

```js
import React, { useRef } from "react";
import { StyleSheet, View, Button } from "react-native";
import SignatureScreen from "react-native-signature-canvas";

const Sign = ({ onOK }) => {
  const ref = useRef();

  const handleOK = (signature) => {
    console.log(signature);
    onOK(signature);
  };

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    console.log("end");
    ref.current.readSignature();
  };

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  return (
    <View style={styles.container}>
      <SignatureScreen ref={ref} onOK={handleOK} webStyle={style} />
      <View style={styles.row}>
        <Button title="Clear" onPress={handleClear} />
        <Button title="Confirm" onPress={handleConfirm} />
      </View>
    </View>
  );
};

export default Sign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 250,
    padding: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
});
```

## Example

- Android <br/>
  <img src="http://img.yanyuanfe.cn/signature-android.png" width="400" />

- iOS <br/>
  <img src="http://img.yanyuanfe.cn/signature-ios.png" width="400" />

```js
import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Signature from "react-native-signature-canvas";

export const SignatureScreen = () => {
  const [signature, setSign] = useState(null);

  const handleOK = (signature) => {
    console.log(signature);
    setSign(signature);
  };

  const handleEmpty = () => {
    console.log("Empty");
  };

  const style = `.m-signature-pad--footer
    .button {
      background-color: red;
      color: #FFF;
    }`;
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.preview}>
        {signature ? (
          <Image
            resizeMode={"contain"}
            style={{ width: 335, height: 114 }}
            source={{ uri: signature }}
          />
        ) : null}
      </View>
      <Signature
        onOK={handleOK}
        onEmpty={handleEmpty}
        descriptionText="Sign"
        clearText="Clear"
        confirmText="Save"
        webStyle={style}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  preview: {
    width: 335,
    height: 114,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10,
  },
});
```

## Using Typescript

To use Typescript just import `SignatureViewRef` and in [useRef hook](https://reactjs.org/docs/hooks-reference.html#useref) inform that the reference is of the `SignatureViewRef` type, with that the regular `ref` methods will be available.

```ts
import React, { useRef } from "react";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";

interface Props {
  text: string;
  onOK: (signature) => void;
}

const Sign: React.FC<Props> = ({ text, onOK }) => {
  const ref = useRef<SignatureViewRef>(null);

  const handleSignature = (signature) => {
    console.log(signature);
    onOK(signature);
  };

  const handleEmpty = () => {
    console.log("Empty");
  };

  const handleClear = () => {
    console.log("clear success!");
  };

  const handleEnd = () => {
    ref.current?.readSignature();
  };

  return (
    <SignatureScreen
      ref={ref}
      onEnd={handleEnd}
      onOK={handleSignature}
      onEmpty={handleEmpty}
      onClear={handleClear}
      autoClear={true}
      descriptionText={text}
    />
  );
};

export default Sign;
```

## Example inside ScrollView

When using `react-native-signature-canvas` inside a ScrollView, you will only get a point on the canvas and the ScrollView will handle the gesture making it unused for the canvas.
The work around is to use the `scrollEnabled` prop of `ScrollView`.
Here an example:

```
import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import Signature from 'react-native-signature-canvas';

const SignInScroll = () => {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <ScrollView scrollEnabled={scrollEnabled}>
      <View style={{height: 300}}>
        <Signature
          onOK={(img) => console.log(img)}
          onBegin={() => setScrollEnabled(false)}
          onEnd={() => setScrollEnabled(true)}
          descriptionText="Sign"
          clearText="Clear"
          confirmText="Save"
          imageType="image/jpeg"
        />
      </View>
    </ScrollView>
  );
};

export default SignInScroll;
```
