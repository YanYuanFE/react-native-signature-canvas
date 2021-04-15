# react-native-signature-canvas

[![](https://img.shields.io/npm/l/react-native-signature-canvas.svg)](https://www.npmjs.com/package/react-native-signature-canvas)
[![](https://img.shields.io/npm/v/react-native-signature-canvas)](https://www.npmjs.com/package/react-native-signature-canvas)
![npm](https://img.shields.io/npm/dt/react-native-signature-canvas)
![GitHub last commit](https://img.shields.io/github/last-commit/yanyuanfe/react-native-signature-canvas)


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
npm install --save react-native-signature-canvas
```

## Installation(for React Native V0.5x.x or Expo SDK < v33)

```bash
npm install --save react-native-signature-canvas@1.4.2
```

## Usage

``` js
import Signature from 'react-native-signature-canvas';
```

## Properties
-------------
| Prop  | Type | Description |
| :------------ |:---------------:| :---------------|
| descriptionText | `string` | description text for signature |
| clearText | `string` | clear button text |
| confirmText | `string` | save button text |
| webStyle | `string` | webview style for overwrite default style, all style: https://github.com/YanYuanFE/react-native-signature-canvas/blob/master/h5/css/signature-pad.css |
| onOK | `function` | handle function when you click save button |
| onEmpty | `function` | handle function of empty signature when you click save button |
| onClear | `function` | handle function when you click clear button
| onBegin | `function` | handle function when a new stroke is started
| onEnd | `function` | handle function when the stroke has ended
| customHtml | `function` | html string that lets you modify things like the layout or elements.
| autoClear | `boolean` | is auto clear the signature after click confirm button
| trimWhitespace | `boolean` | trim image whitespace
| rotated | `boolean` | rotate signature pad 90 degrees
| imageType | `string` | default is "", "image/jpeg"、"image/svg+xml", imageType of export signature
| dataURL | `string` | default is "", Base64 string, Draws signature image from data URL.
| penColor | `string` | default is "black", color of pen
| backgroundColor | `string` | default is "rgba(255,255,255,1)", backgroundColor of canvas
| dotSize | `number` | radius of a single dot
| minWidth | `number` | minimum width of a line. Defaults to 0.5
| androidHardwareAccelerationDisabled | `boolean` |androidHardwareAccelerationDisabled for react-native-webview. Default is false
| style | `object` | style of wrapper view

## Methods
-------------
| Function  | Description |
| :------------ |:---------------|
| readSignature() | Reads the current signature on the canvas and triggers either the onOK or onEmpty callbacks |
| clearSignature() | Clears the current signature |

You need to use ref like:
``` js
import SignatureScreen from 'react-native-signature-canvas';

const Sign = ({text, onOK}) => {
  const ref = useRef();

  const handleSignature = signature => {
    console.log(signature);
    onOK(signature);
  };

  const handleEmpty = () => {
    console.log('Empty');
  }

  const handleClear = () => {
    console.log('clear success!');
  }

  const handleEnd = () => {
      ref.current.readSignature();
  }

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
}

export default Sign;
```

##  Save Base64 Image as File

If you use expo, you can use **expo-file-system** for save base64 image as local file, if you use react-native-cli, use **react-native-fs**.

``` js
import * as FileSystem from 'expo-file-system';

const handleSignature = signature => {
    const path = FileSystem.cacheDirectory + 'sign.png';
    FileSystem.writeAsStringAsync(path, signature.replace('data:image/png;base64,', ''), {encoding: FileSystem.EncodingType.Base64}).then(res => {
      console.log(res);
      FileSystem.getInfoAsync(path, {size: true, md5: true}).then(file => {
        console.log(file);
      })
    }).catch(err => {
      console.log("err", err);
    })
};

```

## Basic parameters

``` js
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
    }`
  }
  autoClear={true}
  imageType={"image/svg+xml"}
/>

```
If you create your own triggers for the readSignature and/or clearSignature you can hide the built in Clear and Save buttons with css styles passed into the **webStyle** property.

``` js
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

``` js
import React, {useRef} from 'react';
import { StyleSheet, View, Button } from 'react-native';
import SignatureScreen from 'react-native-signature-canvas';

const Sign = ({onOK}) => {
  const ref = useRef();

  const handleSignature = signature => {
    console.log(signature);
    onOK(signature);
  };

  const handleClear = () => {
    ref.current.clearSignature();
  }

  const handleConfirm = () => {
    console.log("end");
    ref.current.readSignature();
  }

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  return (
    <View style={styles.container}>
      <SignatureScreen
          ref={ref}
          onOK={handleSignature} 
          webStyle={style}
      />
      <View style={styles.row}>
        <Button
            title="Clear"
            onPress={handleClear}
        />
        <Button
          title="Confirm"
          onPress={handleConfirm}
        />
      </View>
    </View>
  );
}

export default Sign;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    padding: 10,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  }
});

```


## Example

* Android <br/>
<img src="http://img.yanyuanfe.cn/signature-android.png" width="400" />

*  iOS <br/>
<img src="http://img.yanyuanfe.cn/signature-ios.png" width="400" />


```js
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Signature from 'react-native-signature-canvas';

export const SignatureScreen = () => {
  const [signature, setSign] = useState(null);

  const handleSignature = signature => {
    console.log(signature);
    setSign(signature);
  };

  const handleEmpty = () => {
    console.log('Empty');
  }

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
        onOK={handleSignature}
        onEmpty={handleEmpty}
        descriptionText="Sign"
        clearText="Clear"
        confirmText="Save"
        webStyle={style}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  preview: {
    width: 335,
    height: 114,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
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
    marginTop: 10
  }
});
```

## Using Typescript

To use Typescript just import `SignatureViewRef` and in [useRef hook](https://reactjs.org/docs/hooks-reference.html#useref) inform that the reference is of the `SignatureViewRef` type, with that the `readSignature` and `clearSignature` methods will be available.

```ts
import React, { useRef } from 'react';
import SignatureScreen, { SignatureViewRef } from 'react-native-signature-canvas';

interface Props {
  text: string;
  onOK: (signature) => void;
}

const Sign: React.FC<Props> = ({text, onOK}) => {
  const ref = useRef<SignatureViewRef>(null);

  const handleSignature = signature => {
    console.log(signature);
    onOK(signature);
  };

  const handleEmpty = () => {
    console.log('Empty');
  }

  const handleClear = () => {
    console.log('clear success!');
  }

  const handleEnd = () => {
      ref.current?.readSignature();
  }

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
}

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
