# react-native-signature-canvas

[![](https://img.shields.io/npm/l/react-native-signature-canvas.svg)](https://www.npmjs.com/package/react-native-signature-canvas)

React Native Signature Component based Canvas for Android &amp;&amp; IOS &amp;&amp; expo

- Supports Android and iOS and Expo
- Pure JavaScript implementation with no native dependencies
- Tested with RN 0.50
- Core use [signature_pad.js](https://github.com/szimek/signature_pad)
- Only depend on react and react native
- Generates a base64 encoded png image of the signature
Note: Expo support for React Native Signature Canvas v1.5.0 started with Expo SDK v33.0.0.

## Installation(for React Native V0.60.0 or Expo SDK v33.0.0)

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
    }`}
/>

```



## Example

* Android <br/>
<img src="http://img.yanyuanfe.cn/signature-android.png" width="400" />
* iOS <br/>
<img src="http://img.yanyuanfe.cn/signature-ios.png" width="400" />


```js
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import Signature from 'react-native-signature-canvas';

export default class SignatureScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { signature: null };
  }

  handleSignature = signature => {
    this.setState({ signature });
  };

  handleEmpty = () => {
    console.log('Empty');
  }

  render() {
    const style = `.m-signature-pad--footer
    .button {
      background-color: red;
      color: #FFF;
    }`;
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.preview}>
          {this.state.signature ? (
            <Image
              resizeMode={"contain"}
              style={{ width: 335, height: 114 }}
              source={{ uri: this.state.signature }}
            />
          ) : null}
        </View>
        <Signature
          onOK={this.handleSignature}
          onEmpty={this.handleEmpty}
          descriptionText="Sign"
          clearText="Clear"
          confirmText="Save"
          webStyle={style}
        />
      </View>
    );
  }
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
